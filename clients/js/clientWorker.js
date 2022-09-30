onmessage = (e) => {
  let min = 0;
  clientInfoArray = e.data;
  if (clientInfoArray.every((el) => el.value == true)) {
    let times = [];
    clientInfoArray.map((el) => times.push(el.time));
    times = times.map((el) => parseInt(el.replace(":", "")));
    min = times.indexOf(Math.min(...times));
    postMessage(clientInfoArray[min].time);
  }
};
