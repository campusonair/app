interface CanvasElement extends HTMLCanvasElement {
  captureStream(): MediaStream;
}

export const setUpCanvas = (canvas:React.RefObject<CanvasElement>,localStream:MediaStream) =>{
  if(!canvas.current?.captureStream()){
    return
  }
  localStream.addTrack(canvas.current?.captureStream().getVideoTracks()[0])
  localStream.getAudioTracks().forEach(track => track.enabled = false);
  return localStream
}
