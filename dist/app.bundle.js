"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
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
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    var State = (function () {
        function State() {
            this.listeners = [];
        }
        State.prototype.addListener = function (listenerFn) {
            this.listeners.push(listenerFn);
        };
        return State;
    }());
    var ProjectState = (function (_super) {
        __extends(ProjectState, _super);
        function ProjectState() {
            var _this = _super.call(this) || this;
            _this.projects = [];
            _this.listeners = [];
            return _this;
        }
        ProjectState.getInstance = function () {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        };
        ProjectState.prototype.addProject = function (title, desc, people) {
            var newProject = new App.Project(Math.random().toString(), title, desc, people, App.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        };
        ProjectState.prototype.moveProject = function (projectId, newStatus) {
            var project = this.projects.find(function (prj) { return prj.id === projectId; });
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        };
        ProjectState.prototype.updateListeners = function () {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listenerFn = _a[_i];
                listenerFn(this.projects.slice());
            }
        };
        return ProjectState;
    }(State));
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
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
    App.autobind = autobind;
})(App || (App = {}));
var App;
(function (App) {
    var ProjectMain = (function () {
        function ProjectMain(templateId, hostElId, insertAtStart, newElId) {
            this.templateElement = (document.getElementById(templateId));
            this.hostElement = document.getElementById(hostElId);
            var importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElId) {
                this.element.id = newElId;
            }
            this.attach(insertAtStart);
        }
        ProjectMain.prototype.attach = function (insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        };
        return ProjectMain;
    }());
    App.ProjectMain = ProjectMain;
})(App || (App = {}));
var App;
(function (App) {
    var ProjectList = (function (_super) {
        __extends(ProjectList, _super);
        function ProjectList(type) {
            var _this = _super.call(this, "project-list", "app", false, type + "-projects") || this;
            _this.type = type;
            _this.assignedProjects = [];
            _this.configure();
            _this.renderContent();
            return _this;
        }
        ProjectList.prototype.renderContent = function () {
            var listId = this.type + "-projects-list";
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent =
                this.type.toUpperCase() + " PROJECTS";
        };
        ProjectList.prototype.dragOverHandler = function (event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                var listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        };
        ProjectList.prototype.dropHandler = function (event) {
            var prjId = event.dataTransfer.getData("text/plain");
            App.projectState.moveProject(prjId, this.type === "active" ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        };
        ProjectList.prototype.dragLeaveHandler = function (_) {
            var listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        };
        ProjectList.prototype.configure = function () {
            var _this = this;
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            App.projectState.addListener(function (projects) {
                var relevantProjects = projects.filter(function (prj) {
                    if (_this.type === "active") {
                        return prj.status === App.ProjectStatus.Active;
                    }
                    return prj.status === App.ProjectStatus.Finished;
                });
                _this.assignedProjects = relevantProjects;
                _this.renderProjects();
            });
        };
        ProjectList.prototype.renderProjects = function () {
            var listEl = (document.getElementById(this.type + "-projects-list"));
            listEl.innerHTML = "";
            for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
                var prjItem = _a[_i];
                new App.ProjectItem(this.element.querySelector("ul").id, prjItem);
            }
        };
        __decorate([
            App.autobind
        ], ProjectList.prototype, "dragOverHandler", null);
        __decorate([
            App.autobind
        ], ProjectList.prototype, "dropHandler", null);
        __decorate([
            App.autobind
        ], ProjectList.prototype, "dragLeaveHandler", null);
        return ProjectList;
    }(App.ProjectMain));
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    var ProjectInput = (function (_super) {
        __extends(ProjectInput, _super);
        function ProjectInput() {
            var _this = _super.call(this, "project-input", "app", true, "user-input") || this;
            _this.titleInputElement = (_this.element.querySelector("#title"));
            _this.descInputElement = (_this.element.querySelector("#description"));
            _this.peopleInputElement = (_this.element.querySelector("#people"));
            _this.configure();
            return _this;
        }
        ProjectInput.prototype.configure = function () {
            this.element.addEventListener("submit", this.submitHandler);
        };
        ProjectInput.prototype.renderContent = function () { };
        ProjectInput.prototype.submitHandler = function (event) {
            event.preventDefault();
            var userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                var title = userInput[0], desc = userInput[1], people = userInput[2];
                App.projectState.addProject(title, desc, people);
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
            if (App.validate(validatableTitle) &&
                App.validate(validatableDesc) &&
                App.validate(validatablePeople)) {
                return [enteredTitle, enteredDesc, +enteredPeople];
            }
            else {
                alert("Invalid Input!");
                return;
            }
        };
        __decorate([
            App.autobind
        ], ProjectInput.prototype, "submitHandler", null);
        return ProjectInput;
    }(App.ProjectMain));
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    var ProjectItem = (function (_super) {
        __extends(ProjectItem, _super);
        function ProjectItem(hostId, project) {
            var _this = _super.call(this, "single-project", hostId, false, project.id) || this;
            _this.project = project;
            _this.configure();
            _this.renderContent();
            return _this;
        }
        Object.defineProperty(ProjectItem.prototype, "persons", {
            get: function () {
                if (this.project.people === 1) {
                    return "1 person";
                }
                else {
                    return this.project.people + " persons";
                }
            },
            enumerable: false,
            configurable: true
        });
        ProjectItem.prototype.dragStartHandler = function (event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        };
        ProjectItem.prototype.dragEndhandler = function (_) { };
        ProjectItem.prototype.configure = function () {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndhandler);
        };
        ProjectItem.prototype.renderContent = function () {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.persons + " assigned";
            this.element.querySelector("p").textContent = this.project.desc;
        };
        __decorate([
            App.autobind
        ], ProjectItem.prototype, "dragStartHandler", null);
        __decorate([
            App.autobind
        ], ProjectItem.prototype, "dragEndhandler", null);
        return ProjectItem;
    }(App.ProjectMain));
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList("active");
    new App.ProjectList("finished");
})(App || (App = {}));
//# sourceMappingURL=app.bundle.js.map