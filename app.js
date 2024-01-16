const express = require('express');
const app = express();
const {getTopics, getEndpoints} = require('./controllers/ncnews.controller');

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.use((err, req, res, next) =>{
    res.status(404).send(err)
})

module.exports = {app}