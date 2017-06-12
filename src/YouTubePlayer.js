import React, { Component } from 'react'
import YouTube from 'react-youtube'

let loadYT

class YouTubePlayer extends Component {

  render () {
    const opts = {
      height: '300',
      width: '500'

    }
    return (
      <YouTube 
        videoId={this.props.videoId} 
        opts={opts} />
    )
  }
}

export default YouTubePlayer;

