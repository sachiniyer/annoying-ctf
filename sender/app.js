FLAG = "flag{H! @nee5h :). C0NGR@T5}";
DELAY = 2000

const mqtt = require('mqtt');
var fs = require('fs');
var path = process.cwd();

flag_bits = []
for (var i = 0; i < FLAG.length; i++) {
  flag_bits.push(FLAG[i].charCodeAt(0).toString(2).split(""));
}

flat_flag_bits = []
for (let i of flag_bits) {
  for (let j of i) {
    flat_flag_bits.push(j)
  }
  flat_flag_bits.push('2')

}
flag_bits = flat_flag_bits


var buffer = fs.readFileSync(path + "/words.txt");
buffer = buffer.toString().split("\n");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generate_word() {
  return buffer[getRndInteger(0, buffer.length)];
}

const client = mqtt.connect('mqtt://192.168.0.2');

counter = 0;
client.on('connect', async function () {
  while (true) {
    word = generate_word()
    if (counter >= flag_bits.length) {
      counter = 0;
    }
    client.publish(word, flag_bits[counter]);
    counter++;
    await new Promise(r => setTimeout(r, DELAY));
  }
});
