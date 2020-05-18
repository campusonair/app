import * as React from "react";
import { FaMicrophone } from "react-icons/fa";

type Props = {
  media: Promise<MediaStream> | undefined;
};

const style: React.CSSProperties = {
  width: "20px",
  height: "100%",
}

const Content = (props: Props) => {
  const canvasContainer = React.useRef<HTMLCanvasElement>(null)
  const [ micColor, setMicColor ] = React.useState<string>('#555555')

  React.useEffect(() => {
    if (!props.media || !canvasContainer || !canvasContainer.current) {
      return
    }


    props.media.then((stream) => {
      if (stream.getAudioTracks().length) {
        setMicColor('#FF0000')
      }

      // @ts-ignore
      const _AudioContext = window.AudioContext || window.webkitAudioContext
      const audioContext = new _AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      if (canvasContainer.current) {
        const canvasContext = canvasContainer.current.getContext("2d");

        javascriptNode.onaudioprocess = () => {
          if (!canvasContext) {
            return
          }

          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);

          const length = array.length;

          let values = 0;
          for (var i = 0; i < length; i++) {
            values += (array[i]);
          }

          const average = values / length * 10; // 1000%

          let color = ' #58d68d'
          if (750 < average) {
            color = '#FF0000'
          }

          canvasContext.fillRect(0, 0, 100, 1000);
          canvasContext.fillStyle = color;
          canvasContext.clearRect(0, 0, 100, 1000 - average);
        }
      }
    }).catch((err) => {
      console.log(err.name + ": " + err.message);
    })

  }, [props, canvasContainer])

  return (
    <><canvas ref={canvasContainer} style={style} width="100" height="1000" /><FaMicrophone size="20px" color={micColor} /></>
  );
};

export default Content;
