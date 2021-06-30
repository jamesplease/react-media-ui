/* eslint-disable jsx-a11y/alt-text */
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  threshold?: number;
  duration?: number;
  timingFunction?: string;
}

const Image = forwardRef(
  (
    {
      // The image source URL. The same URL you would pass to <img src="" />
      src,
      // Additional class name(s) to apply to the wrapping div element
      className,
      // How long an image must take to load before being faded in, in seconds
      threshold = 0.35,
      // How long the fade in lasts, in seconds
      duration = 0.25,
      // The timing function to use. For available options, see:
      // https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function
      timingFunction = 'ease-out',
      // All remaining props go on the underlying img element. This allows you to specify props
      // like `alt`.
      ...props
    }: ImageProps,
    ref
  ) => {
    // This tracks whether or not the image has loaded, as well as whether or not the fade should even occur.
    const [fadeState, setFadeState] = useState({
      loaded: false,
      shouldFade: false,
    });

    const imgRef = useRef(null);
    useImperativeHandle(ref, () => imgRef.current);

    // Create some refs to use later, and keep them updated.
    const fadeStateRef = useRef(fadeState);
    const thresholdRef = useRef(threshold);
    useEffect(() => {
      fadeStateRef.current = fadeState;
      thresholdRef.current = threshold;
    }, [fadeState, threshold]);

    const srcRef = useRef(src);

    useEffect(() => {
      srcRef.current = src;

      // Whenever the source changes, we "reset" our state.
      setFadeState({
        loaded: false,
        shouldFade: false,
      });

      if (typeof src !== 'string') {
        return;
      }

      // This keeps track of whether or not we should fade or just instantly show
      // the image. After a certain amount of time has passed, if the image hasn't loaded,
      // we append this extra class name.
      const timeout = setTimeout(() => {
        if (!fadeStateRef.current.loaded) {
          setFadeState(currentState => {
            return {
              ...currentState,
              shouldFade: true,
            };
          });
        }
      }, thresholdRef.current * 1000);

      let img = new window.Image();
      img.src = src;
      img.onload = () => {
        if (srcRef.current === src) {
          setFadeState(currentState => {
            return {
              ...currentState,
              loaded: true,
            };
          });
        }
      };

      return () => {
        clearTimeout(timeout);
      };
    }, [src]);

    return (
      <div
        className={`mui-image ${fadeState.shouldFade &&
          'mui-image-fade'} ${fadeState.loaded &&
          'mui-image-loaded'} ${className}`}
        style={{
          // @ts-ignore
          '--animation-duration': `${duration}s`,
          // @ts-ignore
          '--animation-timing-function': timingFunction,
        }}
      >
        {fadeState.loaded && <img ref={imgRef} src={src} {...props} />}
      </div>
    );
  }
);

export default Image;
