// const fs = require('mz/fs');
import fs from 'fs';
import http from 'http';
import { Readable } from 'stream';
import chalk from 'chalk';

const frames: string[] = fs
  .readdirSync('./frames')
  .map(file => fs.readFileSync(`./frames/${file}`))
  .map(f => f.toString());

const colors = [chalk.red, chalk.yellow, chalk.green, chalk.blue, chalk.magenta, chalk.cyan];

const generateColor = (idx: number): number => {
  const newIndex: number = ~~(Math.random() * colors.length);
  return newIndex === idx ? generateColor(idx) : newIndex;
};

const streamer = (stream: Readable): NodeJS.Timer => {
  let index: number = 0;
  let newColor: number = 0;
  return setInterval(() => {
    if (index >= frames.length) index = 0;
    newColor = generateColor(newColor);
    const nextFrame = colors[newColor](frames[index]);
    stream.push(nextFrame);
    index += 1;
  }, 70);
}

const server: http.Server = http.createServer((req, res) => {
  const stream: Readable = new Readable();
  stream._read = () => {};
  stream.pipe(res);
  const interval: NodeJS.Timer = streamer(stream);
  req.on('close', () => {
    stream.destroy();
    clearInterval(interval);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`Listening on locahost:${port}`);
});
