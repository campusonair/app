import * as React from "react";
import { Container, Button } from 'react-bootstrap'
import { __ } from '@wordpress/i18n'
import Video from './Video'
import Volume from './Volume'
import { FaMicrophone } from "react-icons/fa";
import './Dashboard.scss'

type Props = {};

const Content = (props: Props) => {
  const videoContainer = React.useRef<HTMLDivElement>(null);
  const volumeContainer = React.useRef<HTMLDivElement>(null);

  const [ media, setMedia ] = React.useState<Promise<MediaStream>>()

  const setAspectRatio = () => {
    if (!videoContainer || !videoContainer.current || !volumeContainer || !volumeContainer.current) {
      return
    }

    const height = videoContainer.current.clientWidth * 0.562
    videoContainer.current.style.height = `${height}px`
    volumeContainer.current.style.height = `${height}px`
  }

  React.useEffect(() => {
    const videoOptions = {
      video: {
        width: 1280,
        height: 720
      },
      audio: true
    }

    setMedia(navigator.mediaDevices.getUserMedia(videoOptions))

    window.addEventListener('resize', setAspectRatio)
    setAspectRatio()
  }, [])

  return (
    <Container>
      <div>
        <div className="device-preview">
          <div ref={videoContainer} className="video-container"><Video media={media} /></div>
          <div ref={volumeContainer} className="volume-container"><Volume media={media} /><FaMicrophone size="20px" /></div>
        </div>
        <Button>{__("Create a studio")}</Button>
      </div>
    </Container>
  );
};

export default Content;
