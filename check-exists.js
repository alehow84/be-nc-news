const db = require('./db/connection');

//Possible refactor - use checkArticleExists below to check if article exists to then return a promise.All in postCommentToArticle function in the controller
exports.checkArticleExists = (article) => {
    return db
    .query(`SELECT * FROM articles
    WHERE article_id = $1`, [article])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article not found'})
        }
    })
}
exports.checkTopicExists = (topicQuery) => {
    return db.query(`
    SELECT * FROM topics
    WHERE slug = $1`, [topicQuery])
    .then(({rows})=> {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "topic not found"})
        }
    })
}