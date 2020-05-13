import * as React from "react";
// import AWS from "aws-sdk";
// import * as KVSWebRTC from 'amazon-kinesis-video-streams-webrtc';

// type Props = {
//   region: string,
//   accessKeyId: string,
//   secretAccessKey: string,
//   channelName: string,
//   clientId: string,
//   sessionToken: null,
//   endpoint: null,
// };

// type master = {
//   signalingClient: KVSWebRTC.SignalingClient | null,
//   peerConnectionByClientId: {
//     [remoteClientId: string]: RTCPeerConnection
//   },
//   localStream: MediaStream | null,
//   remoteStreams: MediaStream[],
//   peerConnectionStatsInterval: null,
//   localView: any,
//   remoteView: any
// }

// const Content = (props: Props) => {


//   let localView = React.useRef<HTMLVideoElement>(null)
//   let remoteView = React.useRef<HTMLVideoElement>(null)

//   return (
//     <>
//       <div className="video-container">
//         {
//           master.remoteStreams.map(stream => { })
//         }
//         <video className="remote-view" autoPlay playsInline controls ref={remoteView} />
//       </div>
//     </>
//   );
// };
// export default Content;
