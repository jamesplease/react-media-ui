import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useCurrentRef, useOnChange, useMountTransition } from 'core-hooks';
import Image from './image';

interface VideoProps extends React.MediaHTMLAttributes<HTMLVideoElement> {
  className?: string;
  poster?: string;
  pause?: boolean;
  mountVideo?: boolean;
  muted?: boolean;
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
}

const Video = forwardRef(
  (
    {
      className = '',
      // The URL of the video
      src,
      // The URL of the poster image. This name comes from the native <video/> element.
      poster,
      // Pass `true` to pause playback. Note that the video will stay mounted.
      pause = false,
      // Pass `false` and the video will not be mounted. This is a prop because video
      // elements are heavy, and you may wish to delay the mounting of the video for
      // performance reasons
      mountVideo = true,
      // Pass true to mute the video
      muted = false,
      // Additional props for the underlying <img/> element
      imgProps,
      ...props
    }: VideoProps,
    ref
  ) => {
    const loadedOnce = useRef(false);
    const internalVideoRef = useRef<HTMLVideoElement | null>(null);

    useImperativeHandle(ref, () => internalVideoRef.current);
    const playOnMountRef = useCurrentRef(!pause);

    const [videoState, setVideoState] = useState({
      // `isShowingVideo` enables the behavior where the image fades back in
      // after the video is complete without any additional configuration by
      // the user. Without this, when the video ends, it would remain
      // visible and mounted.
      isShowingVideo: false,
      started: false,
      playing: false,
      paused: true,
      ended: false,
    });

    // This ensures that the video always transitions out, even when
    // a user chooses to unmount it when it is visible
    const [shouldMount, useActiveClass] = useMountTransition({
      shouldBeMounted: mountVideo,
      transitionDurationMs: 250,
      // @ts-ignore
      onEntering() {
        if (playOnMountRef.current) {
          startPlayback();
        }
      },
    });

    // The video immediately mutes when the unmounting process begins
    useOnChange(mountVideo, (currentMount, prevMount) => {
      if (typeof prevMount === undefined) {
        return;
      }

      if (!currentMount) {
        pausePlayback();
      }
    });

    const mountVideoRef = useCurrentRef(mountVideo);

    function startPlayback() {
      if (
        internalVideoRef.current &&
        typeof internalVideoRef.current.play === 'function'
      ) {
        internalVideoRef.current.play();
      }
    }

    function pausePlayback() {
      if (
        internalVideoRef.current &&
        typeof internalVideoRef.current.play === 'function'
      ) {
        internalVideoRef.current.pause();
      }
    }

    useOnChange(pause, (pauseNow, prevPauseNow) => {
      if (typeof prevPauseNow !== 'boolean') {
        return;
      }

      if (prevPauseNow && !pauseNow) {
        startPlayback();
      } else if (!prevPauseNow && pauseNow) {
        pausePlayback();
      }
    });

    useOnChange(muted, (isMuted, wasMuted) => {
      if (wasMuted === undefined) {
        return;
      }

      if (!internalVideoRef.current) {
        return;
      }

      if (isMuted) {
        internalVideoRef.current.volume = 0;
      } else {
        internalVideoRef.current.volume = 1;
      }
    });

    return (
      <div className={`${className} mui-video`}>
        <Image {...imgProps} src={poster} className="mui-video_img" />
        {shouldMount && (
          <video
            {...props}
            muted={muted}
            ref={internalVideoRef}
            src={src}
            className={`video_video ${
              useActiveClass ? 'mui-video_video-active' : ''
            } ${videoState.isShowingVideo ? 'mui-video_video-showing' : ''} ${
              videoState.started ? 'mui-video_video-started' : ''
            } ${videoState.playing ? 'mui-video_video-playing' : ''} ${
              videoState.paused ? 'mui-video_video-paused' : ''
            } ${videoState.ended ? 'mui-video_video-ended' : ''}
            `}
            onPlay={e => {
              setVideoState(current => {
                return {
                  ...current,
                  // When the video initially mounts, play will be called unless it is
                  // paused. At this time, the video may not be ready to be play, so buffering
                  // begins. For this reason, we only show the video if it's been loaded once
                  // before.
                  // See `onCanPlay` for more...
                  isShowingVideo: loadedOnce.current,
                  started: true,
                  paused: false,
                  playing: true,
                };
              });

              if (props && typeof props.onPlay === 'function') {
                props.onPlay(e);
              }
            }}
            onPause={e => {
              setVideoState(currentState => {
                return {
                  ...currentState,
                  playing: false,
                  paused: true,
                };
              });

              if (props && typeof props.onPause === 'function') {
                props.onPause(e);
              }
            }}
            onEnded={e => {
              setVideoState({
                isShowingVideo: false,
                started: false,
                playing: false,
                paused: true,
                ended: true,
              });

              if (props && typeof props.onEnded === 'function') {
                props.onEnded(e);
              }
            }}
            onCanPlay={e => {
              if (
                playOnMountRef.current &&
                mountVideoRef.current &&
                !loadedOnce.current
              ) {
                startPlayback();

                // This ensures that we actually the video when it's ready to be
                // played, once we play it. This covers situations when network
                // conditions are slow.
                setVideoState(current => {
                  return {
                    ...current,
                    isShowingVideo: true,
                  };
                });
              }

              loadedOnce.current = true;

              if (props && typeof props.onCanPlay === 'function') {
                props.onCanPlay(e);
              }
            }}
          />
        )}
      </div>
    );
  }
);

export default Video;
