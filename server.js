//Npm Packages
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); //uuidv4(); ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const PORT = process.env.PORT || 3000; //Includes port for Heroku
const app = express();

//Using Statice Files and Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

//Paths
app.get("/notes", function(req, res){
  res.sendFile(`${__dirname}/public/notes.html`);
});

app.get("/api/notes", function(req, res){
  fs.readFile(`${__dirname}/db/db.json`,function(err, data){
    if(err){
      throw err;
    } else {
      res.send(data);
    }
  });
});

app.post("/api/notes", function(req, res) {
  console.log(req);
});



app.get("*",function(req, res){
  res.sendFile(`${__dirname}/public/index.html`);
});


app.listen(PORT, function() {
  console.log(`Server is running in port ${PORT}!`);
});
