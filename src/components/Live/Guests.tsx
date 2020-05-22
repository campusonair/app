import * as React from "react";
import Guest from './Guest'

type Props = {
  media: MediaStream | null
}

const Content = (props: Props) => {

  const [guestMedias, setGuestMedias] = React.useState<Array<MediaStream>>([])

  React.useEffect(() => {
    if (!props.media) {
      return
    }
    guestMedias.push(props.media)
    setGuestMedias(guestMedias)

  }, [props.media])

  return (
    <>
    {
      console.log(guestMedias.length)
    }
    {
      (guestMedias && guestMedias.length >= 1 ) && guestMedias.map((stream)=>{
        console.log(stream)
        return <Guest stream={stream} key={stream.id}/>
      })
    }
    </>
  )
}

export default Content
