import * as React from "react";
import AWS from "aws-sdk";
import * as KVSWebRTC from 'amazon-kinesis-video-streams-webrtc';

type Props = {
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
  channelName: string,
  clientId: string,
  sessionToken: null,
  endpoint: null,
};

type viewer = {
  signalingClient: KVSWebRTC.SignalingClient | null,
  peerConnection: RTCPeerConnection | null,
  peerConnectionStatsInterval: any,
  localStream: MediaStream | null,
  remoteStream: MediaStream | null,
  localView: any,
  remoteView: any
}

const Content = (props: Props) => {

  let localView = React.useRef<HTMLVideoElement>(null)
  let remoteView = React.useRef<HTMLVideoElement>(null)

  const viewer: viewer = {
    signalingClient: null,
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    peerConnectionStatsInterval: null,
    localView: localView,
    remoteView: remoteView
  };

  const startViewer = async (props: any) => {

    const kinesisVideoClient = new AWS.KinesisVideo({
      region: props.region,
      accessKeyId: props.accessKeyId,
      secretAccessKey: props.secretAccessKey,
      sessionToken: props.sessionToken,
      endpoint: props.endpoint,
      correctClockSkew: true,
    });

    // Get signaling channel ARN
    const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
        ChannelName: props.channelName,
      })
      .promise();
    const channelARN = describeSignalingChannelResponse.ChannelInfo?.ChannelARN || '';
    console.log('[VIEWER] Channel ARN: ', channelARN);

    // Get signaling channel endpoints
    const getSignalingChannelEndpointResponse = await kinesisVideoClient
      .getSignalingChannelEndpoint({
        ChannelARN: channelARN,
        SingleMasterChannelEndpointConfiguration: {
          Protocols: ['WSS', 'HTTPS'],
          Role: KVSWebRTC.Role.VIEWER,
        },
      })
      .promise();
    const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList?.reduce((endpoints: any, endpoint: AWS.KinesisVideo.ResourceEndpointListItem) => {
      let key: string = endpoint.Protocol || '';
      endpoints[key] = endpoint.ResourceEndpoint;
      return endpoints;
    }, {});
    console.log('[VIEWER] Endpoints: ', endpointsByProtocol);

    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: props.region,
      accessKeyId: props.accessKeyId,
      secretAccessKey: props.secretAccessKey,
      sessionToken: props.sessionToken,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
    });

    // Get ICE server configuration
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
        ChannelARN: channelARN,
      })
      .promise();
    const iceServers = [];
    iceServers.push({ urls: `stun:stun.kinesisvideo.${props.region}.amazonaws.com:443` });
    getIceServerConfigResponse.IceServerList?.forEach(iceServer =>
      iceServers.push({
        urls: iceServer.Uris,
        username: iceServer.Username,
        credential: iceServer.Password,
      }),
    );
    console.log('[VIEWER] ICE servers: ', iceServers);

    // Create Signaling Client
    viewer.signalingClient = new KVSWebRTC.SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      clientId: props.clientId,
      role: KVSWebRTC.Role.VIEWER,
      region: props.region,
      credentials: {
        accessKeyId: props.accessKeyId,
        secretAccessKey: props.secretAccessKey,
        sessionToken: props.sessionToken,
      },
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
    });

    const resolution = { width: { ideal: 640 }, height: { ideal: 480 } };
    const constraints = {
      video: resolution,
      audio: props.sendAudio,
    };
    const configuration: RTCConfiguration = {
      iceServers,
      iceTransportPolicy: "relay",
    };

    viewer.peerConnection = new RTCPeerConnection(configuration);

    viewer.signalingClient.on('open', async () => {
      console.log('[VIEWER] Connected to signaling service');

      // Get a stream from the webcam, add it to the peer connection, and display it in the local view
      try {
        viewer.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        viewer.localStream.getTracks().forEach(track => viewer.peerConnection!.addTrack(track, viewer.localStream!));

        console.log(localView)

        localView.current!.srcObject = viewer.localStream;

      } catch (e) {
        console.error('[VIEWER] Could not find webcam');
        return;
      }

      // Create an SDP offer to send to the master
      console.log('[VIEWER] Creating SDP offer');
      await viewer.peerConnection!.setLocalDescription(
        await viewer.peerConnection!.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        }),
      );

      // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      console.log('[VIEWER] Sending SDP offer');
      viewer.signalingClient!.sendSdpOffer(viewer.peerConnection!.localDescription!);
      console.log('[VIEWER] Generating ICE candidates');
    });

    viewer.signalingClient.on('sdpAnswer', async answer => {
      // Add the SDP answer to the peer connection
      console.log('[VIEWER] Received SDP answer');
      await viewer.peerConnection!.setRemoteDescription(answer);
    });

    viewer.signalingClient.on('iceCandidate', candidate => {
      // Add the ICE candidate received from the MASTER to the peer connection
      console.log('[VIEWER] Received ICE candidate');
      viewer.peerConnection!.addIceCandidate(candidate);
    });

    viewer.signalingClient.on('close', () => {
      console.log('[VIEWER] Disconnected from signaling channel');
    });

    viewer.signalingClient.on('error', error => {
      console.error('[VIEWER] Signaling client error: ', error);
    });

    // Send any ICE candidates to the other peer
    viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        console.log('[VIEWER] Generated ICE candidate');

        // When trickle ICE is enabled, send the ICE candidates as they are generated.
        if (props.useTrickleICE) {
          console.log('[VIEWER] Sending ICE candidate');
          viewer.signalingClient!.sendIceCandidate(candidate);
        }
      } else {
        console.log('[VIEWER] All ICE candidates have been generated');

        // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
        if (!props.useTrickleICE) {
          console.log('[VIEWER] Sending SDP offer');
          viewer.signalingClient!.sendSdpOffer(viewer.peerConnection!.localDescription!);
        }
      }
    });

    // As remote tracks are received, add them to the remote view
    viewer.peerConnection.addEventListener('track', event => {
      console.log('[VIEWER] Received remote track');
      if (remoteView.current!.srcObject) {
        return;
      }
      viewer.remoteStream = event.streams[0];
      remoteView.current!.srcObject = viewer.remoteStream;
    });

    console.log('[VIEWER] Starting viewer connection');
    viewer.signalingClient.open();
  }


  function stopViewer() {

    console.log('[VIEWER] Stopping viewer connection');
    if (viewer.signalingClient) {
      viewer.signalingClient.close();
      viewer.signalingClient = null;
    }

    if (viewer.peerConnection) {
      viewer.peerConnection.close();
      viewer.peerConnection = null;
    }

    if (viewer.localStream) {
      viewer.localStream.getTracks().forEach(track => track.stop());
      viewer.localStream = null;
    }

    if (viewer.remoteStream) {
      viewer.remoteStream.getTracks().forEach(track => track.stop());
      viewer.remoteStream = null;
    }

    if (viewer.peerConnectionStatsInterval) {
      clearInterval(viewer.peerConnectionStatsInterval);
      viewer.peerConnectionStatsInterval = null;
    }

    if (viewer.localView && null !== viewer.localView.current.srcObject) {
      viewer.localView.srcObject = null;
    }

    if (viewer.remoteView && null !== viewer.remoteView.current.srcObject) {
      viewer.remoteView.srcObject = null;
    }
  }
  return (
    <>
      <button id="viewer-button" type="button" className="btn btn-primary"
        onClick={() => {
          startViewer(props)
        }}>Start Viewer</button>
      <button id="stop-viewer-button" type="button" className="btn btn-primary"
        onClick={() => {
          stopViewer()
        }}>Stop Viewer</button>
      <div id="viewer" className="d-none">
        <h2>Viewer</h2>
        <div className="row">
          <div className="col">
            <h5>Return Channel</h5>
            <div className="video-container">
              <video className="local-view" autoPlay playsInline controls muted ref={localView} />
            </div>
          </div>
          <div className="col">
            <h5>From Master</h5>
            <div className="video-container">
              <video className="remote-view" autoPlay playsInline controls ref={remoteView} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Content;
