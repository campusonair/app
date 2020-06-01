import {getRenderArea} from "./getRenderArea"

export const clearCanvas = (canvas: React.RefObject<HTMLCanvasElement>, canvasVideos: Array<HTMLVideoElement>, splitScreenBy:number) => {

  const {renderStartX, renderStartY, renderWidth, renderHeight} = getRenderArea(canvas,canvasVideos,splitScreenBy)
  const canvas2D = canvas!.current!.getContext("2d", { desynchronized: true });
  canvas2D!.clearRect( renderStartX, renderStartY, renderWidth, renderHeight)

}
