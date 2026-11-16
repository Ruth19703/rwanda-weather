

import chalk from "chalk";
import fs from "node:fs";

const FILE_NAME = new URL("./notes.json", import.meta.url);

function getNotes() {
    if (!fs.existsSync(FILE_NAME)) {
        return [];
    }

    const data = fs.readFileSync(FILE_NAME, "utf-8");

    return JSON.parse(data);
}

function saveNotes(notes) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(notes, null, 2));
}

function addNote(note) {
    if (!note) {
        console.log(chalk.red("Error: Please provide a note."));
        console.log(chalk.dim('Hint: notes add "Your note"'));
        return;
    }

    const notes = getNotes();

    notes.push({
        id: Date.now(),
        text: note
    });

    saveNotes(notes);

    console.log(chalk.green(`Success! Note added: ${note}`));
}

function listNotes() {
    const notes = getNotes();

    if (notes.length === 0) {
        console.log(chalk.dim("No notes available yet."));
        return;
    }

    console.log(chalk.green("Your notes:"));

    notes.forEach((note, index) => {
        console.log(`${index + 1}. ${note.text}`);
    });
}

const command = process.argv[2];
const noteText = process.argv.slice(3).join(" ");

if (command === "add") {
    addNote(noteText);
} else if (command === "list") {
    listNotes();
} else {
    console.log(chalk.red("Error: Unknown command."));
    console.log(chalk.dim("Available commands:"));
    console.log(chalk.dim('notes add "Your note"'));
    console.log(chalk.dim("notes list"));
}
