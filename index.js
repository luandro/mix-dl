#!/usr/bin/env node

const parseArgs = require('minimist')(process.argv.slice(2));
const scrapeIt = require("scrape-it");
const {
  spawn
} = require('child_process');
const flatten = require('flatten-array');
const fs = require('fs');
const path = require('path');

// defaults to https://www.youtube.com/watch?v=qTHVZKn1398

// Get Mix url from scrapping Youtube
console.log('Loading...')

const findAndDownloadMix = n => {
  console.log('Downloading ', n)
  scrapeForMixes().then(mixArray => {
    // Download with yotube-dl
    const songFolder = `${__dirname}/Download`;
    console.log('Downloading to ', songFolder);
    if (!fs.existsSync(songFolder)) {
      fs.mkdirSync(songFolder);
    }
    const downloadMix = spawn('youtube-dl', flatten([
      '--playlist-items',
      n,
      '-v',
      '--write-pages',
      '--output',
      `${songFolder}/%(title)s.%(ext)s`,
      // '--print-json',
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--no-overwrites',
      '--continue',
      '--ignore-errors',
      '--min-views',
      '1000',
      mixArray,
    ]));
    downloadMix.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    downloadMix.stderr.on('data', (data) => {
      console.error(`ERROR: ${data}`);
    });

    downloadMix.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      console.log('FINISHED!');
    });
  });
}

async function scrapeForMixes() {
  let list = [];
  for (let artist of parseArgs._) {
    if (artist !== undefined) {
      const formatedArtist = artist.split(' ').concat('+mix&sp=EgIQA1AU').join('+');
      const info = await scrapeEachArtist(formatedArtist)
      list.push(info);
    }
  }
  console.log(list)
  return list;
}

async function scrapeEachArtist(artist) {
  const youtubeUrl = `https://www.youtube.com/results?q=${artist}`;
  const result = await scrapeIt(youtubeUrl, {
    data: {
      selector: '.yt-lockup-title a',
      eq: 0,
      attr: "href",
      how: 'html',
    },
  });
  return `https://www.youtube.com${result.data}`;
}

findAndDownloadMix(parseArgs.n || 25);
