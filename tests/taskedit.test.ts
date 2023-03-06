const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);
import { task_edit_menu, back_to_menu, main_menu } from "./menus";
import { Task, User } from "./types";

const user: User = {
    username: "John Doe",
    password: "qwerty",
    tasks: [],
    score: 0,
    level: 1
};

describe("log in menu test", () => {
    let consoleSpy: jest.SpyInstance;
    let addTaskSpy: jest.SpyInstance;
    let removeTaskSpy: jest.SpyInstance;
    let resetTaskSpy: jest.SpyInstance;
    
    const dishes: Task = {
        name: "Do dishes",
        freq: "daily",
        special_points: undefined,
        status: false
    };

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
      addTaskSpy = jest.spyOn(require("./tasks"), "add_task");
      removeTaskSpy = jest.spyOn(require("./tasks"), "remove_task");
      resetTaskSpy = jest.spyOn(require("./tasks"), "reset_tasks");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
      
    });
    
    it("add_task to be called when choosing a, and a task being added to the user", () => {
        mockInput.mockReturnValueOnce("a");
        mockInput.mockReturnValueOnce("Do dishes");
        mockInput.mockReturnValueOnce("Daily");
        mockInput.mockReturnValue("n");

        task_edit_menu(user);
        expect(addTaskSpy).toHaveBeenCalled;
        expect(user.tasks).toContainEqual(dishes);

    });

    it("reset a task when inputtin c.", () => {
        user.tasks[0].status = true;
        expect(user.tasks[0].status).toStrictEqual(true);  
        mockInput.mockReturnValueOnce("c");
        mockInput.mockReturnValueOnce("Daily");
        task_edit_menu(user);
        expect(resetTaskSpy).toHaveBeenCalled;
        expect(user.tasks[0].status).toStrictEqual(false);        
    });

    it("remove to be called when choosing a, and that the task has been removed", () => {
        expect(user.tasks).toContainEqual(dishes);
        mockInput.mockReturnValueOnce("b");
        mockInput.mockReturnValueOnce("Do dishes");
        mockInput.mockReturnValueOnce("n");
        task_edit_menu(user);
        expect(removeTaskSpy).toHaveBeenCalled;
        expect(user.tasks).not.toContainEqual(dishes);      
    });
});
