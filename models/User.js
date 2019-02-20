const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
})

UserSchema.methods.generateAuthToken = function () {
	let {_id} = this;
	let access = 'auth';
	let token = jwt.sign({_id, access}, process.env.JWT_SECRET).toString();
	this.tokens.push({access, token});
	return this.save().then(() => token);
}

UserSchema.methods.removeToken = function (token) {
	return this.update({
		$pull: {
			tokens: {token}
		}
	})
}

UserSchema.statics.findByToken = function (token) {
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch(e) {
		return Promise.reject(e);
	}
	return this.findOne({
		_id: decoded._id,
		'tokens.access': decoded.access,
		'tokens.token': token,
	});
}

const User = mongoose.model('User', UserSchema);

module.exports = User;