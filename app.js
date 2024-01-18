const express = require('express');
const app = express();
const {getTopics, getEndpoints, getArticle, getAllArticles, getArticleComments, postCommentToArticle} = require('./controllers/ncnews.controller');

app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:articles_id', getArticle)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.use((err, req, res, next)=>{
    if (err.code === '23503' && err.constraint === 'comments_article_id_fkey') {
        res.status(404).send({msg: 'article not found'})
    }
    if (err.code === '23503' && err.constraint === 'comments_author_fkey') {
        res.status(404).send({msg: 'user not found'})
    }
    next(err)
})

app.use((err, req, res, next) =>{
    
    if (err.status === 404) {
        res.status(404).send(err)
    }
    res.status(400).send({msg: 'bad request'})
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
})


module.exports = {app}