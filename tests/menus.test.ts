const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);

import {type User,  type Task, input, user_table} from "./types";
import {show_tasks_menu, settings_menu, main_menu } from "./menus";
import { complete_tasks } from "./tasks";
import { ph_lookup } from "./lib/hashtables";
    
    const task1: Task = {
        name: "diska",
        freq: "daily",
        special_points: undefined, 
        status: false
    
    };
    
    const task2: Task = {
      name: "städa",
      freq: "daily",
      special_points: undefined, 
      status: true
    
    };
    
    const user: User = {
        username: "John Doe",
        password: "qwerty",
        tasks: [task1, task2],
        score: 0,
        level: 1,
    };


describe("test settings_menu", () => {
        let consoleSpy: jest.SpyInstance;
        let changePasswordSpy: jest.SpyInstance;
        let changeUsernameSpy: jest.SpyInstance;
    
        beforeEach(() => {
          consoleSpy = jest.spyOn(console, "log");
          changePasswordSpy = jest.spyOn(require("./user"), "change_password");
          changeUsernameSpy = jest.spyOn(require("./user"), "change_username");
          
        });
      
        afterEach(() => {
          jest.resetAllMocks();
        });
      
        it("should change password", () => {
            mockInput.mockReturnValueOnce("a");
            mockInput.mockReturnValueOnce("qwerty");
            mockInput.mockReturnValueOnce("hejsan1");
            mockInput.mockReturnValueOnce("hejsan1");
            settings_menu(user);
          
            expect(consoleSpy).toBeCalledWith("What do you want to do?" && "a) Change password\nb) Change username\nx) Back to main menu " && "\nYou have sucessfully changed your password\n");
            expect(mockInput).toBeCalledWith("Choose a, b or x: ");
            expect(changePasswordSpy).toHaveBeenCalled();
    
        });

        it("should change username", () => {
            mockInput.mockReturnValueOnce("b");
            mockInput.mockReturnValueOnce("Johnnyboi");
            settings_menu(user);
          
            expect(changeUsernameSpy).toHaveBeenCalled();
            expect(ph_lookup(user_table, "John Doe")).toStrictEqual(undefined);
            expect(ph_lookup(user_table, "Johnnyboi")).toStrictEqual(user);
    
        });

        it("should return the wrong input", () => {
          mockInput.mockReturnValueOnce("orange");
          mockInput.mockReturnValueOnce("x");
          settings_menu(user);
          expect(consoleSpy).toBeCalledWith("\nWrong input\n");
          
  
      });

  });
describe("show_tasks_menu", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  it("should display all tasks", () =>{
    mockInput.mockReturnValueOnce("a");
    show_tasks_menu(user);

    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to do? \n a) Show all tasks\n" +
    " b) Show tasks left to do\n c)" + 
    " Show completed tasks\n x) Back to main menu");
    expect(consoleSpy).toHaveBeenLastCalledWith("   städa");

  });
 

  it("should return the menu with tasks left to do", () => {
    mockInput.mockReturnValueOnce("b");
    show_tasks_menu(user);

    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to do? \n a) Show all tasks\n" +
    " b) Show tasks left to do\n c)" + 
    " Show completed tasks\n x) Back to main menu");
    expect(consoleSpy).toHaveBeenLastCalledWith("   diska");
  });

  it("should return the menu with finished tasks", () => {
    mockInput.mockReturnValueOnce("c");
    show_tasks_menu(user);

    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to do? \n a) Show all tasks\n" +
    " b) Show tasks left to do\n c)" + 
    " Show completed tasks\n x) Back to main menu");
    expect(consoleSpy).toHaveBeenLastCalledWith("   städa");
  });

  it("should return the menu with wrong input then finished tasks", () => {
    mockInput.mockReturnValueOnce("gjfk");
    mockInput.mockReturnValueOnce("c");
    show_tasks_menu(user);

    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to do? \n a) Show all tasks\n" +
    " b) Show tasks left to do\n c)" + 
    " Show completed tasks\n x) Back to main menu");
    expect(consoleSpy).toHaveBeenCalledWith("\nWrong input");
    expect(consoleSpy).toHaveBeenLastCalledWith("   städa");
  });
});
