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
                    created_at: "2020-07-09T20:11:00.000Z",
                    //I edited created_at in my test bc the returned object had a timestamp, should i have done something in the model to format this?
                    votes: 100,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  }}
                expect(returnedObj).toEqual(expectedObj)
            })
        })
    })
    describe('GET /api/articles/:articles_id invalid requests', ()=> {
        test('404 status responds with "article not Found" message when given an article id no. that does not yet exist', ()=> {
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
    // describe block here testing for invalid requests with 400 and 404 errors
})

/*
Should:

be available on /api/articles/:article_id.
get an article by its id.
Responds with:

an article object, which should have the following properties:
author
title
article_id
body
topic
created_at
votes
article_img_url
Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.
*/


