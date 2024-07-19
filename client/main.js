const apiUrl = "http://localhost:8080/api/v1/note";

document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display all notes on page load
  fetchNotes();
});
async function fetchNotes(searchQuery = "") {
  try {
    fetch(`${apiUrl}/all-notes?search=${encodeURIComponent(searchQuery)}`)
      .then((response) => response.json())
      .then((data) => displayNotes(data))
      .catch((error) => console.error("Error fetching data:", error));
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

// Search functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.trim();

  fetchNotes(searchText); // Pass search query to fetchNotes function
});

// Handle form submission to create a new note
const createNoteForm = document.getElementById("create-note-form");
createNoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("modal-title").value;
  const content = document.getElementById("modal-content").value;
  const tags = document.getElementById("modal-tags").value;
  const color = document.getElementById("modal-color").value;
  try {
    const formData = {
      title,
      content,
      tags,
      color,
    };
    const response = await fetch(`${apiUrl}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    // console.log("Created note:", result);

    // Clear form fields after successful creation
    document.getElementById("modal-title").value = "";
    document.getElementById("modal-content").value = "";
    document.getElementById("modal-tags").value = "";
    document.getElementById("modal-color").value = "#e66465";

    // Fetch and display all notes again to update the list
    fetchNotes();
  } catch (error) {
    console.error("Error creating note:", error);
  }
});

function displayNotes(notes) {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";

  notes.forEach((note) => {
    const noteElement = createNoteElement(note);
    notesContainer.appendChild(noteElement);
  });
}

function createNoteElement(note) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");
  noteElement.setAttribute("data-note-id", note._id);

  noteElement.style.backgroundColor = note.color;

  noteElement.innerHTML = `
    <h2>${note.title}</h2>
    <p>${note.content}</p>
    <div>Tags: ${note.tags.join(", ")}</div>
    <button class="edit-button" onclick="openEditModal('${note._id}','${
    note.title
  }','${note.content}','${note.tags.join(", ")}','${note.color}')">Edit</button>
<button class="archive-button" onclick="archiveNote('${
    note._id
  }')">Archive</button>
    <button class="del-button" onclick="trashNote('${
      note._id
    }')">Delete</button>
    
`;
  return noteElement;
}

function showCreateNoteForm() {
  document.getElementById("modal-title").value = "";
  document.getElementById("modal-content").value = "";
  document.getElementById("modal-tags").value = "";
  document.getElementById("save-note-btn").innerText = "Save";
  document
    .getElementById("save-note-btn")
    .setAttribute("data-action", "create");

  document.getElementById("note-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("note-modal").style.display = "none";
}

function openEditModal(
  id,
  currentTitle,
  currentContent,
  currentTags,
  currentColor
) {
  // Populate modal fields with current note data
  document.getElementById("editTitle").value = currentTitle;
  document.getElementById("editContent").value = currentContent;
  document.getElementById("editTags").value = currentTags;
  document.getElementById("editColor").value = currentColor;

  // Show the modal
  const modal = document.getElementById("editModal");
  modal.style.display = "block";

  // Save edited note when form is submitted
  const editForm = document.getElementById("editForm");
  editForm.onsubmit = function (event) {
    event.preventDefault();
    const newTitle = document.getElementById("editTitle").value;
    const newContent = document.getElementById("editContent").value;
    const newTags = document.getElementById("editTags").value;
    const newColor = document.getElementById("editColor").value;

    editNote(id, newTitle, newContent, newTags, newColor);
  };
}

async function editNote(id, newTitle, newContent, newTags, newColor) {
  try {
    const response = await fetch(`${apiUrl}/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        tags: newTags,
        color: newColor,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("Updated note:", await response.json());

    // Close the modal after successful update
    closeEditModal();

    // Fetch and display all notes again to update the list
    fetchNotes();
  } catch (error) {
    console.error("Error updating note:", error);
  }
}

// Trash a note
async function trashNote(id) {
  fetch(`${apiUrl}/${id}/trash`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      // Remove the trashed note from the DOM
      const noteElement = document.querySelector(`.note[data-note-id="${id}"]`);
      if (noteElement) {
        noteElement.remove();
      }
    })
    .catch((err) => console.error(err));
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target == modal) {
    closeModal();
  }
};

async function archiveNote(id) {
  fetch(`${apiUrl}/${id}/archived`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      const noteElement = document.querySelector(`.note[data-note-id="${id}"]`);
      if (noteElement) {
        noteElement.remove();
      }
    })
    .catch((err) => console.error(err));
}

function showArchivedNotes() {
  try {
    fetch(`${apiUrl}/archived`)
      .then((response) => response.json())
      .then((notes) => {
        displayNotes(notes);
      });
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

function showTrashNotes() {
  try {
    fetch(`${apiUrl}/trashed`)
      .then((response) => response.json())
      .then((notes) => {
        displayNotes(notes);
      });
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}
