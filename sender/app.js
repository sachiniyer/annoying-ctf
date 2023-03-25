FLAG = "flag{H! @nee5h :). C0NGR@T5}";

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://192.168.0.2');

client.on('connect', async function () {
  while (true) {
    client.publish('test', 'Hello mqtt');
    await new Promise(r => setTimeout(r, 200));
    console.log("sending")
  }
});
