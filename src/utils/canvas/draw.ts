import {layoutCanvas} from './layout'

export const drawCanvas = (canvas: React.RefObject<HTMLCanvasElement>, videos: Array<HTMLVideoElement>,layout:number) => {

    if (!canvas || !canvas.current ||  !videos){
      return false;
    }

    const canvas2D = canvas.current.getContext("2d", { desynchronized: true });
    canvas2D!.clearRect( 0, 0, canvas.current!.width, canvas.current!.height)

    videos.forEach((video,index)=>{
      const { sourceTopLeftX, sourceTopLeftY, sourceWidth, sourceHeight,  destinationTopLeftX, destinationTopLeftY, destinationWidth, destinationHeight} = layoutCanvas(canvas,videos,index,layout)
      // console.log(sourceTopLeftX, sourceTopLeftY, sourceWidth, sourceHeight,  destinationTopLeftX, destinationTopLeftY, destinationWidth, destinationHeight)
      canvas2D!.drawImage(video, sourceTopLeftX, sourceTopLeftY, sourceWidth, sourceHeight,  destinationTopLeftX, destinationTopLeftY, destinationWidth, destinationHeight);

    })

    requestAnimationFrame(()=>{
      drawCanvas(canvas, videos,layout)
    })
  };

export default drawCanvas;
