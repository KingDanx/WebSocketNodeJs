let utf8encoder = new TextEncoder();
let utf8decoder = new TextDecoder();

onmessage = (e) => {
  clientInfoArray = utf8decoder.decode(e.data);
  clientInfoArray = JSON.parse(clientInfoArray);
  //   console.log(clientInfoArray);
  let min = 0;
  //   clientInfoArray = e.data;
  if (clientInfoArray.every((el) => el.value == true)) {
    let times = [];
    clientInfoArray.map((el) => times.push(el.time));
    times = times.map((el) => parseInt(el.replace(":", "")));
    min = times.indexOf(Math.min(...times));
    min = JSON.stringify(clientInfoArray[min].time);
    min = new Uint8Array(utf8encoder.encode(min)).buffer;
    postMessage(min, [min]);
  }
};
