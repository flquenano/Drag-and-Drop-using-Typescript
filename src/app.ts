//Project type

enum ProjectStatus {
  Active,
  Finished
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

//State Management
type Listener = (items: Project[]) => void;
class ProjectState {
  private projects: Project[] = [];
  private listeners: Listener[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, desc: string, people: number) {
    // const newProject = {
    //   id: Math.random().toString(),
    //   title: title,
    //   desc: desc,
    //   people: people
    // };
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }
}

//Validation
interface Validatable {
  value?: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateInput: Validatable) {
  let isValid = true;
  if (validateInput.required) {
    isValid = isValid && validateInput.value?.toString().trim().length !== 0;
  }

  if (
    validateInput.minLength != null &&
    typeof validateInput.value === "string"
  ) {
    isValid = isValid && validateInput.value.length > validateInput.minLength;
  }

  if (
    validateInput.maxLength != null &&
    typeof validateInput.value === "string"
  ) {
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

//Autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

class PorjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[] = [];

  constructor(private type: "active" | "finished") {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-list")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = <HTMLElement>importedNode.firstElementChild;
    this.element.id = `${type}-projects`;

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });
    this.attach();
    this.renderContent();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = <HTMLUListElement>(
      document.getElementById(`${this.type}-projects-list`)!
    );
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = <HTMLFormElement>importedNode.firstElementChild;
    this.element.id = "user-input";
    this.titleInputElement = <HTMLInputElement>(
      this.element.querySelector("#title")
    );
    this.descInputElement = <HTMLInputElement>(
      this.element.querySelector("#description")
    );
    this.peopleInputElement = <HTMLInputElement>(
      this.element.querySelector("#people")
    );

    this.configure();
    this.attach();
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDesc = this.descInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const validatableTitle: Validatable = {
      value: enteredTitle,
      required: true
    };

    const validatableDesc: Validatable = {
      value: enteredDesc,
      required: true,
      minLength: 5
    };

    const validatablePeople: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    };

    if (
      validate(validatableTitle) &&
      validate(validatableDesc) &&
      validate(validatablePeople)
    ) {
      return [enteredTitle, enteredDesc, +enteredPeople];
    } else {
      alert("Invalid Input!");
      return;
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectState = ProjectState.getInstance(); // Singleton pattern
const projectInput = new ProjectInput();
const activeList = new PorjectList("active");
const finishedlist = new PorjectList("finished");
