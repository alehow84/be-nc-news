const request = require('supertest')
const {app} = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const endpointInfo = require('../endpoints.json')


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




