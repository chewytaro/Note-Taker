const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const app = express();
const PORT = process.env.PORT || 3002;


app.use(express.static(path.join(__dirname, 'Develop/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
});


app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "Develop/db/db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes from file." });
    }

    res.json(JSON.parse(data)); 
  });
});


app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  fs.readFile(path.join(__dirname, 'Develop/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'Develop/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).end();
      }
      res.json(newNote);
    });
  });
});


app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'Note-Taker/Develop/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }

    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(path.join(__dirname, 'Note-Taker/Develop/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).end();
      }
      res.status(200).end();
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});