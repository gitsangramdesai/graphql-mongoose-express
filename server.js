const express = require("express");
const app = express();

const schema = require("./schema/schema")
const {graphqlHTTP} = require("express-graphql")

require("dotenv").config()
const PORT = 4000 || process.env.PORT

const mongoose = require("mongoose")
const uri = process.env.MONGODB_URI
mongoose.connect(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});
    
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Cluster has been connected.");
});


//app.use(express.urlencoded({ extended: true }))

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
 })
);


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
});

