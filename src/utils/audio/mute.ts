type Props = {
  canvasVideos:Array<HTMLVideoElement>,
  mixedMedia: MediaStream|null,
  audio:React.RefObject<HTMLAudioElement>,
  room:any
};

export const muteAudio = (props:Props)=>{

  if(!props.mixedMedia || !props.audio.current || 0 !== props.canvasVideos.length){
    return
  }

  props.mixedMedia.getAudioTracks().forEach(track => track.enabled = false);
  props.audio.current.srcObject = props.mixedMedia
  props.room.replaceStream(props.mixedMedia)
}
