const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);
import { main_menu } from "./menus";
import { Task, User } from "./types";



describe("main menu", () => {
    let consoleSpy: jest.SpyInstance;
    let completeTaskSpy: jest.SpyInstance;
    
    const dishes: Task = {
        name: "Do dishes",
        freq: "daily",
        special_points: undefined,
        status: false        
    };

    const user: User = {
        username: "John Doe",
        password: "qwerty",
        tasks: [dishes],
        score: 0,
        level: 1
    };

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
      completeTaskSpy = jest.spyOn(require("./tasks"), "complete_tasks");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
      
    });
    
    it("Shows the user's score and level when choosing c.", () => {
        mockInput.mockReturnValueOnce("a");
        mockInput.mockReturnValueOnce("John Doe");
        mockInput.mockReturnValueOnce("qwerty");
        mockInput.mockReturnValueOnce("n");
        mockInput.mockReturnValueOnce("c");
        mockInput.mockReturnValueOnce("x");
        main_menu();
        
        expect(consoleSpy).toHaveBeenCalledWith("Your level is ", 1, + 
        "\nand your score is:", 0);

    });
    

    it("Complete task when choosing b ", () => {
        user.tasks.push(dishes); // manually adds dishes to the user.
        mockInput.mockReturnValueOnce("b");
        mockInput.mockReturnValueOnce("Do dishes");
        mockInput.mockReturnValueOnce("x");
        main_menu();
        
        expect(mockInput).toHaveBeenCalledWith("Task completed: ");
        expect(completeTaskSpy).toHaveBeenCalled();

    });
    it("Show tasks when choosing d ", () => {
        mockInput.mockReturnValueOnce("d");
        mockInput.mockReturnValueOnce("x");
        main_menu();
    
        expect(consoleSpy).toHaveBeenCalledWith("You don't have any tasks");
    });
    

    it("settings menu when choosing f ", () => {
        mockInput.mockReturnValueOnce("f");
        mockInput.mockReturnValueOnce("x");
        mockInput.mockReturnValueOnce("x");
        main_menu();
    
        expect(consoleSpy).toHaveBeenCalledWith("\n a) Change password \n b) Change username\n" + 
        " x) Back to main menu ");
    });



});
