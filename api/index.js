const express = require('express');
const request = require('superagent');

const app = express();
app.set('json spaces', 2);

app.get('/links', (req, res) => {
  const page = res.query.page;
});

app.get('/pagename', (req, res) => {
  const page = res.query.page;
});

app.get('/random', (req, res) => {});

app.get('/suggest', (req, res) => {
  const text = res.query.text;
});

app.get('/storejson', (req, res) => {

});
app.post('/storejson', (req, res) => {

});
