const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'public'
    },

    description: {
        type: String,
        required: true
    },

    creationDate: {
        type: Date,
        default: Date.now
    }

})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;