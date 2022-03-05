function throttle(callback, delay) {
  let previousCall = new Date().getTime();
  return function (...args) {
    const time = new Date().getTime();

    if (time - previousCall >= delay) {
      previousCall = time;
      callback(args);
    }
  };
}

export default throttle;
