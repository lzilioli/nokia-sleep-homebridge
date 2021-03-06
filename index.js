// https://support.plex.tv/hc/en-us/articles/115002267687-Webhooks

var express = require('express');
var request = require('request');
var multer = require('multer');
var bodyParser = require('body-parser');
var debug = require('debug')('nokia-sleep-homebridge');
const ngrok = require('ngrok');

var app = express();


if(!process.env.HB_WEBHOOK_URL) {
  throw new Error(`missing env variable HB_WEBHOOK_URL`);
}

if(!process.env.ACCESSORY) {
  throw new Error(`missing env variable ACCESSORY`);
}

const NGROK_PORT = parseInt(process.env.NGROK_PORT, 10) || 12000;
if(isNaN(NGROK_PORT)){
  throw new Error(`NGROK_PORT should be a number`)
}

const NGROK_AUTH = process.env.NGROK_AUTH;
if(!NGROK_AUTH){
  throw new Error(`missing env variable NGROK_AUTH`)
}

const NGROK_SUB = process.env.NGROK_SUB;
if(!NGROK_SUB){
  throw new Error(`missing env variable NGROK_SUB`)
}

async function getGoing(){
  const url = await ngrok.connect({
    authtoken: NGROK_AUTH,
    subdomain: NGROK_SUB,
    addr: NGROK_PORT
  });
  debug(`point your ifttt applet to ${url}`);
  app.get('/', (req, res, next)=>{
    var options = {
      method: 'GET',
      json: false,
      url: process.env.HB_WEBHOOK_URL,
    };
    let accessory = req.query.accessory || process.env.ACCESSORY;
    console.log(req.query.accessory, accessory)
    switch(req.query.state){
      case 'in':
      case 'ARRIVING':
      debug(`opening sensor: ${accessory}`);
      options.qs = {
        state: false,
        accessoryId: accessory
      };
      break;
      case 'out':
      case 'LEAVING':
      debug(`closing sensor: ${accessory}`);
      options.qs = {
        state: true,
        accessoryId: accessory
      };
      break;
    }
    request(options);
    res.sendStatus(200);
  });
  app.listen(NGROK_PORT);
}

getGoing()
.catch(e=>{
  console.error(e);
});
