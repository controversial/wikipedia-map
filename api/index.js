const express = require('express');

const wp = require('./wikipedia_parse');


const app = express();
app.set('json spaces', 2); // Nice formatting for JSON outputs


// Cross-origin resource sharing allows client-side Javascript from other sites to use this API


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// API endpoints


app.get('/links', (req, res) => {
  const page = req.query.page;
  wp.getPageHtml(page)
    .then(wp.getFirstParagraph)
    .then(wp.getWikiLinks)
    .then(links => res.send(links));
});

app.get('/pagename', (req, res) => {
  const page = req.query.page;
  wp.getPageName(page)
    .then(name => res.send(`"${name}"`));
});

app.get('/random', (req, res) => {
  wp.getRandomArticle()
    .then(page => res.send(page));
});

app.get('/suggest', (req, res) => {
  const text = req.query.text;
  wp.getSuggestions(text)
    .then(suggestions => res.send(suggestions));
});


// TODO
app.get('/storejson', (req, res) => {});
app.post('/storejson', (req, res) => {});


// Run


app.listen(3000, '0.0.0.0');
