import React from 'react'
import YouTube from 'react-youtube'

const YouTubePlayer = ({videoId}) => {
  const opts = {
    height: '300',
    width: '500'
  }
  return (
    <YouTube
      videoId={videoId}
      opts={opts} />
  )
}

export default YouTubePlayer;

