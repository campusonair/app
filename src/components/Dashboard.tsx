import * as React from "react";
import { Container, Button, Alert } from 'react-bootstrap'
import { __ } from '@wordpress/i18n'
import Video from './Video'
import Volume from './Volume'
import './Dashboard.scss'

type Props = {};

const Content = (props: Props) => {
  const videoContainer = React.useRef<HTMLDivElement>(null);
  const volumeContainer = React.useRef<HTMLDivElement>(null);

  const [ media, setMedia ] = React.useState<Promise<MediaStream>>()
  const [ allowCamera, setAllowCamera ] = React.useState<boolean>(false)
  const [ allowMic, setAllowMic ] = React.useState<boolean>(false)

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

    window.addEventListener('resize', setAspectRatio)
    setAspectRatio()
  }, [])

  return (
    <Container>
      <div className="dashboard">
        <div className="device-preview">
          <div ref={videoContainer} className="video-container"><Video media={media} allowed={setAllowCamera} /></div>
          <div ref={volumeContainer} className="volume-container"><Volume media={media} allowed={setAllowMic} /></div>
        </div>

        {(!allowCamera || !allowMic) && <Alert variant="danger">{__('To create a studio, please allow to access camera and micriphone.')}</Alert>}
        <p><Button variant="primary" size="lg" block disabled={!allowCamera || !allowMic}>{__("Create a studio")}</Button></p>
      </div>
    </Container>
  );
};

export default Content;
