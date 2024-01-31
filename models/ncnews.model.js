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

    return db.query(
        
        `SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url`, [articleId])
    .then(({rows})=>{

        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found'})
        } 
        const article = rows[0]
        return {article}
    })
}

exports.fetchAllArticles = (topicQuery) => {

    let queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    `
    let params = []

    if(topicQuery) {
     
        queryStr += ` WHERE articles.topic = $1`
        params.push(topicQuery)
    }

    queryStr += ` GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`

    return db.query(queryStr, params)
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
           return Promise.reject({status: 404, msg: 'not found'})
        }
        return rows
    })
}

exports.fetchAllUsers = () => {
    return db.query(`
    SELECT * FROM users
    `)
    .then(({rows}) =>{
        return rows
    })
}

exports.insertArticleComment = (commentObj, articleId) => {

    const {username, body} = commentObj
    const queryStr = `INSERT INTO comments
        (
        article_id,
        author,
        body
        )
        VALUES ($1, $2, $3)
        RETURNING *`;
    const params = [
        articleId,
        username,
        body,
      ];
      return db.query(queryStr, params)
      .then(({rows})=>{
        return rows[0]
      })
    
}

exports.amendVotes = (articleId, vote) => {
    const voteCount = vote.inc_votes.inc_votes

    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [voteCount, articleId])
    .then(({rows})=>{
        if(rows.length === 0) {
           return Promise.reject({status: 404, msg: "not found"})
        } else {
            return rows
        }
    
    })
}

exports.removeComment = (comment) => {

    const commentId = comment.comment_id

    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    `, [commentId])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status:404, msg:'not found'})
        }
        return rows
    })
   
}
