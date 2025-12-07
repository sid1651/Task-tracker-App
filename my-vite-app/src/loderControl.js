let setLoaderState = null;

export function registerLoader(fn) {
  setLoaderState = fn;
}

export function loaderOn() {
  if (setLoaderState) setLoaderState(true);
}

export function loaderOff() {
  if (setLoaderState) setLoaderState(false);
}
