require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')
// Basic Configuration
const port = process.env.PORT || 3000;

const link = require('./link')

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body
  if (url.startsWith('http')) {
    const newLink = {
      original_url: req.body.url,
      short_url: link.length + 1
    }
    link.push(newLink)
    console.log(link)
    link.forEach(e => {
      app.get(`/api/shorturl/${e.short_url}`, (req, res) => {
        res.redirect(e.original_url)
      })
    })
    res.json(newLink)
  } else {
    res.json({ error: 'invalid url' })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
