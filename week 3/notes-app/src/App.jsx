import { useState } from "react";

function App() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Note 1", content: "Content 1" },
    { id: 2, title: "Note 2", content: "Content 2" },
    { id: 3, title: "Note 3", content: "Content 3" },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function addNote(e) {
    e.preventDefault();

    if (!title || !content) return;

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
    <div className="app">
      <header className="header">
        <h1 className="title">
          <span className="title-icon">&#10070;</span>
          Notes
        </h1>
      </header>

      <main className="main">
        <form onSubmit={addNote} className="form">
          <div className="form-field">
            <input
              id="note-title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="note-title" className="field-label">
              Title
            </label>
          </div>

          <div className="form-field">
            <textarea
              id="note-content"
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label htmlFor="note-content" className="field-label">
              Note
            </label>
          </div>

          <button type="submit" className="btn">
            Add Note
          </button>
        </form>

        <div className="notes">
          {notes.length === 0 && (
            <p className="empty">No notes yet &mdash; write something.</p>
          )}
          {notes.map((note, i) => (
            <article
              className="note"
              key={note.id}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="note-body">
                <h2 className="note-title">{note.title}</h2>
                <p className="note-content">{note.content}</p>
              </div>
              <time className="note-date">
                {new Date(note.id).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
