export const layoutCanvas = (canvas: React.RefObject<HTMLCanvasElement>, videos: Array<HTMLVideoElement>, videoIndex:number) => {

  //Destination
  const destinationWidth = canvas.current!.width / (videos.length ? videos.length : 1)
  const destinationHeight = canvas.current!.height
  const destinationTopLeftX = destinationWidth * videoIndex
  const destinationTopLeftY = 0
  const destinationAspect = destinationWidth/destinationHeight

  //Source
  const sourceWidth = destinationAspect * videos[videoIndex]?.videoHeight
  const sourceHeight = videos[videoIndex]?.videoHeight
  const sourceTopLeftX = (videos[videoIndex]?.videoWidth - sourceWidth)/2
  const sourceTopLeftY = 0

  return {
    "sourceTopLeftX":sourceTopLeftX,
    "sourceTopLeftY":sourceTopLeftY,
    "sourceWidth":sourceWidth,
    "sourceHeight":sourceHeight,
    "destinationTopLeftX":destinationTopLeftX,
    "destinationTopLeftY":destinationTopLeftY,
    "destinationWidth":destinationWidth,
    "destinationHeight":destinationHeight
  }
}
