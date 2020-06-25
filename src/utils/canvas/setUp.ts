interface CanvasElement extends HTMLCanvasElement {
  captureStream(): MediaStream;
}

export const setUpCanvas = (canvas:React.RefObject<CanvasElement>,localStream:MediaStream) =>{
  if(!canvas.current?.captureStream()){
    return
  }
  const video_stream = new MediaStream();
  video_stream.addTrack(canvas.current?.captureStream().getVideoTracks()[0])
  localStream.getAudioTracks().forEach(track => track.enabled = false);
  video_stream.addTrack(localStream.getAudioTracks()[0])
  return video_stream
}
