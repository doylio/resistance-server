//Init
require('./config/config');

//Libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const {ObjectID} = require('mongodb');

//Local
const {mongoose} = require('./db/mongoose');
const User = require('./models/User');
const Game = require('./models/Game');
const {logError} = require('./logs/error');
const {authenticate} = require('./middleware/authenticate');

//Server configuration
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['x-auth']
}));
app.use((req, res, next) => {
	if(process.env.NODE_ENV !== 'test') {
		let now = new Date().toString();
		let log = `${now}: ${req.method} ${req.url}`;
		console.log(log);
		fs.appendFile('./logs/server.log', log + '\n', err => {
			if(err) {
				console.log("Unable to append to server.log");
			}
		})
		next();
	} else {
		next();
	}
});

app.post('/user', (req, res) => {
    let {name} = req.body;
    let user = new User({name});
    user.save()
    .then(() => user.generateAuthToken())
    .then(token => {
        res.header('x-auth', token).send()
    }).catch(e => {
        res.status(400).send();
        logError(e, req);
    })
});

app.post('/game', authenticate, (req, res) => {
	let {password} = req.body;
	let {user} = req;
	let _id = new ObjectID();
	let game = new Game({password, _id});
	game.players.push({_id: user._id});
	game.save()
	.then(() => {
		user.game = game._id;
		return user.save();
	}).then(() => {
		res.send({game_id: _id});
	}).catch(e => {
		res.status(400).send();
		logError(e, req);
	});
})

app.post('/join/:_id', authenticate, (req, res) => {
	let {password} = req.body;
	let {_id} = req.params;
	Game.findById(_id)
	.then(game => {
		if(game.password !== password && game.password !== undefined) {
			return res.status(401).send();
		}
		game.players.push({_id: req.user._id});
		req.user.game = _id;
		return game.save();
	}).then(() => req.user.save())
	.then(() => res.send({game_id: _id}))
	.catch(e => {
		res.status(400).send();
		logError(e, req);
	});
});

app.post('/start/:_id', authenticate, (req, res) => {
	
});


app.listen(port, () => console.log(`Server lisening on port ${port}`));

module.exports = {app};