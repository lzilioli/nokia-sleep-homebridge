# nokia-sleep-homebridge

# Deprecated

**2020-07-25:** I am archiving this repo since I no longer use or maintain this functionality, and its dependencies have grown out of date.

For a great replacement, I recommend PushCut's automation server feature. 

PushCut has saved me a ton of time and eliminated the need for me to create little bridge modules like this, since I can do it all with an iOS device + shortcuts now.

https://www.pushcut.io

# Getting Started

In order to run this app:

- Install [node.js](https://nodejs.org/en/).
- Clone the repository.
- Install dependencies using `npm install`.
- Create an ngrok paid account and create a subdomain (referred to as <YOUR NGROK SUBDOMAIN> from here on out)
- Create an ifttt applet for if Nokia sleep detects you get into bed and out of bed, to hit a webhook url `https://<YOUR NGROK SUBDOMAIN>.ngrok.io?state=in` or `https://<YOUR NGROK SUBDOMAIN>.ngrok.io?state=out`
- You should be using [`homebridge`](https://github.com/nfarina/homebridge) and [`homebridge-http-webhooks`](https://github.com/benzman81/homebridge-http-webhooks) `npm install -g homebridge homebridge-http-webhooks`

# Configs

In `~/.homebridge/config.json`:

```json
"platforms": [
    {
      "platform": "HttpWebHooks",
      "webhook_port": "51828",
      "sensors": [
        {
          "id": "nokiaSleep",
          "name": "Nokia Sleep Sensor",
          "type": "contact"
        }
      ]
    }
  ]
```

# Run

Now run the script with the following arguments:

```bash
ACCESSORY=nokiaSleep \
NGROK_PORT=9090 \
HB_WEBHOOK_URL=http://localhost:51828/ \
NGROK_SUB=<YOUR NGROK SUBDOMAIN> \
NGROK_AUTH=<YOUR NGROK AUTH TOKEN> \
DEBUG=nokia-sleep-homebridge*
node index.js
```

From now on, when you get in or out of bed, ifttt will trigger your webhook applet which will forward the request to your app running over ngrok. You can then set up homekit automations for when you get in or out of bed based on the open/closed state of the Nokia Sleep contact sensor.
