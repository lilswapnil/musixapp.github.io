import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5173/callback'; // Update to match the registered URI
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(bodyParser.json());

let db;

async function connectToDB() {
  const uri = 'mongodb://127.0.0.1:27017';

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();

  db = client.db('musix-db');
}

app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI));
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  try {
    const response = await axios.post(authOptions.url, authOptions.form, { headers: authOptions.headers });
    const accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get access token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function start() {
  await connectToDB();
  app.listen(8000, function() {
    console.log('Server is listening on port 8000');
  });
}

start();