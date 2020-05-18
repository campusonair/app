import * as React from "react";

type Props = {};

const style: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#f5f5f5',
  border: '1px solid #CCCCCC',
}

const Content = (props: Props) => {
  const container = React.useRef<HTMLDivElement>(null);

  const setAspectRatio = () => {
    if (!container || !container.current) {
      return
    }

    const height = container.current.clientWidth * 0.562
    container.current.style.height = `${height}px`
  }

  React.useEffect(() => {
    if (!container || !container.current) {
      return
    }

    window.addEventListener('resize', () => {
      setAspectRatio()
    })

    setAspectRatio()
  }, [container])

  return (
    <div ref={container} style={style}>
      <p>This is a canvas element to preview the live!</p>
    </div>
  );
};

export default Content;
