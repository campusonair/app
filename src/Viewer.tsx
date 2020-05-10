import * as React from "react";

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div id="viewer" className="d-none">
        <h2>Viewer</h2>
        <div className="row">
          <div className="col">
            <h5>Return Channel</h5>
            <div className="video-container"><video className="local-view" autoPlay playsInline controls muted />
            </div>
          </div>
          <div className="col">
            <h5>From Master</h5>
            <div className="video-container"><video className="remote-view" autoPlay playsInline controls /></div>
          </div>
        </div>
        <div className="row datachannel">
          <div className="col">
            <div className="form-group">
              <textarea className="form-control local-message"
                placeholder="DataChannel Message"> </textarea>
            </div>
          </div>
          <div className="col">
            <div className="card bg-light mb-3">
              <pre className="remote-message card-body text-monospace preserve-whitespace"></pre>
            </div>
          </div>
        </div>
        <div>
          <span className="send-message datachannel d-none">
            <button type="button" className="btn btn-primary">Send DataChannel Message</button>
          </span>
          <button id="stop-viewer-button" type="button" className="btn btn-primary">Stop Viewer</button>
        </div>
      </div>
    </>
  );
};
export default Content;
