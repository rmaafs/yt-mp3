require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Promise = require("promise");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

class Downloader {
  constructor(rootPathFolder) {
    this.rootPathFolder = rootPathFolder;
    //Create directory
    this.mp3directory = this.rootPathFolder + "/mp3";
    fs.existsSync(this.mp3directory) || fs.mkdirSync(this.mp3directory);

    console.log("Starting FFMPEG:", process.env.FFMPEG_PATH);
    console.log("MP3 directory:", this.mp3directory);

    this.YD = new YoutubeMp3Downloader({
      ffmpegPath: process.env.FFMPEG_PATH || "C:/ffmpeg/bin/ffmpeg.exe", // FFmpeg binary location
      outputPath: this.mp3directory, // Output file location (default: the home directory)
      youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
      queueParallelism: 2, // Download parallelism (default: 1)
      progressTimeout: 3000, // Interval in ms for the progress reports (default: 1000)
      outputOptions: ["-af", "silenceremove=1:0:-50dB"], // Additional output options passend to ffmpeg
    });
  }

  getMP3(videoId) {
    const self = this;
    return new Promise((resolve, reject) => {
      const trackName = videoId + ".mp3";
      self.YD.download(videoId, trackName);

      self.YD.on("finished", function (error, data) {
        console.log(error, data);
        if (error) {
          return reject(error);
        }

        //Rename file
        const newFileName = data.videoTitle + ".mp3";
        const newFilePath = self.mp3directory + "/" + newFileName;
        fs.rename(data.file, newFilePath, (err) => {
          if (err) {
            return reject(err);
          } else {
            const finalPath = path.join(self.mp3directory, newFileName);
            return resolve({ finalPath: finalPath, newFileName: newFileName });
          }
        });
      });

      self.YD.on("error", function (error, data) {
        console.log(error, data);
        return reject(error);
      });
    });
  }
}

module.exports = { Downloader };
