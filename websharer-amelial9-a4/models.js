import mongoose from 'mongoose'

const models = {}

console.log("Connecting to mongodb")

await mongoose.connect("mongodb+srv://amelialx99:v4SGBws28ToXauLJ@websharer.bkvawmn.mongodb.net/websharer")

console.log("Successfully connected to mongodb!")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    posterName: String,
    created_date: Date
})

models.Post = mongoose.model('Post', postSchema)

console.log("Finished creating models")

export default models