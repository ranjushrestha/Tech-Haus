import { useState } from "react";


function App() {
  const [notes, setNotes] = useState([
        { id: 1, title: "Note 1", content: "Content 1" },
        { id: 2, title: "Note 2", content: "Content 2" },
        { id: 3, title: "Note 3", content: "Content 3" }
    ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function addNote(e) {
    e.preventDefault();

    if (!title || !content) return

    const newNote = {
      id: Date.now(),
      title,
      content,
    };

    setNotes((prevNotes) => [newNote, ...prevNotes]);

    setTitle("");
    setContent("");
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Notes App</h1>

        <form onSubmit={addNote} className="form">
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit">Add Note</button>
        </form>

        <h2>Total Notes: {notes.length}</h2>

        <div className="notes">
          {notes.map((note) => (
            <div className="note" key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;