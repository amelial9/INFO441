import mongoose from 'mongoose'

const models = {}

console.log("Connecting to mongodb")

await mongoose.connect("mongodb+srv://amelialx99:v4SGBws28ToXauLJ@websharer.bkvawmn.mongodb.net/websharer")

console.log("Successfully connected to mongodb!")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    username: String,
    likes: [String],
    created_date: Date
})

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    created_date: Date
})

const userInfoSchema = new mongoose.Schema({
    username: String,
    favoriteBobaPlace:String,
    personalWebsite: String
})

models.Post = mongoose.model('Post', postSchema)
models.Comment = mongoose.model('Comment', commentSchema)
models.UserInfo = mongoose.model('UserInfo', userInfoSchema)

console.log("Finished creating models")

export default models