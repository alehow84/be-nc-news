const {fetchTopics, fetchEndpoints, fetchArticle, fetchAllArticles} = require('../models/ncnews.model');

exports.getTopics = (req, res, next) => {

    fetchTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getEndpoints = (req, res, next) =>{

    const endpoints = fetchEndpoints()
    res.status(200).send(endpoints)
}

exports.getArticle = (req, res, next) => {
   
    const {articles_id} = req.params
    fetchArticle(articles_id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    
    fetchAllArticles()
    .then((allArticles) => {
        res.status(200).send(allArticles)
    })
}
