import { ExecFileOptionsWithStringEncoding } from "child_process"

type _Config = {
  skyWayApiKey: string;
  domain: string;
  clientId: string;
}

const Config: _Config = {
  // @ts-ignore
  skyWayApiKey: process.env.REACT_APP_SKYWAY_API_KEY,
  // @ts-ignore
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  // @ts-ignore
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID
}

export default Config
