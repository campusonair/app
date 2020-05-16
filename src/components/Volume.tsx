import * as React from "react";

type Props = {
  media: Promise<MediaStream> | undefined
};

const style: React.CSSProperties = {
  width: "20px",
  height: "100%",
}

const Content = (props: Props) => {
  const canvasContainer = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (!props.media || !canvasContainer || !canvasContainer.current) {
      return
    }


    props.media.then((stream) => {
      const audioContext = new AudioContext();
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

          console.log(values)

          const average = values / length;
          console.log(average)
          console.log(length)

          canvasContext.fillRect(0, 0, 100, 300);
          canvasContext.fillStyle = '#00A285';
          canvasContext.clearRect(0, 0, 100, 300 - average);
        }
      }
    })

  }, [props.media, canvasContainer])

  return (
    <div className="volume"><canvas ref={canvasContainer} style={style} width="100" height="300"></canvas></div>
  );
};

export default Content;
