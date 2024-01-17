const db = require('../db/connection')
const endpointJson = require('../endpoints.json')

exports.fetchTopics = () => {

    return db.query(`
    SELECT * FROM topics;
    `)
    .then(({rows})=>{
        return rows;
    })
}

exports.fetchEndpoints = () => {
    
    return endpointJson
}

exports.fetchArticle = (articleId) => {
    return db.query(`
    
    SELECT * FROM articles
    WHERE article_id = $1;`, [articleId])
    .then(({rows})=>{

        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article not found'})
        } 
        const article = rows[0]
        return {article}
    })
}

exports.fetchAllArticles = () => {
    return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    INNER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    `)
    .then(({rows})=>{
        console.log(rows, '<<rows in fetchAllArticles')
       
        return rows
    })
}
