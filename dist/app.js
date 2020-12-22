"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
var Project = (function () {
    function Project(id, title, desc, people, status) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var ProjectState = (function () {
    function ProjectState() {
        this.projects = [];
        this.listeners = [];
    }
    ProjectState.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    };
    ProjectState.prototype.addProject = function (title, desc, people) {
        var newProject = new Project(Math.random().toString(), title, desc, people, ProjectStatus.Active);
        this.projects.push(newProject);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFn = _a[_i];
            listenerFn(this.projects.slice());
        }
    };
    ProjectState.prototype.addListener = function (listenerFn) {
        this.listeners.push(listenerFn);
    };
    return ProjectState;
}());
function validate(validateInput) {
    var _a;
    var isValid = true;
    if (validateInput.required) {
        isValid = isValid && ((_a = validateInput.value) === null || _a === void 0 ? void 0 : _a.toString().trim().length) !== 0;
    }
    if (validateInput.minLength != null &&
        typeof validateInput.value === "string") {
        isValid = isValid && validateInput.value.length > validateInput.minLength;
    }
    if (validateInput.maxLength != null &&
        typeof validateInput.value === "string") {
        isValid = isValid && validateInput.value.length < validateInput.maxLength;
    }
    if (validateInput.min != null && typeof validateInput.value === "number") {
        isValid = isValid && validateInput.value > validateInput.min;
    }
    if (validateInput.max != null && typeof validateInput.value === "number") {
        isValid = isValid && validateInput.value < validateInput.max;
    }
    return isValid;
}
function autobind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
var PorjectList = (function () {
    function PorjectList(type) {
        var _this = this;
        this.type = type;
        this.assignedProjects = [];
        this.templateElement = (document.getElementById("project-list"));
        this.hostElement = document.getElementById("app");
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = type + "-projects";
        projectState.addListener(function (projects) {
            _this.assignedProjects = projects;
            _this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    PorjectList.prototype.attach = function () {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    };
    PorjectList.prototype.renderContent = function () {
        var listId = this.type + "-projects-list";
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    };
    PorjectList.prototype.renderProjects = function () {
        var listEl = (document.getElementById(this.type + "-projects-list"));
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var prjItem = _a[_i];
            var listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    };
    return PorjectList;
}());
var ProjectInput = (function () {
    function ProjectInput() {
        this.templateElement = (document.getElementById("project-input"));
        this.hostElement = document.getElementById("app");
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputElement = (this.element.querySelector("#title"));
        this.descInputElement = (this.element.querySelector("#description"));
        this.peopleInputElement = (this.element.querySelector("#people"));
        this.configure();
        this.attach();
    }
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], desc = userInput[1], people = userInput[2];
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    };
    ProjectInput.prototype.clearInputs = function () {
        this.titleInputElement.value = "";
        this.descInputElement.value = "";
        this.peopleInputElement.value = "";
    };
    ProjectInput.prototype.gatherUserInput = function () {
        var enteredTitle = this.titleInputElement.value;
        var enteredDesc = this.descInputElement.value;
        var enteredPeople = this.peopleInputElement.value;
        var validatableTitle = {
            value: enteredTitle,
            required: true
        };
        var validatableDesc = {
            value: enteredDesc,
            required: true,
            minLength: 5
        };
        var validatablePeople = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        if (validate(validatableTitle) &&
            validate(validatableDesc) &&
            validate(validatablePeople)) {
            return [enteredTitle, enteredDesc, +enteredPeople];
        }
        else {
            alert("Invalid Input!");
            return;
        }
    };
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener("submit", this.submitHandler);
    };
    ProjectInput.prototype.attach = function () {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    };
    __decorate([
        autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}());
var projectState = ProjectState.getInstance();
var projectInput = new ProjectInput();
var activeList = new PorjectList("active");
var finishedlist = new PorjectList("finished");
//# sourceMappingURL=app.js.map