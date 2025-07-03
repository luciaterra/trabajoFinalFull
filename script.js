document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const newTaskInput = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');
    const showAllBtn = document.getElementById('show-all');
    const showPendingBtn = document.getElementById('show-pending');
    const showCompletedBtn = document.getElementById('show-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; // 'all', 'pending', 'completed'

    // Function to save tasks to local storage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to render tasks based on the current filter
    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear current list

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending') {
                return !task.completed;
            } else if (currentFilter === 'completed') {
                return task.completed;
            }
            return true; // Show all
        });

        if (filteredTasks.length === 0 && tasks.length > 0) {
            // If no tasks match the filter, but there are tasks in total,
            // inform the user.
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = `No hay tareas ${currentFilter === 'pending' ? 'pendientes' : 'completadas'} en este momento.`;
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.color = '#777';
            noTasksMessage.style.padding = '20px';
            taskList.appendChild(noTasksMessage);
            return;
        } else if (tasks.length === 0) {
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = "¡Aún no tienes tareas! Agrega una para empezar.";
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.color = '#777';
            noTasksMessage.style.padding = '20px';
            taskList.appendChild(noTasksMessage);
            return;
        }


        filteredTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.dataset.id = task.id; // Store ID for easy reference

            if (task.completed) {
                listItem.classList.add('completed');
            }

            listItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;

            taskList.appendChild(listItem);
        });
        updateFilterButtons();
    };

    // Function to update active filter button
    const updateFilterButtons = () => {
        showAllBtn.classList.remove('active');
        showPendingBtn.classList.remove('active');
        showCompletedBtn.classList.remove('active');

        if (currentFilter === 'all') {
            showAllBtn.classList.add('active');
        } else if (currentFilter === 'pending') {
            showPendingBtn.classList.add('active');
        } else if (currentFilter === 'completed') {
            showCompletedBtn.classList.add('active');
        }
    };


    // Add new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        const text = newTaskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(), // Unique ID
                text,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            newTaskInput.value = ''; // Clear input
            renderTasks();
        }
    });

    // Handle task actions (complete, edit, delete)
    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (!listItem) return; // Click was not on a list item

        const taskId = parseInt(listItem.dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (e.target.type === 'checkbox') {
            // Toggle completed status
            tasks[taskIndex].completed = e.target.checked;
            saveTasks();
            renderTasks(); // Re-render to apply 'completed' class
        } else if (e.target.classList.contains('delete-btn')) {
            // Delete task
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            // Edit task
            const taskSpan = listItem.querySelector('span');
            const originalText = taskSpan.textContent;

            // Create an input field for editing
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = originalText;
            listItem.insertBefore(editInput, taskSpan); // Insert before the span
            taskSpan.style.display = 'none'; // Hide the span

            listItem.classList.add('editing'); // Add class for styling

            // Create a save button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Guardar';
            saveButton.classList.add('save-btn');
            listItem.querySelector('.task-actions').appendChild(saveButton);

            editInput.focus(); // Focus the input field

            // Handle saving the edited task
            saveButton.addEventListener('click', () => {
                const newText = editInput.value.trim();
                if (newText && newText !== originalText) {
                    tasks[taskIndex].text = newText;
                    saveTasks();
                }
                // Revert to display mode
                listItem.removeChild(editInput);
                listItem.classList.remove('editing');
                taskSpan.style.display = 'inline-block';
                taskSpan.textContent = newText; // Update span text
                saveButton.remove(); // Remove save button
                renderTasks(); // Re-render to ensure state is consistent
            }, { once: true }); // Ensure this listener only runs once

            // Allow saving on Enter key press
            editInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    saveButton.click(); // Programmatically click the save button
                }
            });

            // If the user clicks outside the input while editing, save the changes
            editInput.addEventListener('blur', () => {
                if (listItem.classList.contains('editing') && saveButton.parentNode) {
                    saveButton.click();
                }
            });

        }
    });

    // Filter buttons event listeners
    showAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        renderTasks();
    });

    showPendingBtn.addEventListener('click', () => {
        currentFilter = 'pending';
        renderTasks();
    });

    showCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        renderTasks();
    });

    // Initial render when the page loads
    renderTasks();
});