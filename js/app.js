const taskInput = document.querySelector('.add-task-area input');
const projectContainer = document.querySelector('.project-list');
const taskList = document.querySelector('.task-list');
const burgerBtn = document.querySelector('.burger');
const sideBar = document.querySelector('.side-bar');
const projectTitle = document.querySelector('.project-title');
const addBtn = document.querySelector('.btn-add');

let projectList = [];
let activeProject;

class Project {
  constructor(name, taskArr) {
    this.name = name.toLowerCase();
    this.taskArr = taskArr;
    this._saveToLocalStorge();
  }

  addTask(task = taskInput.value) {
    if (!task) return;
    this._createTaskItem({ task: task }, length);

    // Clear input's value
    taskInput.value = '';
    this.taskArr.push({ task: task, checked: false });
    this._saveToLocalStorge();
  }

  removeTask(taskIndex) {
    taskList.removeChild(taskList.children[taskIndex]);
    this.taskArr.splice(taskIndex, 1);
    this._saveToLocalStorge();
  }

  removeAllTask() {
    this.taskArr = [];
    this._saveToLocalStorge();
    taskList.innerHTML = '';
  }

  changeCheckboxValue(taskIndex) {
    this.taskArr[taskIndex].checked = !this.taskArr[taskIndex].checked;
    this._saveToLocalStorge();
  }

  drawTaskItem() {
    taskList.innerHTML = '';

    this.taskArr.forEach((object, index) => {
      this._createTaskItem(object, index);
    });
  }

  /* ---PRIVATE FUNCTIONS--- */

  _createTaskItem(object, taskIndex) {
    const element = document.createElement('li');
    element.classList.add('task');
    element.innerHTML = `<input type="checkbox">
                         <label>${object.task}</label>
                         <button class="btn-del-task"><i class="fas fa-plus-circle"></i></button>`;

    const checkbox = element.children[0];
    checkbox.checked = object.checked;
    checkbox.addEventListener('click', () => {
      this.changeCheckboxValue(taskIndex);
    });

    element.lastElementChild.addEventListener('click', event => {
      console.log(event.target);

      this.removeTask(taskIndex);
    });

    taskList.appendChild(element);
  }

  _saveToLocalStorge() {
    localStorage.setItem(`todo-app-${this.name}`, JSON.stringify(this.taskArr));
  }
}

const getProjectsFromStorge = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes('todo-app')) {
      const value = JSON.parse(localStorage.getItem(key));
      const project = new Project(key.split('todo-app-')[1], value);
      appendProjectToSidebar(project);
    }
  }
  if (!projectList.length) createNewProject();
  else changeActiveProject();
};

const appendProjectToSidebar = project => {
  const item = document.createElement('li');
  item.addEventListener('click', () => {
    changeActiveProject(project);
  });
  item.addEventListener('click', () => {
    sideBar.classList.toggle('open');
  });
  sideBar.classList.remove('open');
  projectList.push(project);
  item.innerHTML += project.name;
  projectContainer.appendChild(item);
};

const createNewProject = () => {
  const projectName = prompt('Please write your project name.');
  if (!projectName) return;
  const project = new Project(projectName, []);
  appendProjectToSidebar(project);
  changeActiveProject(project);
};

const changeActiveProject = (project = projectList[0]) => {
  if (!projectList.length) {
    projectTitle.innerHTML = '';
    taskList.innerHTML = '';
    activeProject = null;
    return;
  }

  if (activeProject) {
    let elementIndex = projectList.indexOf(activeProject);
    if (elementIndex > -1)
      projectContainer.children[elementIndex].classList.remove('active');
  }

  let elementIndex = projectList.indexOf(project);
  projectContainer.children[elementIndex].classList.add('active');
  activeProject = project;
  projectTitle.innerHTML = activeProject.name;
  activeProject.drawTaskItem();
};

const removeProject = () => {
  const elementIndex = projectList.indexOf(activeProject);
  localStorage.removeItem(`todo-app-${activeProject.name}`);
  projectContainer.removeChild(projectContainer.children[elementIndex]);
  projectList.splice(elementIndex, 1);
  changeActiveProject();
};

const addEventListeners = () => {
  burgerBtn.addEventListener('click', () => {
    sideBar.classList.toggle('open');
  });

  taskInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      activeProject.addTask();
    }
  });

  addBtn.addEventListener('click', () => {
    activeProject && activeProject.addTask();
  });

  taskList.addEventListener('click', () => {
    sideBar.classList.contains('open') && sideBar.classList.remove('open');
  });
};

getProjectsFromStorge();
addEventListeners();
