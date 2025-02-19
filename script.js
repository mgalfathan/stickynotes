document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#FFD700', '#FF6347', '#3CB371', '#00BFFF', '#FF69B4', '#87CEFA', '#FF1493',
        '#ADFF2F', '#FFA07A', '#20B2AA', '#9370DB', '#FF4500', '#6A5ACD', '#B22222',
        '#7FFF00', '#D2691E', '#6495ED', '#FF8C00', '#8B008B', '#4682B4', '#C71585',
        '#7B68EE', '#D8BFD8', '#8A2BE2', '#5F9EA0', '#FFDAB9', '#E9967A', '#98FB98'];
    const notesContainer = document.getElementById('notes-container');
    const newNoteButton = document.getElementById('new-note');

    // Load existing notes from local storage
    loadNotes();

    newNoteButton.addEventListener('click', () => {
        const note = createNoteElement();
        notesContainer.appendChild(note);
        makeDraggable(note);
        saveNotes();
    });

    function createNoteElement(noteData = { color: colors[Math.floor(Math.random() * colors.length)], x: 100, y: 100, title: '', text: '' }) {
        const note = document.createElement('div');
        note.className = 'note';
        note.style.backgroundColor = noteData.color;
        note.style.left = `${noteData.x}px`;
        note.style.top = `${noteData.y}px`;
    
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-note';
        deleteButton.innerHTML = '&times;';
        deleteButton.addEventListener('click', () => {
            note.remove();
            saveNotes();
        });
    
        // Initialize title and text to avoid undefined values
        const title = noteData.title || ''; // Default to an empty string if undefined
        const text = noteData.text || ''; // Default to an empty string if undefined
    
        const titleInput = document.createElement('input');
        titleInput.className = 'note-title';
        titleInput.value = title;
        titleInput.placeholder = 'Title';
        titleInput.addEventListener('input', saveNotes);
    
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.placeholder = 'Write your note here...';
        textarea.addEventListener('input', saveNotes);
    
        note.appendChild(deleteButton);
        note.appendChild(titleInput);
        note.appendChild(textarea);
    
        return note;
    }

    function makeDraggable(element) {
        let offsetX, offsetY, isDragging = false;

        element.addEventListener('mousedown', (e) => {
            if (e.target.className === 'delete-note') return;  // Prevent dragging when clicking delete button
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = 1000;
            e.preventDefault(); // Prevent default behavior
        });

        element.addEventListener('touchstart', (e) => {
            if (e.target.className === 'delete-note') return;  // Prevent dragging when clicking delete button
            isDragging = true;
            const touch = e.touches[0];
            offsetX = touch.clientX - element.getBoundingClientRect().left;
            offsetY = touch.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = 1000;
            e.preventDefault(); // Prevent default behavior
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                e.preventDefault(); // Prevent default behavior
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                const x = touch.clientX - offsetX;
                const y = touch.clientY - offsetY;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                e.preventDefault(); // Prevent default behavior
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.zIndex = '';
            saveNotes();
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
            element.style.zIndex = '';
            saveNotes();
        });
    }

    function saveNotes() {
        const notes = Array.from(document.querySelectorAll('.note')).map(note => {
            const rect = note.getBoundingClientRect();
            return {
                color: note.style.backgroundColor,
                x: rect.left,
                y: rect.top,
                title: note.querySelector('.note-title').value,
                text: note.querySelector('textarea').value
            };
        });
        localStorage.setItem('stickyNotes', JSON.stringify(notes));
    }
    
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
        notes.forEach(noteData => {
            const note = createNoteElement(noteData);
            document.getElementById('notes-container').appendChild(note);
            makeDraggable(note);
        });
    }
});
