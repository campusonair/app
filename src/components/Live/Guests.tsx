import * as React from "react";
import Guest from './Guest'

type Props = {
  media: any | null,
  leave: string | null,
  canvasAddVideo:(video: HTMLVideoElement | null ) => void,
  canvasRemoveVideo:(video: HTMLVideoElement | null ) => void,
  muted:boolean
}

const addMedia = (guestMedias:MediaStream[],media:any) =>{
  if(!guestMedias.includes(media)){
    return [...guestMedias,media]
  }else{
    return guestMedias
  }
}
const removeMedia = (guestMedias:MediaStream[],leave:string) =>{
  return guestMedias.filter((media:any)=>{
    return media.peerId !== leave
  })
}

const Content = (props: Props) => {

  const [guestMedias, setGuestMedias] = React.useState<Array<MediaStream>>([])

  React.useEffect(() => {

    if (!props.media) {
      return
    }
    setGuestMedias((guestMedias)=>{
       return addMedia(guestMedias,props.media)
      }
    )
  }, [props.media])

  React.useEffect(() => {
    if (!props.leave) {
      return
    }
    setGuestMedias(guestMedias => {
      return removeMedia(guestMedias,props.leave!)
    })
  }, [props.leave])

  return (
    <div className={"guests videos"}>
      {
        guestMedias.map((stream)=>{
          return <Guest key={stream.id} media={stream} canvasAddVideo={props.canvasAddVideo} canvasRemoveVideo={props.canvasRemoveVideo} muted={props.muted}/>
        })
      }
    </div>
  )
}

export default Content
