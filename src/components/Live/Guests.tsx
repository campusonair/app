import * as React from "react";
import Guest from './Guest'

type Props = {
  media: MediaStream | null,
  leave: string | null,
  onSetCanvasMedia:(video: HTMLVideoElement | null ) => void,
  onRemoveCanvasMedia:(video: HTMLVideoElement | null ) => void
}

const Content = (props: Props) => {

  const [guestMedias, setGuestMedias] = React.useState<Array<MediaStream>>([])

  React.useEffect(() => {
    if (!props.media) {
      return
    }
    setGuestMedias([...guestMedias,props.media])
  }, [props.media])

  React.useEffect(() => {
    if (!props.leave || !guestMedias) {
      return
    }
    let leaveIdRemoved = guestMedias.filter((media:any)=>{
      return media.peerId !== props.leave
    })
    setGuestMedias(leaveIdRemoved)
  }, [props.leave])

  return (
    <div className={"guests videos"}>
      {
        guestMedias.map((stream)=>{
          return <Guest media={stream} key={stream.id} onSetCanvasMedia={props.onSetCanvasMedia} onRemoveCanvasMedia={props.onRemoveCanvasMedia}/>
        })
      }
    </div>
  )
}

export default Content
