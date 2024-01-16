const {fetchTopics, fetchEndpoints, fetchArticle} = require('../models/ncnews.model');

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
        console.log(article, "<<<article in getArticle, controller")
        res.status(200).send(article)
    })
    .catch((err)=>{
        console.log(err, "<<err in getArticle controller line 29")
        next(err)
    })
}
