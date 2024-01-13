# Google Photos public album api

This is a tiny CloudFlare worker to fetch the list of images contained inside a publicly shared album.

## Usage

Deploy this worker to your own CloudFlare account and set the environment according to the configuration below.
You can then use it as you would any API and display images from Google Photos on any website.

## Config

Configuration is done through the worker environment.

```sh
ALBUM_URL=https://photos.app.goo.gl/your-id
```
