const express = require("express");
const http = require("http");
var cors = require("cors");
const { Downloader } = require("./src/Downloader");

const app = express();
app.use(cors());

const server = http.createServer(app);
const PORT = 8814;

var dl = new Downloader(__dirname);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Works!" });
});

app.get("/watch", async (req, res) => {
  //Get videoId param
  const { v } = req.query;
  //Check if the videoId is sent by the client
  if (v === undefined) {
    return res.status(404).json({ message: "Undefined v param." });
  }

  console.log("ID:", v);

  //Start downloading the MP3
  dl.getMP3(v)
    .then(({ finalPath, newFileName }) => {
      console.log("Returning:", finalPath, newFileName);

      //If is downloaded successfully...
      res.setHeader("Content-Type", "audio/mp3");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${newFileName}`
      );

      //Return file
      return res.sendFile(finalPath);
    })
    .catch((err) => {
      //If we catch a error
      return res.status(500).json({ error: err });
    });
});

server.listen(PORT, () => {
  console.log("Listening on localhost:" + PORT);
});
