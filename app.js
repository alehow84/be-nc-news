const express = require('express');
const app = express();
const {getTopics} = require('./controllers/ncnews.controller');

app.use(express.json());

app.get('/api/topics', getTopics)

app.use((err, req, res, next) =>{
    res.status(404).send(err)
})

module.exports = {app}