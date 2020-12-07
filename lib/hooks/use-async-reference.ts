import * as React from 'react';

export function useAsyncReference<T>(
  a: any,
  isProp: false,
): [React.MutableRefObject<T>, (newState: any) => void];

export function useAsyncReference<T>(
  a: any,
  isProps: true,
): React.MutableRefObject<T>;

// https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
export function useAsyncReference<T>(value, isProp = false) {
  const ref = React.useRef<T>(value);
  const [, forceRender] = React.useState(false);

  function updateState(newState) {
    if (!Object.is(ref.current, newState)) {
      ref.current = newState;
      forceRender((s) => !s);
    }
  }

  if (isProp) {
    ref.current = value;
    return ref;
  }

  return [ref, updateState];
}
