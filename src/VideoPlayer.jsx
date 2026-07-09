import React, {forwardRef, useImperativeHandle} from 'react';
import YouTube from 'react-youtube';

//isPlaying, setIsPlaying are lifted to App
// allows sibling components can read current play state 
// and pass ability to control playback without needing the player instance
const VideoPlayer = forwardRef(function VideoPlayer(
  { selectedVideoId, isPlaying, setIsPlaying },
  ref
) {
  const playerRef = React.useRef(null);
 
  const onReady = (event) => {
    playerRef.current = event.target;
  };
 
  const onStateChange = (event) => {
    // youtube player states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
    setIsPlaying(event.data === 1);
  };
 
  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.playVideo(),
    pause: () => playerRef.current?.pauseVideo(),
    toggle: () => {
      if (!playerRef.current) return;
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    },
  }));
 
  const opts = {
    width: '100%',
    height: '100%',
    playerVars: { autoplay: 0 },
  };
 
  return (
    <YouTube
      videoId={selectedVideoId}
      opts={opts}
      onReady={onReady}
      onStateChange={onStateChange}
      className="iframe"
    />
  );
});
 
export default VideoPlayer;
 
