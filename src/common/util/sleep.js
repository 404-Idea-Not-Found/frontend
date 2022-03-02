async function sleep(sleepTime) {
  return new Promise((res) => {
    setTimeout(() => {
      res("time!");
    }, sleepTime);
  });
}

export default sleep;
