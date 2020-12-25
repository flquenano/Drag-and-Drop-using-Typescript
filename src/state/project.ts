namespace App {
  //State Management
  type Listener<T> = (items: T[]) => void;

  abstract class State<T> {
    protected listeners: Listener<T>[] = [];
    // not required to be implemented
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }

    // adding abstract requires the method
    // to be implemented and cannot have an implementation
    // abstract requiredMethod(): void;
  }

  // Singleton Pattern
  export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    listeners: Listener<Project>[] = [];
    private static instance: ProjectState;

    // making the constructor private
    // needs to make an Instance
    private constructor() {
      super();
    }

    // returns the instance of the class
    // returns all data
    static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new ProjectState();
      return this.instance;
    }

    addProject(title: string, desc: string, people: number) {
      const newProject = new Project(
        Math.random().toString(),
        title,
        desc,
        people,
        ProjectStatus.Active
      );
      this.projects.push(newProject);
      this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((prj) => prj.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }

  export const projectState = ProjectState.getInstance(); // Singleton pattern
}
