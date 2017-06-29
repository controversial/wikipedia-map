const express = require('express');

const wp = require('./wikipedia_parse');


const app = express();
app.set('json spaces', 2);


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
    .then(name => res.send(name));
});

app.get('/random', (req, res) => {
  wp.getRandomArticle()
    .then(page => res.send(page));
});

app.get('/suggest', (req, res) => {
  const text = req.query.text;
});

app.get('/storejson', (req, res) => {

});
app.post('/storejson', (req, res) => {

});


app.listen(3000, '0.0.0.0');
