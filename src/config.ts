type _Config = {
  skyWayApiKey: string;
  domain: string;
  clientId: string;
}

const Config: _Config = {
  skyWayApiKey: process.env.REACT_APP_SKYWAY_API_KEY || "",
  domain: process.env.REACT_APP_AUTH0_DOMAIN || "",
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || ""
}

export default Config
