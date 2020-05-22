import * as React from "react";

type Props = {}
console.log("aaaaaaaaaaaaaaaaaa")
const Content = (props: Props) => {
  console.log("bbbbbbbbbbbbbbbb")

  const container = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!container || !container.current) {
      return
    }
    console.log("cccccccccccccccccccccc")
  }, [container])

  return (
    <>
      <div ref={container}>Hello</div>
    </>
  )
}

export default Content
