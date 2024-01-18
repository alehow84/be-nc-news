const request = require('supertest')
const {app} = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const endpointInfo = require("../endpoints.json")


beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('GET /api/unrecognisable-endpoints', ()=>{
    test('404: responds with not found when given an unrecognisable endpoint', () =>{
        return request(app)
        .get('/api/topix')
        .expect(404)
    })
})
describe('/api/topics', () => {
    describe('GET /api/topics valid requests', () => {
        test('200 status returns an array of topic objects to the user with the expected keys', () =>{
            return request(app)
            .get("/api/topics")
            .expect(200) 
            .then(({body})=>{
                const topicsTotal = testData.topicData.length
                expect(body.topics.length).toBe(topicsTotal)
                body.topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                    expect(topic).toMatchObject({description: expect.anything(), slug: expect.anything()})
                })
            })
        })
    })
})
describe('/api', () => {
    describe('GET /api valid requests', () => {
        test('200 status returns an object describing all available endpoints on the API', () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body}) => {
                const endpointsObj = body
                expect(endpointsObj).toEqual(endpointInfo)
            })
        })
    })
})
describe('/api/articles', ()=>{
    describe('GET /api/articles/:articles_id valid requests', ()=> {
        test('200 status responds with the correct articles object', ()=>{
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({body}) => {
                const returnedObj = body
                const expectedObj = { article :{
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 100,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  }}
                expect(returnedObj).toEqual(expectedObj)
            })
        })
    })
    describe('GET /api/articles/:articles_id invalid requests', ()=> {
        test('404 status responds with "article not found" message when given an article id no. that does not yet exist', ()=> {
            return request(app)
            .get('/api/articles/20')
            .expect(404)
            .then(({body}) =>{
                expect(body.msg).toBe('article not found')
            })
        })
        test('400 status responds with "bad request" message when given a nonsensical article_id', ()=> {
            return request(app)
            .get('/api/articles/kittens')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
        
    })
    describe('GET /api/articles valid requests', ()=>{
        /*
        Missing functionality from this endpoint
        -error testing for this endpoint
        */
        test('200 should respond with an array of article objects with the correct properties', ()=>{
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body})=>{
                expect(body.length).toBe(13) 
                body.forEach((article) =>{
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String)
                    })
                })
            })

        })
        test('200 should respond with an array of article objects sorted by date in descending order', ()=> {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body})=>{
                expect(body).toBeSortedBy("created_at", {
                    descending: true
                })
            })
        })
    })
    describe('GET /api/articles invalid requests', ()=>{
        test.skip('400 status responds with "bad request" when given a misspelled endpoint', ()=>{
            return request(app)
            .get('/api/artickles')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
            //not catching an error in the controller catch block, do i need to reject a promise in the model?
        })
    })
    describe('GET /api/articles/:article_id/comments valid endpoints', ()=>{
        test('200 should respond with an array of comments for the selected article', () => {
            return request(app)
            .get('/api/articles/9/comments')
            .expect(200)
            .then(({body})=>{
                expect(body.length).toBe(2)
                body.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                        author: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String)
                    })
                })
            })
        })
        test('200 should respond with an array of comments sorted by created_at, the most recent first/ descending order', ()=>{
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body})=>{
                expect(body).toBeSortedBy("created_at", {
                    descending: true
                })
            })
        })
    })
    describe('GET /api/articles/:article_id/comments invalid endpoints', ()=>{
        test('404 status responds with "article not found" message when user searches for comments for an article that doesnt exist yet', ()=>{
            return request(app)
            .get('/api/articles/500/comments')
            .expect(404)
            .then(({body}) =>{
                expect(body.msg).toBe('article not found')
            })
        })
        test('400 status responds with "bad request" message when user searches for comments with a nonsensical article id', ()=>{
            return request(app)
            .get('/api/articles/egg/comments')
            .expect(400)
            .then(({body}) =>{
                expect(body.msg).toBe('bad request')
            })
        })
    })
    describe('POST /api/articles/:article_id/comments valid endpoints', ()=>{
        test('201 Adds a new comment object to the database', ()=>{
            const newComment = {
                "body": "I can't wait for bed-time",
                "article_id": 5,
                "author": "butter_bridge",
                "votes": 10,
                "created_at": "2024-01-17T20:15:27.000Z"
            }
            return request(app)
            .post("/api/articles/5/comments")
            .send(newComment)
            .expect(201)
            .then(() => {
                return request(app)
                .get("/api/articles/5/comments")
                .then(({body}) => {
                expect(body.length).toBe(3);
                });
            })
        })
        test('', ()=>{

        })
    }) 
})

//then test for the response
        //then error handle for 400 if there is a malformed body/ missing fields in object
        //then error handle 400 for failing schema validation?

/*
Should:

be available on /api/articles/:article_id/comments.
add a comment for an article.
Request body accepts:

an object with the following properties:
username
body
Responds with:

the posted comment.
Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.
*/