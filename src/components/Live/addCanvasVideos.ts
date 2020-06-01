import {getRenderArea} from './getRenderArea'

export const addCanvasVideos = (canvas: React.RefObject<HTMLCanvasElement>, canvasVideos: Array<HTMLVideoElement>) => {

    if (!canvas || !canvas.current ||  !canvasVideos){
      return false;
    }

    const canvas2D = canvas.current.getContext("2d", { desynchronized: true });

    canvas2D!.clearRect( 0, 0, canvas.current!.width, canvas.current!.height)


    canvasVideos.forEach((video,index)=>{

      //Render Area in Canvas
      const {renderStartX, renderStartY, renderWidth, renderHeight} = getRenderArea(canvas, canvasVideos, index)

      //Cropped Video Size
      const targetAspect = renderWidth/renderHeight
      const cropWidth = targetAspect * video.videoHeight
      const cropHeight = video.videoHeight
      const cropStartX = (video.videoWidth - cropWidth)/2
      const cropStartY = 0
      canvas2D!.drawImage(video, cropStartX, cropStartY, cropWidth , cropHeight , renderStartX, renderStartY, renderWidth, renderHeight);
    })

    requestAnimationFrame(()=>{
      addCanvasVideos(canvas, canvasVideos)
    })
  };

  export default addCanvasVideos;
