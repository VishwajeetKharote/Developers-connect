const mongoose = require('mongoose');
const User = require('./User');

const Profile = mongoose.model('profile', new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    handle:{
        type:String,
        required:true
    },
    company:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String]
    },
    bio:{
        type:String
    },
    githubusername:{
        type:String
    },
    experience: [
        {
            title: {
                type:String,
                required:true
            },
            company:{
                type:String,
                required:true
            },
            location:{
                type:String
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
        }
    ],
    education:[
        {
            school:{
                type:String,
                required:true
            },
            degree:{
                type:String,
                required:true
            },
            fieldofstudy:{
                type:String,
                required:true
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
        }
    ],
    social:{
        linkedin:{
            type:String,
            required:true
        },
        facebook:{
            type:String,
        },
        github:{
            type:String
        }
    },
    date:{
        type:Date,
        default:Date.now
    }
}));

module.exports = Profile;