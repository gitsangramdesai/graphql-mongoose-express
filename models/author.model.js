const mongoose = require("mongoose")
const Schema = mongoose.Schema
const AuthorSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    bio: { type: String, required: true },
    picture: { type: String, required: true }
})
module.exports = mongoose.model("Author", AuthorSchema)