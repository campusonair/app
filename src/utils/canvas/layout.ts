export const layoutCanvas = (canvas: React.RefObject<HTMLCanvasElement>, videos: Array<HTMLVideoElement>, videoIndex:number, layout:number) => {

   //Destination
  let destinationWidth;
  let destinationHeight;
  let destinationTopLeftX;
  let destinationTopLeftY;
  let destinationAspect;

    //Source
  let sourceWidth;
  let sourceHeight;
  let sourceTopLeftX;
  let sourceTopLeftY;

  // if(0 === layout){

    const indexDevidedLeft =videoIndex%2
    let row = 0;
    if(0 === indexDevidedLeft){
      row = videoIndex/2
    }
    //Destination
    destinationAspect = 0.5625 //16:9
    const devided = videos.length/2
    const devidedLeft = videos.length%2

    //Even Videos
    if(0 === devidedLeft && 2 !== videos.length){

      destinationWidth = canvas.current!.width / devided
      destinationHeight = destinationAspect * destinationWidth




      if(0 === indexDevidedLeft){
        destinationTopLeftX = destinationWidth * (videoIndex/devided)
        const rowNum = row -1 < 0 ? 0 : row - 1
        destinationTopLeftY = destinationHeight * rowNum  // 0
      }else{
        destinationTopLeftX = destinationWidth * ((videoIndex-1)/devided)
        destinationTopLeftY = destinationHeight * (row+1) //1
      }




    //Odd Videos
    }else{
      destinationWidth = canvas.current!.width / (videos.length ? videos.length : 1)
      destinationHeight = destinationAspect * destinationWidth
      destinationTopLeftX = destinationWidth * videoIndex
      destinationTopLeftY = (canvas.current!.height - destinationHeight)/2
    }

    //Source
    sourceWidth = videos[videoIndex]?.videoWidth
    sourceHeight = destinationAspect * sourceWidth
    sourceTopLeftX = 0
    sourceTopLeftY = (videos[videoIndex]?.videoHeight - sourceHeight)/2

  // }else{
  //   //Destination
  //   destinationWidth = canvas.current!.width / (videos.length ? videos.length : 1)
  //   destinationHeight = canvas.current!.height
  //   destinationTopLeftX = destinationWidth * videoIndex
  //   destinationTopLeftY = 0
  //   destinationAspect = destinationWidth/destinationHeight

  //   //Source
  //   sourceWidth = destinationAspect * videos[videoIndex]?.videoHeight
  //   sourceHeight = videos[videoIndex]?.videoHeight
  //   sourceTopLeftX = (videos[videoIndex]?.videoWidth - sourceWidth)/2
  //   sourceTopLeftY = 0
  // }

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
