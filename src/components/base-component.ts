namespace App {
  export abstract class ProjectMain<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
      templateId: string,
      hostElId: string,
      insertAtStart: boolean,
      newElId?: string
    ) {
      this.templateElement = <HTMLTemplateElement>(
        document.getElementById(templateId)!
      );
      this.hostElement = <T>document.getElementById(hostElId)!;

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = <U>importedNode.firstElementChild;
      if (newElId) {
        this.element.id = newElId;
      }

      this.attach(insertAtStart);
    }

    public attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? "afterbegin" : "beforeend",
        this.element
      );
    }

    abstract configure(): void;
    abstract renderContent(): void;
  }
}
