export const getRenderArea = (canvas: React.RefObject<HTMLCanvasElement>, canvasMedias: Array<HTMLVideoElement>, splitScreenBy:number) => {

  const renderWidth = canvas.current!.width / (canvasMedias.length ? canvasMedias.length : 1)
  const renderHeight = canvas.current!.height
  const renderStartX = renderWidth * splitScreenBy
  const renderStartY = 0

  return {
    "renderWidth":renderWidth,
    "renderHeight":renderHeight,
    "renderStartX":renderStartX,
    "renderStartY":renderStartY
  }
}
