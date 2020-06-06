import {layoutCanvas} from "./layout"

export const clearCanvas = (canvas: React.RefObject<HTMLCanvasElement>, videos: Array<HTMLVideoElement>, videoIndex:number,layout:number) => {

  const { destinationTopLeftX, destinationTopLeftY, destinationWidth, destinationHeight} = layoutCanvas(canvas,videos,videoIndex,layout)

  const canvas2D = canvas!.current!.getContext("2d", { desynchronized: true })

  canvas2D!.clearRect(  destinationTopLeftX, destinationTopLeftY, destinationWidth, destinationHeight)

}
