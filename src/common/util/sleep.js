async function sleep(sleepTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("sleepEnd");
    }, sleepTime);
  });
}

export default sleep;
