# React Media UI

[![npm version](https://img.shields.io/npm/v/react-media-ui.svg?color=brightgreen)](https://www.npmjs.com/package/react-media-ui)

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

This library includes a CSS file that must be imported one time. Typically you'll want to bundle
this with the rest of the CSS in your project.

```js
import 'react-media-ui/style.css';
```

## Table of Contents

- [**API Reference**](#api-reference)
  - [\<Image/\>](#image-)
  - [\<Video/\>](#video-)
- [**Guides**](#guides)
  - [Video Element Performance](#video-element-performance)
- [**Troubleshooting**](#troubleshooting)

## API Reference

### `<Image />`

Renders an image. If the image takes a moment to load, then it will fade in once it has loaded.

The `Image` component accepts all of the same props as `<img/>`.

It also accepts a few additional props that most people won't need to use. All of these additional props are optional:

| Prop             | Type   | Default value | Description                                                                                                                                            |
| ---------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `threshold`      | number | `0.35`        | If the image loads faster than this value, then it will not fade in. Specified in units of seconds.                                                    |
| `duration`       | number | `0.25`        | The duration of the fade animation in seconds.                                                                                                         |
| `timingFunction` | string | `'ease-out'`  | The timing function for the fade animation. [View all valid values here](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function). |

```jsx
// This CSS file must be imported just a single time
import 'react-media-ui/style.css';
import { Image } from 'react-media-ui';

export default function App() {
  return <Image src="dog.jpg" alt="A dog jumping." />;
}
```

### `<Video />`

Renders a video with an optional poster image, which displays until the video has loaded. After the video has ended the
poster image will be fade in again.

The `<Video>` component accepts all of the same props as `<video/>`. It also accepts a few more, all of which are optional:

| Prop         | Type         | Default value | Description                                                                                             |
| ------------ | ------------ | ------------- | ------------------------------------------------------------------------------------------------------- |
| `poster`     | string       | `undefined`   | A URL of an image to display while the video loads.                                                     |
| `mountVideo` | boolean      | `true`        | Pass `false` and the video will not be mounted. This can be useful for performance in certain contexts. |
| `imgProps`   | `ImageProps` | `undefined`   | Props that are passed to the underlying `<Image/>` element that is used for the poster.                 |

```jsx
// This CSS file must be imported just a single time
import 'react-media-ui/style.css';
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

## Guides

### Video Element Performance

Some apps may require swapping out `<Video/>` elements as a user navigates. If they navigate too fast, then the mounting and unmounting can occur rapidly. This
can be a problem because mounting and unmounting video elements too rapidly can cause sluggish performance.

To avoid this problem, use the `mountVideo` prop as follows:

Whenever the user navigates, set `mountVideo` to `false`. This makes it so that just the poster image mounts. Then, if the user doesn't navigate again after, say, 400ms, you
can set `mountVideo` to `true`. This technique ensures that even users who are navigating very quickly will not cause rapid mounting and unmounting of video elements.

## Troubleshooting

### The components aren't displaying as I would expect

Did you remember to import the CSS file?

```js
import 'react-media-ui/style.css';
```

### Animations aren't working

It might be worth doing a quick check that the CSS file was imported.

```js
import 'react-media-ui/style.css';
```

### I'm still having issues

[Open an issue](https://github.com/jamesplease/react-media-ui/issues/new) and I'll try my best to help out!
