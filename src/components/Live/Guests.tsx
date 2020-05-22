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
    setGuestMedias([...guestMedias,props.media])

  }, [props.media])

  return (
    <>
    {
      guestMedias.map((stream)=>{
        return <Guest media={stream} key={stream.id}/>
      })
    }
    </>
  )
}

export default Content
