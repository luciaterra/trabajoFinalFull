document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const newTaskInput = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');
    const showAllBtn = document.getElementById('show-all');
    const showPendingBtn = document.getElementById('show-pending');
    const showCompletedBtn = document.getElementById('show-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; 
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = ''; 

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending') {
                return !task.completed;
            } else if (currentFilter === 'completed') {
                return task.completed;
            }
            return true; 
        });

        if (filteredTasks.length === 0 && tasks.length > 0) {
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
            listItem.dataset.id = task.id; 

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


    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const text = newTaskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(), 
                text,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            newTaskInput.value = ''; 
            renderTasks();
        }
    });

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (!listItem) return; 

        const taskId = parseInt(listItem.dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (e.target.type === 'checkbox') {
            tasks[taskIndex].completed = e.target.checked;
            saveTasks();
            renderTasks(); 
        } else if (e.target.classList.contains('delete-btn')) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const taskSpan = listItem.querySelector('span');
            const originalText = taskSpan.textContent;

            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = originalText;
            listItem.insertBefore(editInput, taskSpan); 
            taskSpan.style.display = 'none'; 

            listItem.classList.add('editing'); 

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Guardar';
            saveButton.classList.add('save-btn');
            listItem.querySelector('.task-actions').appendChild(saveButton);

            editInput.focus(); 

            saveButton.addEventListener('click', () => {
                const newText = editInput.value.trim();
                if (newText && newText !== originalText) {
                    tasks[taskIndex].text = newText;
                    saveTasks();
                }
                listItem.removeChild(editInput);
                listItem.classList.remove('editing');
                taskSpan.style.display = 'inline-block';
                taskSpan.textContent = newText; 
                saveButton.remove(); 
                renderTasks(); 
            }, { once: true }); 
            editInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    saveButton.click(); 
                }
            });

            editInput.addEventListener('blur', () => {
                if (listItem.classList.contains('editing') && saveButton.parentNode) {
                    saveButton.click();
                }
            });

        }
    });

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

    renderTasks();
});
