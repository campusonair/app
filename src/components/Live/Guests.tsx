import * as React from "react";
import Guest from './Guest'

type Props = {
  media: MediaStream | null,
  leave: string | null
}

const Content = (props: Props) => {

  const [guestMedias, setGuestMedias] = React.useState<Array<MediaStream>>([])

  React.useEffect(() => {
    if (!props.media) {
      return
    }
    setGuestMedias([...guestMedias,props.media])
  }, [props.media,guestMedias])

  React.useEffect(() => {
    if (!props.leave || !guestMedias) {
      return
    }
    let leaveIdRemoved = guestMedias.filter((media:any)=>{
      return media.peerId !== props.leave
    })
    setGuestMedias(leaveIdRemoved)
  }, [props.leave,guestMedias])

  return (
    <div className={"guests videos"}>
      {
        guestMedias.map((stream)=>{
          return <Guest media={stream} key={stream.id}/>
        })
      }
    </div>
  )
}

export default Content
