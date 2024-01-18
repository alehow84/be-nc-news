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
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    `)
    .then(({rows})=>{
        return rows
    })
}

exports.fetchArticleComments = (articleId) => {
    
    return db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `, [articleId])
    .then(({rows})=>{
        if (rows.length === 0){
           return Promise.reject({status: 404, msg: 'article not found'})
        }
        
        return rows
    })
}

exports.insertArticleComment = (commentObj) => {
    //first check the article exists, invoke a function check passing it the article_id
    //then if the rows 

    const queryStr = `INSERT INTO comments (
        body,
        article_id,
        author,
        votes,
        created_at)
        VALUES ( $1, $2, $3, $4, $5)
        RETURNING *`;
    const params = [
        commentObj.body,
        commentObj.article_id,
        commentObj.author,
        commentObj.votes,
        commentObj.created_at
      ];
      return db.query(queryStr, params)
    
}
