"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const fs = require('mz/fs');
var fs_1 = __importDefault(require("fs"));
var http_1 = __importDefault(require("http"));
var stream_1 = require("stream");
var chalk_1 = __importDefault(require("chalk"));
var frames = fs_1.default
    .readdirSync('./frames')
    .map(function (file) { return fs_1.default.readFileSync("./frames/" + file); })
    .map(function (f) { return f.toString(); });
var colors = [chalk_1.default.red, chalk_1.default.yellow, chalk_1.default.green, chalk_1.default.blue, chalk_1.default.magenta, chalk_1.default.cyan];
var numColors = colors.length;
var generateColor = function (idx) {
    var newIndex = ~~(Math.random() * colors.length);
    return newIndex === idx ? generateColor(idx) : newIndex;
};
var streamer = function (stream) {
    var index = 0;
    var newColor = 0;
    return setInterval(function () {
        if (index >= frames.length)
            index = 0;
        newColor = generateColor(newColor);
        var nextFrame = colors[newColor](frames[index]);
        stream.push(nextFrame);
        index += 1;
    }, 70);
};
var server = http_1.default.createServer(function (req, res) {
    var stream = new stream_1.Readable();
    stream._read = function () { };
    stream.pipe(res);
    var interval = streamer(stream);
    req.on('close', function () {
        stream.destroy();
        clearInterval(interval);
    });
});
var port = process.env.PARROT_PORT || 3000;
server.listen(port, function (err) {
    if (err)
        throw err;
    console.log("Listening on locahost:" + port);
});
