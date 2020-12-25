namespace App {
  export class ProjectInput extends ProjectMain<
    HTMLDivElement,
    HTMLFormElement
  > {
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");
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
    }

    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }

    renderContent() {}

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
  }
}
