const mongoose = require('mongoose')


const DB = process.env.DB;
const username = process.env.ATLAS_USERNAME;
const pw = process.env.ATLAS_PASSWORD;
const uri = `mongodb+srv://${username}:${pw}@mydb.krtdpk7.mongodb.net/${DB}?retryWrites=true&w=majority`;
mongoose.connect(uri, {useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => console.log("SERVER RUNNING ✔✔"))
    .catch(err => console.log("ERROR ❌❌", err));