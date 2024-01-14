# Google Photos public album api

This is a tiny CloudFlare worker to fetch the list of images contained inside a publicly shared album.

## Usage

Deploy this worker to your own CloudFlare account and set the environment according to the configuration below.
You can then use it as you would any API and display images from Google Photos on any website.

## Output

```json
{
	"images": [
		{
			"url": "https://lh3.googleusercontent.com/pw/base-url",
			"width": "1234",
			"height": "1234",
			"createdTimestamp": "1687475262000",
			"updatedTimestamp": "1687553539387"
		}
	],
	"count": 1
}
```

## Config

Configuration is done through the worker environment.

```sh
ALBUM_URL=https://photos.app.goo.gl/your-id
ALLOW_ORIGIN=example.com
```

## Deploy

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/marier-nico/google-photos-public-album-api)
