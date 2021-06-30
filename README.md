# React Media UI

Two React components: one for images, one for video.

## Installation

Install using [npm](https://www.npmjs.com):

```
npm install react-media-ui
```

or [yarn](https://yarnpkg.com/):

```
yarn add react-media-ui
```

## API Reference

### `<Image />`

Renders an image. If the image takes a moment to load, then it will fade in once it has loaded.

The `Image` component accepts all of the same props as `<img/>`.

It also accepts a few additional props, all of which are optional:

| Prop             | Type   | Default value | Description                                                                                                                                            |
| ---------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `threshold`      | number | `0.35`        | If the image loads faster than this value, then it will not fade in.                                                                                   |
| `duration`       | number | `0.25`        | The duration of the fade animation.                                                                                                                    |
| `timingFunction` | string | `'ease-out'`  | The timing function for the fade animation. [View all valid values here](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function). |

```jsx
import { Image } from 'react-media-ui';

export default function App() {
  return <Image src="dog.jpg" alt="A dog jumping." />;
}
```

### `<Video />`

Renders a video with an optional poster image, which displays until the video has loaded.

The `<Video>` component accepts all of the same props as `<video/>`. It also accepts a few more, all of which are optional:

| Prop         | Type         | Default value | Description                                                                                             |
| ------------ | ------------ | ------------- | ------------------------------------------------------------------------------------------------------- |
| `poster`     | string       | `undefined`   | A URL of an image to display while the video loads.                                                     |
| `mountVideo` | boolean      | `true`        | Pass `false` and the video will not be mounted. This can be useful for performance in certain contexts. |
| `imgProps`   | `ImageProps` | `undefined`   | Props that are passed to the underlying `<Image/>` element that is used for the poster.                 |

```jsx
import { Video } from 'react-media-ui';

export default function App() {
  return (
    <Video
      src="dog.mp4"
      poster="dog.jpg"
      imgProps={{
        alt: 'A dog jumping.',
      }}
    />
  );
}
```
