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

type master = {
  signalingClient: KVSWebRTC.SignalingClient | null,
  peerConnectionByClientId: {
    [remoteClientId: string]: RTCPeerConnection
  },
  localStream: MediaStream | null,
  remoteStreams: MediaStream[],
  peerConnectionStatsInterval: null,
  localView: any,
  // remoteView: any
}

const Content = (props: Props) => {
  let localView = React.useRef<HTMLVideoElement>(null)
  // let remoteView = React.useRef<HTMLVideoElement>(null)
  let remoteViewList = React.useRef<HTMLDivElement>(null)

  const master: master = {
    signalingClient: null,
    peerConnectionByClientId: {},
    localStream: null,
    remoteStreams: [],
    peerConnectionStatsInterval: null,
    localView: localView,
    // remoteView: remoteView
  };

  const startMaster = async (props: any) => {

    // Create KVS client
    //シグナリング（中継）サーバーとの接続用オブジェクト作成
    const kinesisVideoClient = new AWS.KinesisVideo({
      region: props.region,
      accessKeyId: props.accessKeyId,
      secretAccessKey: props.secretAccessKey,
      sessionToken: props.sessionToken,
      endpoint: props.endpoint,
      correctClockSkew: true,
    });

    // Get signaling channel ARN
    //チャンネルARN（固有ID）取得
    const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
        ChannelName: props.channelName,
      })
      .promise();

    const channelARN = describeSignalingChannelResponse.ChannelInfo?.ChannelARN || '';
    console.log('[MASTER] Channel ARN: ', channelARN);

    // Get signaling channel endpoints
    //チャンネルエンドポイント取得。Master用のエンドポイント取得。
    const getSignalingChannelEndpointResponse = await kinesisVideoClient.getSignalingChannelEndpoint({
      ChannelARN: channelARN,
      SingleMasterChannelEndpointConfiguration: {
        Protocols: ['WSS', 'HTTPS'],
        Role: KVSWebRTC.Role.MASTER,
      },
    }).promise();

    //websocket用のプロトコルとhttpsプロトコルのエンドポイント取得。
    const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList?.reduce((endpoints: any, endpoint: AWS.KinesisVideo.ResourceEndpointListItem) => {
      let key: string = endpoint.Protocol || '';
      endpoints[key] = endpoint.ResourceEndpoint;
      return endpoints;
    }, {});
    console.log('[MASTER] Endpoints: ', endpointsByProtocol);

    // Create Signaling Client
    //マスターとしてWebsoketのエンドポイントにアクセス
    master.signalingClient = new KVSWebRTC.SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      role: KVSWebRTC.Role.MASTER,
      region: props.region,
      credentials: {
        accessKeyId: props.accessKeyId,
        secretAccessKey: props.secretAccessKey,
        sessionToken: props.sessionToken,
      },
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
    });

    // Get ICE server configuration ICEサーバーの設定はhttpsなんだ。httpsじゃないとNAT超えができないのかな？
    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: props.region,
      accessKeyId: props.accessKeyId,
      secretAccessKey: props.secretAccessKey,
      sessionToken: props.sessionToken,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
    });
    //ICEサーバーのレスポンスを取得
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
        ChannelARN: channelARN,
      })
      .promise();
    const iceServers = [];
    //ICEサーバーにURL追加
    console.log(`stun:stun.kinesisvideo.${props.region}.amazonaws.com:443`)
    iceServers.push({ urls: `stun:stun.kinesisvideo.${props.region}.amazonaws.com:443` });
    //ICEサーバーのレスポンスの要素を配列に突っ込む
    getIceServerConfigResponse.IceServerList?.forEach(iceServer =>
      iceServers.push({
        urls: iceServer.Uris,
        username: iceServer.Username,
        credential: iceServer.Password,
      }),
    );
    console.log('[MASTER] ICE servers: ', iceServers);

    // ローカルとリモートを接続するオプション（WebRTC)
    const configuration: RTCConfiguration = {
      iceServers,
      iceTransportPolicy: "relay",
    };

    const resolution = { width: { ideal: 640 }, height: { ideal: 480 } };
    const constraints = {
      video: resolution,
      audio: true,
    };

    // Get a stream from the webcam and display it in the local view
    try {
      master.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      localView.current!.srcObject = master.localStream;
    } catch (e) {
      console.error('[MASTER] Could not find webcam');
    }

    master.signalingClient.on('open', async () => {
      console.log('[MASTER] Connected to signaling service');
    });

    master.signalingClient.on('sdpOffer', async (offer: RTCSessionDescription, remoteClientId: string) => {
      console.log('[MASTER] Received SDP offer from client: ' + remoteClientId);
      // Create a new peer connection using the offer from the given client
      const peerConnection = new RTCPeerConnection(configuration)
      master.peerConnectionByClientId[remoteClientId] = peerConnection;

      // Send any ICE candidates to the other peer
      peerConnection.addEventListener('icecandidate', ({ candidate }) => {

        if (candidate) {
          console.log('[MASTER] Generated ICE candidate for client: ' + remoteClientId);

          // When trickle ICE is enabled, send the ICE candidates as they are generated.
          console.log('[MASTER] Sending ICE candidate to client: ' + remoteClientId);
          master.signalingClient?.sendIceCandidate(candidate, remoteClientId);
        }
      });

      // As remote tracks are received, add them to the remote view
      peerConnection.addEventListener('track', event => {
        console.log('[MASTER] Received remote track from client: ' + remoteClientId);
        // if (remoteView.current?.srcObject) {
        //   return;
        // }

        master.remoteStreams = [...event.streams];
        console.log(master.remoteStreams)
        master.remoteStreams.forEach(stream => {
          console.log(stream)
          const videoElement = document.createElement('video')
          videoElement.className = "remote-view"
          videoElement.autoplay = true
          videoElement.controls = true
          videoElement.srcObject = stream
          remoteViewList.current!.append(videoElement)
        })

        {/* <video className="remote-view" autoPlay playsInline controls ref={remoteView} /> */ }

      });

      master.localStream?.getTracks().forEach(track => peerConnection.addTrack(track, master.localStream!));
      await peerConnection.setRemoteDescription(offer);

      // Create an SDP answer to send back to the client
      console.log('[MASTER] Creating SDP answer for client: ' + remoteClientId);
      await peerConnection.setLocalDescription(
        await peerConnection.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        }),
      );

      // When trickle ICE is enabled, send the answer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      console.log('[MASTER] Sending SDP answer to client: ' + remoteClientId);
      master.signalingClient?.sendSdpAnswer(peerConnection.localDescription!, remoteClientId);
      console.log('[MASTER] Generating ICE candidates for client: ' + remoteClientId);
    });

    master.signalingClient.on('iceCandidate', async (candidate, remoteClientId) => {
      console.log('[MASTER] Received ICE candidate from client: ' + remoteClientId);

      // Add the ICE candidate received from the client to the peer connection
      const peerConnection = master.peerConnectionByClientId[remoteClientId];
      peerConnection.addIceCandidate(candidate);
    });

    master.signalingClient.on('close', () => {
      console.log('[MASTER] Disconnected from signaling channel');
    });

    master.signalingClient.on('error', () => {
      console.error('[MASTER] Signaling client error');
    });

    console.log('[MASTER] Starting master connection');
    master.signalingClient.open();
  }

  const stopMaster = () => {

    console.log(master)

    console.log('[MASTER] Stopping master connection');
    if (master.signalingClient) {
      master.signalingClient.close();
      master.signalingClient = null;
    }

    Object.keys(master.peerConnectionByClientId).forEach(clientId => {
      master.peerConnectionByClientId[clientId].close();
    });
    master.peerConnectionByClientId = {};

    if (master.localStream) {
      master.localStream.getTracks().forEach(track => track.stop());
      master.localStream = null;
    }

    master.remoteStreams.forEach(remoteStream => remoteStream.getTracks().forEach((track: any) => track.stop()));
    master.remoteStreams = [];

    if (master.peerConnectionStatsInterval) {
      clearInterval(master.peerConnectionStatsInterval!);
      master.peerConnectionStatsInterval = null;
    }

    if (master.localView && null !== master.localView.current.srcObject) {
      master.localView.current.srcObject = null;
    }

    // if (master.remoteView && null !== master.remoteView.current.srcObject) {
    //   master.remoteView.current.srcObject = null;
    // }
  }

  return (
    <>
      <button id="master-button" type="button" className="btn btn-primary" onClick={() => {
        startMaster(props);
      }}>Start Master</button>
      <button id="stop-master-button" type="button" className="btn btn-primary" onClick={() => {
        stopMaster();
      }}
      >Stop Master</button>
      <div id="master" className="d-none">
        <h2>Master</h2>
        <div className="row">
          <div className="col">
            <h5>Master Section</h5>
            <div className="video-container">
              <video className="local-view" autoPlay playsInline controls muted ref={localView} />
            </div>
          </div>
          <div className="col">
            <h5>Viewer Return Channel</h5>
            <div className="video-container remote-view-list" ref={remoteViewList}>
              {/* <video className="remote-view" autoPlay playsInline controls ref={remoteView} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Content;
