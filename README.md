# myclip

## Simple internet clipboard

This is an app to provide an internet clipboard to copy text content between computers.

You can use it with a browser or from the command line using cURL.

It is hosted on [https://myclip.glitch.me](https://myclip.glitch.me) so you can take a look at the source code and verify the code that is running for the peace of mind that no contents are being captured or sent anywhere.

Also you can encrypt the content with a password prior to sending to the server, so content is never legible without the password.

Since glitch is an ephemeral environment, it powers off when not in use, you can not hope for the contents to be alive for long time.

This is meant to be used as publish, send link over to a colleague and paste on the other end, not for durable storage.

### Usage via cURL

```
curl -X POST https://myclip.glitch.me/{key} --data-binary @filename
```

{key} is optional, if not passed, it will be automatically generated 

Then retrieve it with:

```
curl https://myclip.glitch.me/{key}
```
## Hostname
The hostname is automatically discover via request.get('host') and protocol is asumed `https`
If you want to force `http` or assign a different base host path you can declare environment variable `URL`