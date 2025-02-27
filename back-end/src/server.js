import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import axios from 'axios';
import bodyParser from 'body-parser';

//Backend Testing Code
const articleInfo = [
  { name: 'learn-node', upvotes: 0, comments: [] },
  { name: 'learn-react', upvotes: 0, comments: [] },
  { name: 'mongodb', upvotes: 0, comments: [] },
]

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_ID = '777c571d7da6439aaf522a3c54cbef52';
const CLIENT_SECRET = '854ab52143794b74a136f7b1396662fc';
const REDIRECT_URI = 'http://localhost:5001/callback';

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

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  const article = await db.collection('articles').findOne({ name });
  res.json(article);
});

app.post('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  const updatedArticle = await db.collection('articles').findOneAndUpdate({ name }, {
    $inc: { upvotes: 1 }
  }, {
    returnDocument: "after",
  });

  res.json(updatedArticle);
});

app.get('/login', (req, res) => {
  const scopes = 'user-read-recently-played';
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

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  const updatedArticle = await db.collection('articles').findOneAndUpdate(
    { name },
    { $push: { comments: { postedBy, text } } },
    { returnDocument: "after" }
  );

  res.json(updatedArticle);
});

async function start() {
  await connectToDB();
  app.listen(8000, function() {
    console.log('Server is listening on port 8000');
  });
}

start();