# mix-dl

Automatically downloads and conversts to mp3 the youtube mix playlist for any number of artists. Uses [youtube-dl](https://rg3.github.io/youtube-dl/), so make sure you have it installed in your machine.

## How it works

It adds the keyword "mix" to the artist name, searches on Youtube filtering only playlists and downloads the first result playlist with `youtube-dl`, extracting audio and converting it to `mp3` format.

Automatically adds `--no-overwrites`, `--continue` and `--ignore-errors` options. Also uses `--min-views` options to only download videos with at least 1000 views. 

## Usage

Make sure you have NodeJS at least v8.

```
npm i -g mix-dl
```

or

```
yarn global add mix-dl
```

That's it. Now just use it like this:

```
mix-dl [ARTISTS] [OPTIONS]
```

Example:

```mix-dl "Bob Marley" "Charlie Brown Jr" -n 20 ```

Where `-n` is the number of songs per artist, which defaults to `30`.

### Options

- `n` `INT` - number of songs to download defaults to 25
- `f` `STRING` - folder name to download to mix-downloads
- `v` - verbose mode on defaults to false
- `m` `INT` - minimum views defaults to 1000
- `d` - debug mode on defaults to false

## Todo

- Use `--match-title` option to only download songs containing artist name
- Download each artist to it's own folder
- Add better interface
- Better find playlists