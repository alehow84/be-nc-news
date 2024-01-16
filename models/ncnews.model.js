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