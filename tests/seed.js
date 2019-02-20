//Libraries
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

//Local
const User = require('./../models/User');

const firstObjectID = new ObjectID();
const secondObjectID = new ObjectID();

const testGames = [{
  _id: new ObjectID().toHexString(),
  players: [{
    _id: firstObjectID.toHexString(),
    role: undefined,
  }],
}, {

}]

const testUsers = [{
    _id: firstObjectID.toHexString(),
    name: "Harry Potter",
    tokens: [{
		access: 'auth',
		token: jwt.sign({_id: firstObjectID, access: 'auth'}, process.env.JWT_SECRET).toString()
	}],
},{
    _id: secondObjectID.toHexString(),
    name: "Ron Weasley",
    tokens: [{
		access: 'auth',
		token: jwt.sign({_id: secondObjectID, access: 'auth'}, process.env.JWT_SECRET).toString()
	}],
}]

const populateUsers = done => {
    User.deleteMany()
    .then(() => User.insertMany(testUsers))
    .then(() => done())
    .catch(done);
}



module.exports = {testUsers, populateUsers};