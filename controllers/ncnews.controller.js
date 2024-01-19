const { checkArticleExists } = require('../check-exists');
const {fetchTopics, fetchEndpoints, fetchArticle, fetchAllArticles, fetchArticleComments, insertArticleComment, amendVotes} = require('../models/ncnews.model');

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
    .catch((err) =>{
        console.log(err, "<<err")
        next(err)
    })
}

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleComments(article_id)
    .then((articleComments) => {
        res.status(200).send(articleComments)
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postCommentToArticle = (req, res, next) => {
    
    const newComment = req.body
    const {article_id} = req.params

    //Q7 refactoring to do - articleExistenceQuery below is the start of using Promise.all for advanced error handling
    // const articleExistenceQuery = checkArticleExists(article_id)  



    insertArticleComment(newComment, article_id)
    .then(({rows})=>{
        const postedComment = rows[0]
        res.status(201).send({postedComment})
    })
    .catch((err)=>{
        // console.log(err, '<<err in catch')
        next(err)
    })
}

exports.updateVotes = (req, res, next) => {
    //invoke function from model
    //return response to client
    const {articles_id} = req.params
    const newVotes = req.body
    amendVotes(articles_id, newVotes)
    .then(({rows})=>{
        const article = rows[0]
        console.log(article, '<<article in controller')
        console.log(typeof article.created_at, "line 85")
        res.status(200).send({article})
    })
}
