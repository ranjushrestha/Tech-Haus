const fs = require("fs");
const readline = require("readline");
const chalk = require("chalk");

const FILE = "notes.json";
let lastDeletedNote = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function loadNotes() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, "[]");
    }

    const data = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(chalk.red("Error loading notes."));
    return [];
  }
}

function saveNotes(notes) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.log(chalk.red("Error saving notes."));
  }
}

let notes = loadNotes();

function getNextId() {
  if (notes.length === 0) return 1;
  return Math.max(...notes.map((note) => note.id)) + 1;
}

function showHelp() {
  console.log(`
Commands:
  add             - Add a new note
  list            - List all notes
  view <id>       - View a note
  edit <id>       - Edit a note
  delete <id>     - Delete a note
  search <text>   - Search notes
  filter <date>   - Filter by date YYYY-MM-DD
  sort title      - Sort alphabetically
  sort date       - Sort by date
  export-json     - Export notes to JSON
  export-csv      - Export notes to CSV
  undo-delete     - Restore last deleted note
  help            - Show this help
  exit            - Exit the app
`);
}

async function addNote() {
  const title = await ask("Title: ");
  const content = await ask("Content: ");
  const tagsInput = await ask("Tags (comma separated): ");
  const category = await ask("Category: ");

  if (!title.trim() || !content.trim()) {
    console.log(chalk.red("Title and content are required."));
    return;
  }

  const note = {
    id: getNextId(),
    title: title.trim(),
    content: content.trim(),
    tags: tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ""),
    category: category.trim() || "General",
    createdAt: new Date().toISOString().split("T")[0],
  };

  notes.push(note);
  saveNotes(notes);

  console.log(chalk.green(`Note saved! (ID: ${note.id})`));
}

function listNotes(data = notes) {
  if (data.length === 0) {
    console.log(chalk.yellow("No notes found."));
    return;
  }

  console.log("ID | Title | Category | Created");
  console.log("---|-------|----------|----------");

  data.forEach((note) => {
    console.log(`${note.id} | ${note.title} | ${note.category} | ${note.createdAt}`);
  });
}

function viewNote(id) {
  const note = notes.find((note) => note.id === id);

  if (!note) {
    console.log(chalk.red("Note not found."));
    return;
  }

  console.log(`
Title: ${note.title}
Created: ${note.createdAt}
Category: ${note.category}
Tags: ${note.tags.join(", ") || "No tags"}
Content: ${note.content}
`);
}

async function editNote(id) {
  const note = notes.find((note) => note.id === id);

  if (!note) {
    console.log(chalk.red("Note not found."));
    return;
  }

  const newTitle = await ask(`New title (${note.title}): `);
  const newContent = await ask(`New content (${note.content}): `);

  if (newTitle.trim()) note.title = newTitle.trim();
  if (newContent.trim()) note.content = newContent.trim();

  saveNotes(notes);
  console.log(chalk.green("Note updated!"));
}

function deleteNote(id) {
  const note = notes.find((note) => note.id === id);

  if (!note) {
    console.log(chalk.red("Note not found."));
    return;
  }

  lastDeletedNote = note;
  notes = notes.filter((note) => note.id !== id);
  saveNotes(notes);

  console.log(chalk.green("Note deleted!"));
}

function searchNotes(text) {
  const term = text.toLowerCase();

  const results = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
  );

  if (results.length === 0) {
    console.log(chalk.yellow("No matching notes found."));
    return;
  }

  console.log(chalk.green(`Found ${results.length} note(s):`));

  results.forEach((note) => {
    console.log(`${note.id}. ${note.title} - "${note.content}"`);
  });
}

function filterByDate(date) {
  const results = notes.filter((note) => note.createdAt === date);
  listNotes(results);
}

function sortNotes(type) {
  if (type === "title") {
    const sorted = [...notes].sort((a, b) => a.title.localeCompare(b.title));
    listNotes(sorted);
  } else if (type === "date") {
    const sorted = [...notes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    listNotes(sorted);
  } else {
    console.log(chalk.red("Use: sort title OR sort date"));
  }
}

function exportJSON() {
  fs.writeFileSync("notes-export.json", JSON.stringify(notes, null, 2));
  console.log(chalk.green("Exported to notes-export.json"));
}

function exportCSV() {
  const header = "ID,Title,Content,Category,Tags,Created\n";

  const rows = notes
    .map((note) => {
      return `${note.id},"${note.title}","${note.content}","${note.category}","${note.tags.join(
        "|"
      )}",${note.createdAt}`;
    })
    .join("\n");

  fs.writeFileSync("notes-export.csv", header + rows);
  console.log(chalk.green("Exported to notes-export.csv"));
}

function undoDelete() {
  if (!lastDeletedNote) {
    console.log(chalk.yellow("Nothing to undo."));
    return;
  }

  notes.push(lastDeletedNote);
  saveNotes(notes);
  console.log(chalk.green("Last deleted note restored!"));

  lastDeletedNote = null;
}

async function startApp() {
  const input = await ask("> ");
  const [command, ...args] = input.trim().split(" ");
  const value = args.join(" ");

  if (command === "help") {
    showHelp();
  } else if (command === "add") {
    await addNote();
  } else if (command === "list") {
    listNotes();
  } else if (command === "view") {
    viewNote(Number(value));
  } else if (command === "edit") {
    await editNote(Number(value));
  } else if (command === "delete") {
    deleteNote(Number(value));
  } else if (command === "search") {
    searchNotes(value);
  } else if (command === "filter") {
    filterByDate(value);
  } else if (command === "sort") {
    sortNotes(value);
  } else if (command === "export-json") {
    exportJSON();
  } else if (command === "export-csv") {
    exportCSV();
  } else if (command === "undo-delete") {
    undoDelete();
  } else if (command === "exit") {
    console.log(chalk.blue("Goodbye!"));
    rl.close();
    return;
  } else {
    console.log(chalk.red("Unknown command. Type 'help'."));
  }

  startApp();
}

console.log(chalk.blue("=== 📝 Notes CLI ==="));
console.log("Type 'help' for commands.");

startApp();