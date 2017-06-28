const express = require('express');

const wp = require('./wikipedia_parse');


const app = express();
app.set('json spaces', 2);


app.get('/links', (req, res) => {
  const page = req.query.page;
});

app.get('/pagename', (req, res) => {
  const page = req.query.page;
});

app.get('/random', (req, res) => {});

app.get('/suggest', (req, res) => {
  const text = req.query.text;
});

app.get('/storejson', (req, res) => {

});
app.post('/storejson', (req, res) => {

});


app.listen(3000, '0.0.0.0');
