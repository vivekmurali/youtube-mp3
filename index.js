const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const port = 3001;
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { id: null, done: false, name: null });
});

app.get("/audio", (req, res) => {
  res.sendFile("audio.mp3");
});

const updateCount = () => {
  fs.readFile("count.txt", (err, data) => {
    if (!err) {
      fs.writeFile("count.txt", Number(data) + 1, (e) => {
        if (err) console.error(err);
      });
    } else console.error(err.message);
  });
};
app.post("/", (req, res) => {
  updateCount();
  convert(req.body.url, (error, d) => {
    if (!error) {
      setTimeout(() => {
        fs.stat(`${d}.mp3`, (err, stat) => {
          if (err) {
            console.error(err.message);
          } else {
            fs.unlinkSync(`${d}.mp3`);
          }
        });
      }, 63000);

      res.render("download.ejs", {
        id: d,
        done: true,
        name: req.body.fileName,
        url: req.body.url,
      });
    } else {
      res.send("file length limit 45 minutes");
    }
  });
});

app.get("/download/:id/:name", (req, res) => {
  let id = req.params.id;
  let name = req.params.name;
  res.download(`${id}.mp3`, `${name}.mp3`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const convert = (url, callback) => {
  ytdl.getBasicInfo(url).then((data) => {
    if (Number(data.player_response.videoDetails.lengthSeconds) < 2700) {
      ytdl.getBasicInfo(url).then((data) => {
        let d = data.player_response.videoDetails.videoId;
        ytdl(url).pipe(
          fs.createWriteStream(`${d}.flv`).on("finish", () => {
            runFfmpeg(d, () => {
              callback(null, d);
            });
          })
        );
      });
    } else {
      console.log(data.player_response.videoDetails.lengthSeconds);
      callback("err", null);
    }
  });
};

const runFfmpeg = (d, callback) => {
  ffmpeg(`${d}.flv`)
    .format("mp3")
    .output(fs.createWriteStream(`${d}.mp3`))
    .on("end", () => {
      try {
        fs.unlinkSync(`${d}.flv`);
      } catch (error) {
        console.error(error.message);
      }
      callback();
    })
    .run();
};

app.get("/test", (req, res) => {
  ytdl
    .getBasicInfo("https://www.youtube.com/watch?v=2ViZqQkddCc")
    .then((data) => res.send(data.player_response.videoDetails.lengthSeconds));
});
