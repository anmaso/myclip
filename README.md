# myclip

## Simple internet clipboard

This is an app to provide an internet clipboard to copy text content between computers.

You can use it with a browser or from the command line using cURL.

It is hosted on Google Cloud Run and does not perist data. It will only be available as long as the container you hit is not recycled.

Also you can encrypt the content with a password prior to sending to the server, so content is never legible without the password.

This is meant to be used as publish, send link over to a colleague and paste on the other end, not for durable storage.

### Usage via cURL

```
curl -X POST https://myclip.anmaso.es/{key} --data-binary @filename
```

{key} is optional, if not passed, it will be automatically generated 

Then retrieve it with:

```
curl https://myclip.anmaso.es/{key}
```
## Hostname
The hostname is automatically discover via request.get('host') and protocol is asumed `https`
If you want to force `http` or assign a different base host path you can declare environment variable `URL`