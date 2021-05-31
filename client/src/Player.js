import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri , native , url }) {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null

  
let defaultUrl = url?.preview_url || "https://p.scdn.co/mp3-preview/9e76937ee90908b8b3fc9cbac2dc8b702d1b3c0e?cid=960f87b99f6f4a3eb3d37403ed0e6321";
  let nativeAudioPlayer = (
    <div style={{width: '100%'}}>
      <audio src={defaultUrl} type="audio/ogg" controls />
    </div>

  );

  let spotifyAuidoplayer = (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  )


  return (
    <>{ native ? nativeAudioPlayer : spotifyAuidoplayer}</>
    )

  }
     
