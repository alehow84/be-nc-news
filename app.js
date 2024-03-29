const express = require('express');
const {getTopics, getEndpoints, getArticle, getAllArticles, getArticleComments, postCommentToArticle, updateVotes, deleteComment, getAllUsers} = require('./controllers/ncnews.controller');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:articles_id', getArticle)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.get('/api/users', getAllUsers)

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.patch('/api/articles/:articles_id', updateVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next)=>{ 
    if (err.code === '23503') {
        res.status(404).send({msg: 'not found'})
    }
    if (err.code === '22P02') {
        res.status(400).send({msg: 'bad request'})
    }
    next(err)
})

app.use((err, req, res, next) =>{
    if (err.status === 404) {
        res.status(404).send(err)
    }
    res.status(400).send(err)
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
})

app.all('*', (req, res, next)=> {
    res.status(404).send({msg: 'not found'})
})

module.exports = {app}