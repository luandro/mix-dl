#!/usr/bin/env node

const parseArgs = require('minimist')(process.argv.slice(2));
const scrapeIt = require("scrape-it");
const {
  spawn
} = require('child_process');
const flatten = require('flatten-array');
const fs = require('fs');
const path = require('path');

// Debug
const debugList = 'PLmZ-tcwzKMWbRRP8RbqtG4jA51ULwvBkj';
// Get Mix url from scrapping Youtube
console.log('Loading...')

const findAndDownloadMix = (artists, numberOfSongs, folderName, verbose, minimumViews, debugMode) => {
  console.log('Downloading ', numberOfSongs);
  scrapeForMixes(artists, debugMode).then(mixArray => {
    // Download with yotube-dl
    const songFolder = `${process.env.PWD}/${folderName}`;
    console.log('Downloading to ', songFolder);
    if (!fs.existsSync(songFolder)) {
      fs.mkdirSync(songFolder);
    }

    const youtubedlOptions = [];

    verbose && youtubedlOptions.push('-v') && console.log('Verbose on: ', verbose);
    if (debugMode) {
      // youtubedlOptions.push('--flat-playlist');
      console.log(parseArgs, 'Debug mode on: ', debugMode);
    } else {
      youtubedlOptions.push('--min-views', 1000);
    }
    const downloadMix = spawn('youtube-dl', flatten([
      youtubedlOptions,
      '--playlist-items',
      ` 0 - ${parseInt(numberOfSongs) - 1}`,
      // '--write-pages',
      '--output',
      `${songFolder}/%(title)s.%(ext)s`,
      // '--print-json',
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--no-overwrites',
      '--continue',
      '--ignore-errors',
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

async function scrapeForMixes(artists, debugMode) {
  if (artists.length > 0) {
    let list = [];
    for (let artist of artists) {
      if (artist !== undefined) {
        const formatedArtist = artist.split(' ').concat('+mix&sp=EgIQA1AU').join('+');
        const info = await scrapeEachArtist(formatedArtist)
        list.push(info);
      }
    }
    debugMode && console.log(list);
    return list;
  } else if (debugMode){
    return [`https://www.youtube.com/watch?v=bjOLXn3mz-Y&list=${debugList}`];
  } else {
    return ['https://www.youtube.com/watch?v=qTHVZKn1398']
  }
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

const { n, f, v, m, d, _ } = parseArgs;
// n INT - number of songs to download defaults to 25
// f STRING - folder name to download to mix-downloads
// v - verbose mode on defaults to false
// m INT - minimum views defaults to 1000
// d - debug mode on defaults to false
findAndDownloadMix(_, n || 25, f || 'mix-downloads', v || false, m || 1000, d || false);
