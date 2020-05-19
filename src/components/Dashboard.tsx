import * as React from "react";
import { Container, Button, Alert } from 'react-bootstrap'
import { __ } from '@wordpress/i18n'
import Video from './Video'
import Volume from './Volume'
import './Dashboard.scss'

type Props = {
  buttonLabel: any,
  handleCreateStudio: () => Promise<void>
};

const Content = (props: Props) => {
  const videoContainer = React.useRef<HTMLDivElement>(null);
  const volumeContainer = React.useRef<HTMLDivElement>(null);

  const [media, setMedia] = React.useState<Promise<MediaStream>>()
  const [isEnabledDevice, setIsEnabledDevice] = React.useState<boolean>(false)

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

    const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)
    setMedia(userMedia)

    userMedia.then((stream) => {
      console.log(stream)
      setIsEnabledDevice(true)
    }).catch((err) => {
      setIsEnabledDevice(false)
    });

    window.addEventListener('resize', setAspectRatio)
    setAspectRatio()
  }, [])

  return (
    <Container>
      <div className="dashboard">
        {!isEnabledDevice && <Alert variant="danger">{__('To create a studio, please allow to access camera and micriphone.')}</Alert>}
        <div className="device-preview">
          <div ref={videoContainer} className="video-container"><Video media={media} /></div>
          <div ref={volumeContainer} className="volume-container"><Volume media={media} /></div>
        </div>

        <p><Button variant="primary" size="lg" block disabled={!isEnabledDevice} onClick={props.handleCreateStudio}>{props.buttonLabel}</Button></p>
      </div>
    </Container>
  );
};

export default Content;
