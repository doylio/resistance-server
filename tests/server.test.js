//Libraries
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//Local
const {app} = require('../index');
const User = require('../models/User');
const Game = require('../models/Game');
const {testUsers, populateUsers} = require('./seed');

beforeEach(populateUsers);

describe('POST /user', () => {
    it('should create a new user', done => {
        let body = {name: "Aragorn"};
        request(app)
        .post('/user')
        .send(body)
        .expect(200)
        .expect(res => {
            expect(res.headers['x-auth']).toBeDefined();
        }).end((err, res) => {
            if(err) {
                return done(err);
            }
            User.find()
            .then(users => {
                expect(users.length).toBe(3);
                done();
            }).catch(done);
        });
    });
    it('should return 400 for duplicate name', done => {
        let body = {name: testUsers[0].name};
        request(app)
        .post('/user')
        .send(body)
        .expect(400)
        .expect(res => {
            expect(res.headers['x-auth']).not.toBeDefined();
        }).end((err, res) => {
            if(err) {
                return done(err);
            }
            User.find()
            .then(users => {
                expect(users.length).toBe(2);
                done();
            }).catch(done);
        })
    });
    it('should return 400 for invalid request', done => {
        request(app)
        .post('/user')
        .expect(400)
        .expect(res => {
            expect(res.headers['x-auth']).not.toBeDefined();
        }).end((err, res) => {
            if(err) {
                return done(err);
            }
            User.find()
            .then(users => {
                expect(users.length).toBe(2);
                done();
            }).catch(done);
        })
    });
});

describe('POST /game', () => {
    it('should create a new game', done => {
        let token = testUsers[0].tokens[0].token;
        let {_id} = testUsers[0];
        request(app)
        .post('/game')
        .send({})
        .set('x-auth', token)
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            User.findById(_id)
            .then(user => {
                expect(user.game).toBe(res.body.game_id);
            });
            Game.find()
        })
    });
})
