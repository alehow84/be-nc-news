const {fetchTopics} = require('../models/ncnews.model');

exports.getTopics = (req, res, next) => {

    //invoke the function from model to fetch topics
    //include then block to send status
    //include catch block to handle error - not yet?
    fetchTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

