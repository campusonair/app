type Props = {
  stream: MediaStream|null,
  mute:boolean
};

export const mute = ( stream: MediaStream|null, mute:boolean )=>{

  if(!stream ){
    return null
  }

  stream.getAudioTracks().forEach(track => track.enabled = mute);
  return stream
}
