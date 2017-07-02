import React from 'react'
import YouTube from 'react-youtube'

const YouTubePlayer = ({
  videoId, handleVideoOnReady, handleVideoStateChange
}) => {
  const opts = {
    height: '300',
    width: '500'
  }

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={handleVideoOnReady}
      onStateChange={handleVideoStateChange}
    />
  )
}

export default YouTubePlayer;

