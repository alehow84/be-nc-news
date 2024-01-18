const db = require('./db/connection');

//Q7 - function to use to check if article exists to then return in Promise.all in postCommentToArticle function in the controller
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