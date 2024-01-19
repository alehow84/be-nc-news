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
    
}

exports.amendVotes = (articleId, vote) => {
    console.log(articleId, '<< articleId in model')
    // const voteCount = vote.
    //define a variable to extract the number in the vote obj
    //select the articles.vote column where the article_id = articleId from the articles table
    //insert into articles table a vote count
    const voteCount = vote.inc_votes.inc_votes

    return db.query(`
    UPDATE articles
    SET votes = $1
    WHERE article_id = $2
    RETURNING *
    `, [voteCount, articleId])
}
