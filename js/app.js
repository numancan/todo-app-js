const projectContainer = document.querySelector('.project-container');
const todoListContainer = document.querySelector('.todo-list');
const todoInput = document.querySelector('.todo-input');
const sideBar = document.querySelector('.side-bar');
const projectTitle = document.querySelector('.project-title');

let projectList = [];
let activeProject;

class Project {
  constructor(name, todos, id) {
    this.name = name.toLowerCase();
    this.todos = todos;
    this.id = id;
    this._saveToStorage();
  }

  addTodo() {
    const input = todoInput.value;
    const todo = { todo: input, checked: false };
    todoInput.value = '';

    this._createElement(todo);
    this.todos.push(todo);
    this._saveToStorage();
  }

  removeTodo() {
    const todoItem = event.target.parentElement;
    const index = this._getTodoIndex(todoItem);
    todoListContainer.removeChild(todoItem);
    this.todos.splice(index, 1);
    this._saveToStorage();
  }

  removeAllTodo() {
    this.todos = [];
    this._saveToStorage();
    todoListContainer.innerHTML = '';
  }

  changeChecboxState() {
    const todoItem = event.target.parentElement;
    const index = this._getTodoIndex(todoItem);
    this.todos[index].checked = !this.todos[index].checked;
    this._saveToStorage();
  }

  render() {
    todoListContainer.innerHTML = '';
    this.todos.forEach(todoItem => {
      this._createElement(todoItem);
    });
  }

  /* PRIVATE FUNCTIONS */
  _createElement({ todo, checked }) {
    const element = document.createElement('li');
    element.classList.add('todo');
    element.innerHTML = `<input type="checkbox">
                         <label>${todo}</label>
												 <button class="btn-del-todo"><i class="fas fa-plus-circle"></i></button>`;

    const deleteBtn = element.querySelector('button');
    const checkbox = element.querySelector('input');
    checkbox.checked = checked;

    checkbox.addEventListener('click', () => {
      this.changeChecboxState();
    });

    deleteBtn.addEventListener('click', () => {
      this.removeTodo();
    });
    todoListContainer.appendChild(element);
  }

  _getTodoIndex(todoElement) {
    return Array.prototype.indexOf.call(
      todoListContainer.children,
      todoElement
    );
  }

  _saveToStorage() {
    localStorage.setItem(`todo-app-${this.name}`, JSON.stringify(this.todos));
  }
}

const createProject = project => {
  project = project || new Project(prompt('Project Name'), [], idCount++);
  if (!project.name) return;
  projectList.push(project);

  const element = document.createElement('li');
  element.innerHTML = project.name;
  element.dataset.id = project.id;
  element.addEventListener('click', () => {
    changeActiveProject(project);
    sideBar.classList.remove('open');
  });
  projectContainer.appendChild(element);

  changeActiveProject(project);
};

const removeProject = () => {
  const activeProjectEl = getElementByDataId(activeProject.id);
  localStorage.removeItem(`todo-app-${activeProject.name}`);
  projectContainer.removeChild(activeProjectEl);
  projectList = projectList.filter(project => project.id != activeProject.id);
  activeProject = null;
  changeActiveProject();
};

const getElementByDataId = id => {
  return projectContainer.querySelector(`[data-id='${id}']`);
};

const changeActiveProject = (project = projectList[0]) => {
  if (!project) {
    projectTitle.innerHTML = '';
    return;
  }

  if (activeProject) {
    const activeProjectEl = getElementByDataId(activeProject.id);
    activeProjectEl.classList.remove('active');
  }
  activeProject = project;
  projectTitle.innerHTML = project.name;

  const projectElement = getElementByDataId(project.id);
  projectElement.classList.add('active');
  project.render();
};

const getProjectsFromStorge = () => {
  let idCount = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes('todo-app')) {
      const value = JSON.parse(localStorage.getItem(key));
      const projectName = key.split('todo-app-')[1];
      const project = new Project(projectName, value, idCount++);
      createProject(project);
    }
  }
  if (!projectList.length) createProject();
  else changeActiveProject();
};

const addEventListeners = () => {
  const projectAdderBtn = document.querySelector('.btn-add-project');
  const todoAdderBtn = document.querySelector('.btn-todo-add');
  const burgerBtn = document.querySelector('.burger');
  const removeAllTodoBtn = document.querySelector('.btn-res');
  const removeProjectBtn = document.querySelector('.btn-del');

  projectAdderBtn.addEventListener('click', () => {
    createProject();
    sideBar.classList.contains('open') && sideBar.classList.remove('open');
  });
  todoAdderBtn.addEventListener('click', () => {
    activeProject.addTodo();
  });
  todoInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      activeProject.addTodo();
    }
  });
  burgerBtn.addEventListener('click', () => {
    sideBar.classList.toggle('open');
  });
  todoListContainer.addEventListener('click', () => {
    sideBar.classList.contains('open') && sideBar.classList.remove('open');
  });

  removeAllTodoBtn.addEventListener('click', () => {
    activeProject.removeAllTodo();
  });

  removeProjectBtn.addEventListener('click', () => {
    removeProject();
  });
};

getProjectsFromStorge();
addEventListeners();
