const { checkArticleExists, checkTopicExists } = require('../check-exists');
const {fetchTopics, fetchEndpoints, fetchArticle, fetchAllArticles, fetchArticleComments, insertArticleComment, amendVotes, removeComment, fetchAllUsers} = require('../models/ncnews.model');


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
    const {topic} = req.query
    const articlesQuery = fetchAllArticles(topic)
    const queries = [articlesQuery]

   if (topic) {
    const topicExistsQuery =  checkTopicExists(topic)
    queries.push(topicExistsQuery)
   }

   Promise.all((queries))
    .then((response) => {
        const articles = response[0]
        res.status(200).send({articles})
    })
    .catch((err) =>{
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

exports.getAllUsers = (req, res, next) => {

    fetchAllUsers()
    .then((response)=>{
        const users = response
        res.status(200).send({users})
    })
}

exports.postCommentToArticle = (req, res, next) => {
    
    const newComment = req.body
    const {article_id} = req.params

    //Q7 refactoring to do - articleExistenceQuery below is the start of using Promise.all for advanced error handling
    // const articleExistenceQuery = checkArticleExists(article_id)  

    insertArticleComment(newComment, article_id)
    .then((response)=>{
        const postedComment = response
        res.status(201).send({postedComment})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.updateVotes = (req, res, next) => {
    const {articles_id} = req.params
    const newVotes = req.body
    amendVotes(articles_id, newVotes)
    .then((rows)=>{
        const article = rows[0]
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const comment_id = req.params
    removeComment(comment_id)
    .then((response)=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}
