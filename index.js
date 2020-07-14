const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.render("index.ejs", { id: null, done: false });
});

app.get("/audio", (req, res) => {
  res.sendFile("audio.mp3");
});

app.post("/", (req, res) => {
  convert(req.body.url, (d) => {
    setTimeout(() => {
      fs.unlinkSync(`${d}.mp3`);
    }, 30000);
    res.render("index.ejs", { id: d, done: true });
  });
});

app.get("/download/:id", (req, res) => {
  let id = req.params.id;
  res.download(`${id}.mp3`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const convert = (url, callback) => {
  ytdl.getBasicInfo(url).then((data) => {
    let d = data.player_response.videoDetails.videoId;
    ytdl(url).pipe(
      fs.createWriteStream(`${d}.flv`).on("finish", () => {
        runFfmpeg(d, () => {
          callback(d);
        });
      })
    );
  });
};

const runFfmpeg = (d, callback) => {
  ffmpeg(`${d}.flv`)
    .format("mp3")
    .output(fs.createWriteStream(`${d}.mp3`))
    .on("end", () => {
      fs.unlinkSync(`${d}.flv`);
      callback();
    })
    .run();
};

app.get("/test", (req, res) => {
  ytdl
    .getBasicInfo("https://www.youtube.com/watch?v=2ViZqQkddCc")
    .then((data) => res.send(data.player_response.videoDetails.videoId));
});
