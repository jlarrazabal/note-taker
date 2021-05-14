//NPM Packages
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); // Package to create unique ids for the note objects.
const PORT = process.env.PORT || 3000; //Includes port for Heroku
const app = express();

//Classes
class Note {
  constructor(title, text) {
      this.title = title;
      this.text = text;
      this.id = uuidv4(); //Adds an unique id for the note object when created => Example: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed".
  }
}

//Using Static Files, Body Parser, and JSON.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//Sends the notes.html file when the user hits the "/notes" path.
app.get("/notes", function(req, res){
  res.sendFile(`${__dirname}/public/notes.html`);
});

//Sends the information in the db.json file.
app.get("/api/notes", function(req, res){
  fs.readFile(`${__dirname}/db/db.json`,function(err, data){
    if(err){
      throw err;
    } else {
      res.send(data);
    }
  });
});

//Captures The note save event, reads the db.json file, adds the new note, updates the db.json file, and redirects the user to "/notes".
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

//Captures The note delete event, reads the db.json file, deletes the note selected by de user by the note id, updates the db.json file, and redirects the user to "/notes".
app.delete("/api/notes/:id", function(req, res) {
  const id = req.params.id;
  fs.readFile(`${__dirname}/db/db.json`, 'utf8', function(err, data){
    if(err){
      throw err;
    } else {
      console.log(data);
      const db = [];
      JSON.parse(data).forEach((item, i) => {
        db.push(item);
      });
      db.forEach((item, i) => {
        if(item.id === id) {
          db.splice(i, 1);
        }
      });
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

//Sends the index.html file for any route that is note specified in server.
app.get("*",function(req, res){
  res.sendFile(`${__dirname}/public/index.html`);
});

//listens process.env.PORT and port 3000 for interactions with the server.
app.listen(PORT, function() {
  console.log(`Server is running in port ${PORT}!`);
});
