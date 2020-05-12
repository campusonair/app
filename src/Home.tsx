import * as React from "react";
import AWS from "aws-sdk";
import "./Home.scss";
import Master from "./Master";
import Viewer from "./Viewer";

type Props = {};
type Credentials = {
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
  channelName: string,
  clientId: string,
  sessionToken: null,
  endpoint: null,
}

const Content = (props: Props) => {

  const accessKeyId = React.useRef<HTMLInputElement>(null)
  const secretAccessKey = React.useRef<HTMLInputElement>(null)
  const channelName = React.useRef<HTMLInputElement>(null)
  const clientId = React.useRef<HTMLInputElement>(null)

  const [credentials, setCredentials] = React.useState({
    region: 'ap-northeast-1',
    accessKeyId: accessKeyId.current?.value || '',
    secretAccessKey: secretAccessKey.current?.value || '',
    channelName: channelName.current?.value || '',
    clientId: clientId.current?.value || '',
    sessionToken: null,
    endpoint: null,
  })

  const setValue = () => {
    const config: Credentials = {
      region: 'ap-northeast-1',
      accessKeyId: accessKeyId.current?.value || '',
      secretAccessKey: secretAccessKey.current?.value || '',
      channelName: channelName.current?.value || '',
      clientId: clientId.current?.value || '',
      sessionToken: null,
      endpoint: null,
    }
    setCredentials(config);
  }

  const createSignalingChannel = async (props: Credentials) => {
    // Create KVS client
    const kinesisVideoClient = new AWS.KinesisVideo({
      region: props.region,
      accessKeyId: props.accessKeyId,
      secretAccessKey: props.secretAccessKey
    });

    // Get signaling channel ARN
    await kinesisVideoClient.createSignalingChannel({
      ChannelName: props.channelName,
    }).promise();

    // Get signaling channel ARN
    const describeSignalingChannelResponse = await kinesisVideoClient.describeSignalingChannel({
      ChannelName: props.channelName,
    }).promise();

    const channelARN = describeSignalingChannelResponse.ChannelInfo?.ChannelARN;
    console.log('[CREATE_SIGNALING_CHANNEL] Channel ARN: ', channelARN);
  }

  return (
    <>
      <form id="form">
        <h4>KVS Endpoint</h4>
        <h4>AWS Credentials</h4>
        <div className="form-group">
          <label>Access Key ID</label>
          <input type="text" className="form-control" id="accessKeyId" placeholder="Access key id" ref={accessKeyId} onChange={setValue} />
        </div>
        <div className="form-group">
          <label>Secret Access Key</label>
          <input type="password" className="form-control" id="secretAccessKey" placeholder="Secret access key" ref={secretAccessKey} onChange={setValue} />
        </div>
        <h4>Signaling Channel</h4>
        <div className="form-group">
          <label>Channel Name</label>
          <input type="text" className="form-control" id="channelName" placeholder="Channel" ref={channelName} onChange={setValue} />
        </div>
        <div className="form-group">
          <label>Client Id <small>(optional)</small></label>
          <input type="text" className="form-control" id="clientId" placeholder="Client id" ref={clientId} onChange={setValue} />
        </div>
        <div>
          <button id="create-channel-button" type="button" className="btn btn-primary"
            onClick={() => {
              createSignalingChannel(credentials);
            }}
          >
            Create Channel
          </button>
          <Master {...credentials} />
          <Viewer {...credentials} />
        </div>
      </form>
    </>
  )
};

export default Content;
