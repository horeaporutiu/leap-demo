'use strict';

import { Leap } from '@leap-ai/sdk'
import express from 'express'
import request from 'request'
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import bodyParser from 'body-parser';

import * as dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const leap = new Leap(process.env.LEAP_API_KEY)

const app = express();

app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.urlencoded({extended: false}));

const port = 8080;
const host = '0.0.0.0';

async function generateImage(prompt) {
  leap.usePublicModel("sd-1.5");
  const result = await leap.generate.generateImage({
    prompt: prompt,
  });
  if (result) {
    return result.data.images[0].uri;
  }
}

app.get('/', async (req, res) => {
  
  res.sendFile(path.join(__dirname+'/public/index.html'));
  
})

app.post('/generate', async (req, res) => {

  const prompt = req.body.prompt;
  
  let uri = await generateImage(prompt);

  var requestSettings = {
    url: uri,
    method: 'GET',
    encoding: null
  };

  await request(requestSettings, function(error, response, body) {
      res.set('Content-Type', 'image/png');
      res.send(body);
  });
  console.log('after request sent')
  
  // res.send('Hello World from IBM Cloud Essentials!');
})

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);
