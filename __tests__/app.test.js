const request = require('supertest')
const {app} = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const endpointInfo = require("../endpoints.json")


beforeEach(() => seed(testData));
afterAll(() => db.end());



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
    describe('GET /api/topics invalid requests', ()=>{
        test('404: responds with not found when given an unrecognisable endpoint', () =>{
            return request(app)
            .get('/api/topix')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('not found')
            })
        })
    })
})
describe('/api', () => {
    describe('GET /api', () => {
        describe('GET/api valid requests', ()=>{
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
})
describe('/api/articles', ()=>{
    describe('GET /api/articles valid requests', ()=>{
        test('200 should respond with an array of article objects with the correct properties', ()=>{
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body})=>{
                expect(body.articles.length).toBe(13) 
                body.articles.forEach((article) =>{
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
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true
                })
            })
        })
        test('200 should respond with an array of article objects sorted by the given sort_by query (not default created_at). Valid sort_by queries include title, topic, author, votes and comment_count', ()=>{
            return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy('title', {descending:true})
            })
        })
        test('200 should return an array of articles sorted by the given sort_by query in the order specified by the order query', ()=>{
            return request(app)
            .get('/api/articles?sort_by=votes&order=asc')
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy('votes', {ascending: true})
            })
        })
    }) 
})
    describe('GET /api/articles errors', ()=>{
        test('404 status responds with "not found" when given a misspelled endpoint', ()=>{
            return request(app)
            .get('/api/artickles')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('not found')
            })
        })
        test('404 responds with "not found" when given a sort_by query for a column that does not yet exist', ()=>{
            return request(app)
            .get('/api/articles?sort_by=reading_time')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("requested sort_by column not found")
            })
        })
        test('400 responds with "invalid order query"', ()=>{
            return request(app)
            .get('/api/articles?sort_by=comment_count&order=bunnies')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("bad request - invalid order query")
            })

        })
    })
    describe('GET /api/articles?topic=existing-topic', ()=>{
        test('returns an articles object containing an array of articles matching the queried topic where the topic exists', ()=>{
            return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({body})=>{
                expect(body.articles.length).toBe(12)
                body.articles.forEach((article)=>{
                    expect(article).toMatchObject({
                        title: expect.any(String),
                        topic: "mitch",
                        author: expect.any(String),
                        created_at: expect.any(String),
                        article_img_url:
                        expect.any(String),
                      })
                })
            })
        })
        test('returns an empty array when given a topic that exists but has no articles associated with it', ()=>{
            return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toEqual([])
            })  
        })
        describe('GET /api/articles?topic=errors', ()=>{
            test('returns "topic not found" message when given a topic query that does not yet exist', ()=>{
                return request(app)
                .get("/api/articles?topic=eggs")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('topic not found')
                })
            })
        })
    })
    describe('/api/articles/:articles_id HERE', ()=> {
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
                    expect(returnedObj).toMatchObject(expectedObj)
                })
            })
            test('200 responds with the correct articles object, now to include a comment_count property showing how many comments that article has', ()=>{
                return request(app)
                .get('/api/articles/9')
                .then(({body})=>{
                    const returnedObj = body
                    const expectedObj = {article: {
                        article_id: 9,
                        title: "They're not exactly dogs, are they?",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "Well? Think about it.",
                        created_at: expect.any(String),
                        votes: 0,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                          comment_count: "2"
                      }
                    }
                    expect(returnedObj).toMatchObject(expectedObj)
                })
            })
        })
        describe('GET /api/articles/:articles_id invalid requests', ()=> {
            test('404 status responds with "Article not found" message when given an article id no. that does not yet exist', ()=> {
                return request(app)
                .get('/api/articles/20')
                .expect(404)
                .then(({body}) =>{
                    expect(body.msg).toBe('Article not found')
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
    describe('PATCH /api/articles/:articles_id valid requests', ()=>{
            test('200 should respond with the article with vote property updated to equal the given vote count where the vote property was previously 0', ()=>{
                  const newVote = { inc_votes : 1 }
                  const newVotes = {inc_votes: newVote}
                return request(app)
                .patch('/api/articles/4')
                .send(newVotes)
                .expect(200)
                .then(({body})=>{
                    expect(body.article).toMatchObject({
                        article_id: 4,
                        title: "Student SUES Mitch!",
                        topic: "mitch",
                        author: "rogersop",
                        body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                        created_at: expect.any(String),
                        votes: 1,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                    })
                })
            })
            test('200 should respond with vote property updated to the correct number where there was already an existing vote value, and the voteCount was a positive integer', ()=>{
                  const newVote = { inc_votes : 1 }
                  const newVotes = {inc_votes: newVote}
                return request(app)
                .patch('/api/articles/1')
                .send(newVotes)
                .expect(200)
                .then(({body})=>{
                    expect(body.article).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.any(String),
                        votes: 101,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      })
                })
            })
            test('200 should respond with vote property updated to the correct number where there was already an existing vote value, and the voteCount was a negative integer', ()=>{
                const newVote = { inc_votes : -10 }
                const newVotes = {inc_votes: newVote}
              return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(200)
              .then(({body})=>{
                  expect(body.article).toMatchObject({
                      article_id: 1,
                      title: "Living in the shadow of a great man",
                      topic: "mitch",
                      author: "butter_bridge",
                      body: "I find this existence challenging",
                      created_at: expect.any(String),
                      votes: 90,
                      article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    })
              })
          })
        })
    describe('PATCH /api/articles/:articles_id invalid requests', ()=>{
            test('404 responds with "not found" message when user tries to update the votes for a non-existent article', ()=> {
                const newVote = { inc_votes : 1 }
                const newVotes = {inc_votes: newVote}
                return request(app)
                .patch('/api/articles/500')
                .send(newVotes)
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('not found')
                })
            })
            test('400 responds with "bad request" msg when user enters an invalid article_id type', ()=>{
                const newVote = { inc_votes : 1 }
                const newVotes = {inc_votes: newVote}
                return request(app)
                .patch('/api/articles/sukiIs2')
                .send(newVotes)
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('bad request')
                })
            })
            test('400 responds with "bad request" msg when user tries to update voted with a malformed newVote obj', ()=>{
                const newVote = { inc_votes : "kitty" }
                const newVotes = {inc_votes: newVote}
                return request(app)
                .patch('/api/articles/1')
                .send(newVotes)
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('bad request')
                })
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
                expect(body.msg).toBe('not found')
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
                "username": "butter_bridge",
                "body": "I can't wait for bed-time"
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
        test('201 Responds with the posted comment object', ()=>{
            
            const postedComment = {
                "username": "butter_bridge",
                "body": "I can't wait for bed-time"
            }
            return request(app)
            .post("/api/articles/5/comments")
            .send(postedComment)
            .expect(201)
            .then(({body})=>{
                expect(body.postedComment).toMatchObject({
                    comment_id: 19,
                    body: "I can't wait for bed-time",
                    article_id: 5,
                    author: 'butter_bridge',
                    votes: 0,
                    created_at: expect.any(String)
                })
            })
        })
        test('201 Responds with posted comment object when given an object with additional properties that were not expected', ()=>{
            const postedComment = {
                "username": "butter_bridge",
                "body": "I can't wait for bed-time",
                "article_id" : 5
            }
            return request(app)
            .post("/api/articles/5/comments")
            .send(postedComment)
            .expect(201)
            .then(({body})=>{
                expect(body.postedComment).toMatchObject({
                    "author": "butter_bridge",
                    "body": "I can't wait for bed-time"
                })
            }) 
        })
    })
    describe('POST /api/articles/:article_id/comments invalid endpoints', ()=> {
        test('404 responds with "not found" message when user tries to post a comment where the article does not yet exist', ()=>{
            const newComment = {
                "body": "I can't wait for bed-time",
                "username": "butter_bridge"
            }
            return request(app)
            .post('/api/articles/50/comments')
            .send(newComment)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('not found')
            })
        })
        test('400 responds with "bad request" msg when user tries to post a comment with a nonsensical article_id and does not post the comment to the comments db', ()=>{
            const newComment = {
                "body": "I can't wait for bed-time",
                "username": "butter_bridge"
            }
            return request(app)
            .post('/api/articles/muesli/comments')
            .send(newComment)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
        test('404 responds with a "not found" msg when trying to post a comment with a valid article_id but user not found in the user db', ()=>{
            const newComment = {
                "body": "I can't wait for bed-time",
                "username": "SleepyGal5000"
            }
            return request(app)
            .post('/api/articles/50/comments')
            .send(newComment)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('not found')
            })
        })
    })
})
describe('/api/comments/:comment_id', ()=> {
    describe('DELETE /api/comments/:comment_id', ()=>{
        describe('DELETE /api/comments/:comment_id valid requests', ()=>{
            test('204 should delete the comment when given an existing comment id', ()=>{
                return request(app)
                .delete('/api/comments/1')
                .expect(204)
            })
        })
        describe('DELETE /api/comments/:comment_id invalid requests', ()=>{
            test('404 should respond with "not found" when given a comment id that does not exist', ()=>{
                return request(app)
                .delete('/api/comments/1000')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('not found')
                })
            })
            test('400 should respond with "bad request" when given a nonsense comment_id', ()=>{
                return request(app)
                .delete('/api/comments/brainMelt')
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('bad request')
                })
            })
        })

    })
})
describe('/api/users', ()=>{
    describe('GET api users valid requests', ()=>{
        test('200 responds with an array of user objects with the expected properties', ()=>{
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body})=>{
                expect(body.users.length).toBe(4)
                body.users.forEach((user)=>{
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        })
    })
})
