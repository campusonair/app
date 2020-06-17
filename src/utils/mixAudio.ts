
type Props = {
  canvasVideos:Array<HTMLVideoElement>,
  mixedMedia: MediaStream|null,
  audio:React.RefObject<HTMLAudioElement>,
  room:any
};

export const mixAudio = (props:Props)=>{
  if(!props.mixedMedia || !props.audio.current){
    return
  }

  let audioContext = new AudioContext();
  let splitter = audioContext.createChannelSplitter(2)
  let gain_node = audioContext.createGain()
  gain_node.gain.value = 1
  let merger = audioContext.createChannelMerger(2)
  let dist = audioContext.createMediaStreamDestination()

  if(0 === props.canvasVideos.length){
    props.mixedMedia.getAudioTracks().forEach(track => track.enabled = false);
    props.audio.current.srcObject = props.mixedMedia
    props.room.replaceStream(props.mixedMedia)
    return
  }

  props.canvasVideos.forEach(video =>{
    if(!video.srcObject || !('id' in video.srcObject)){
      return
    }
    video.srcObject.getAudioTracks().forEach(track => track.enabled = true);
    let source = audioContext.createMediaStreamSource(video.srcObject)
    source.connect(splitter)
    splitter.connect(gain_node)
    gain_node.connect(
      merger,
        0,
        0
      )
      merger.connect(dist)
  })

  let stream = dist.stream;
  if(!stream){
    return
  }

  if(props.mixedMedia.getAudioTracks()[0]){
    props.mixedMedia.removeTrack(props.mixedMedia.getAudioTracks()[0])
    props.mixedMedia.addTrack(stream.getAudioTracks()[0])
  }else{
    props.mixedMedia.addTrack(stream.getAudioTracks()[0])
  }
  props.audio.current.srcObject = props.mixedMedia
  props.room.replaceStream(props.mixedMedia)
}
