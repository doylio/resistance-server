const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    players: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        role: {
            type: String,
            validate: {
                validator: function(v) {
                    return v === 'Resistance' || 'Spy' || undefined;
                }
            }
        }
    }],
    status: {
        type: String,
        default: "Lobby"
    },
    password: {
        type: String,
        default: undefined,
    },
})


GameSchema.methods.assignTeams = function () {
    if(this.players.length < 5) {
        return Promise.reject();
    }
    
}

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;