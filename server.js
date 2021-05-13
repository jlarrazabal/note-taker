//Npm Packages
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); //uuidv4(); ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const PORT = process.env.PORT || 3000; //Includes port for Heroku
const app = express();

//Classes
class Note {
  constructor(title, text) {
      this.title = title;
      this.text = text;
      this.id = uuidv4();
  }
}

//Using Statice Files and Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  const newNote = new Note(req.body.title,req.body.text);
  console.log(newNote);
  fs.readFile(`${__dirname}/db/db.json`, 'utf8', function(err, data){
    if(err){
      throw err;
    } else {
      console.log(data);
      const db = [];
      JSON.parse(data).forEach((item, i) => {
        db.push(item);
      });
      db.push(newNote);
      if(db[0].length === 0) {
        db.shift();
      }
      fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(db), function(err){
        if(err) {
          throw err;
        } else {
          console.log("Note added to data base");
        }
      });
      res.redirect("/api/notes");
    }
  });
});



app.get("*",function(req, res){
  res.sendFile(`${__dirname}/public/index.html`);
});


app.listen(PORT, function() {
  console.log(`Server is running in port ${PORT}!`);
});
