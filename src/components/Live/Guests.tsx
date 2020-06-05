import * as React from "react";
import Guest from './Guest'

type Props = {
  media: MediaStream | null,
  leave: string | null,
  canvasAddVideo:(video: HTMLVideoElement | null ) => void,
  canvasRemoveVideo:(video: HTMLVideoElement | null ) => void,
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

  React.useEffect(() => {
    if (!guestMedias) {
      return
    }

  }, [guestMedias])

  return (
    <div className={"guests videos"}>
      {
        guestMedias.map((stream)=>{
          return <Guest media={stream} key={stream.id} canvasAddVideo={props.canvasAddVideo} canvasRemoveVideo={props.canvasRemoveVideo} muted={false} leave={props.leave}/>
        })
      }
    </div>
  )
}

export default Content
