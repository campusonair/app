import Peer from 'skyway-js'
import Config from '../config'

export const joinLive = (liveId: string | undefined, userMedia: Promise<MediaStream>, guestVideos: React.RefObject<HTMLDivElement>
) => {

  const peer = new Peer({ key: Config.skyWayApiKey });

  userMedia.then(localStream => {

    peer.on('open', () => {

      const room = peer.joinRoom(liveId!, {
        mode: 'sfu',
        stream: localStream,
      });

      //Call when new user entered.
      room.on('stream', async stream => {

        if (stream.peerId === peer.id) {
          return
        }

        const newVideoContainer = document.createElement('div');
        newVideoContainer.className = 'guests videos';

        const newInnerContainer = document.createElement('div');
        newInnerContainer.className = 'video';

        const newVideo = document.createElement('video');
        //Set new user's stream.
        newVideo.srcObject = stream;
        //Set data-peer-id for stop this video for later.
        newVideo.setAttribute('data-peer-id', stream.peerId);

        //append everthing
        newInnerContainer.appendChild(newVideo);
        newVideoContainer.appendChild(newInnerContainer);
        guestVideos.current!.append(newVideoContainer);

        await newVideo.play().catch(console.error);
      });
    })
  })
}
