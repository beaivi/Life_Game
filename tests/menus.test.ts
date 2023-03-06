const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);

import {type User,  type Task, input} from "./types";
import {show_tasks_menu, settings_menu, 
    log_in_menu, task_edit_menu, back_to_menu, main_menu } from "./menus";

//import { create_user, login } from "./user";
import * as userModule from "./user";
import * as menuModule from "./menus";
import { complete_tasks } from "../life_game";
import exp = require("constants");
    
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
    
        beforeEach(() => {
          consoleSpy = jest.spyOn(console, "log");
        });
      
        afterEach(() => {
          jest.resetAllMocks();
        });
      
        it("should change username", () => {
            mockInput.mockReturnValueOnce("a");
            
            mockInput.mockReturnValueOnce("qwerty");
            mockInput.mockReturnValueOnce("hejsan1");
            mockInput.mockReturnValueOnce("hejsan1");
            settings_menu(user);
          
            expect(consoleSpy).toBeCalledWith("What do you want to do?" &&   "a) Change password\nb) Change username\nx) Back to main menu " && "\nYou have sucessfully changed your password\n");
            expect(mockInput).toBeCalledWith("Choose a, b or x: ");
    
        });

        it("should change password", () => {
            mockInput.mockReturnValueOnce("a");
            
            mockInput.mockReturnValueOnce("qwerty");
            mockInput.mockReturnValueOnce("hejsan1");
            mockInput.mockReturnValueOnce("hejsan1");
            settings_menu(user);
          
            expect(consoleSpy).toBeCalledWith("What do you want to do?" &&   "a) Change password\nb) Change username\nx) Back to main menu " && "\nYou have sucessfully changed your password\n");
            expect(mockInput).toBeCalledWith("Choose a, b or x: ");
    
        });

        it("should change username", () => {
          mockInput.mockReturnValueOnce("b");
          
          mockInput.mockReturnValueOnce("meow");

          settings_menu(user);
        
          expect(consoleSpy).toBeCalledWith("What do you want to do?" &&   "a) Change password\nb) Change username\nx) Back to main menu " && "\nYou have sucessfully changed your username\n");
          expect(mockInput).toBeCalledWith("Choose a, b or x: ");
  
      });

      it("if wrong input then change username", () => {
        mockInput.mockReturnValueOnce("c");
        mockInput.mockReturnValueOnce("b");

        mockInput.mockReturnValueOnce("voff");

        settings_menu(user);
      
        expect(consoleSpy).toBeCalledWith("What do you want to do?" &&   "a) Change password\nb) Change username\nx) Back to main menu " && "\nYou have sucessfully changed your username\n");
        expect(mockInput).toBeCalledWith("Choose a, b or x: ");

    });

  });

    /*
      it("should go back to main menu", () => {
        mockInput.mockReturnValueOnce("x");
        settings_menu(user);
        expect(consoleSpy).toHaveBeenCalledWith("hej");
    });
    
  
  describe("test beck_to_menu", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should put the usr back in the main menu", () => {
      mockInput.mockReturnValueOnce("b");
      mockInput.mockReturnValueOnce("John Doe");
      mockInput.mockReturnValueOnce("qwerty");
      mockInput.mockReturnValueOnce("e");
      back_to_menu();

    });
  
  });
*/

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
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to show? \n a) All tasks\n" +
    " b) Tasks left to do\n c) Completed tasks\n");
    expect(consoleSpy).toHaveBeenLastCalledWith("   städa");

  });
 

  it("should return the menu with tasks left to do", () => {
    mockInput.mockReturnValueOnce("b");
    show_tasks_menu(user);

    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to show? \n a) All tasks\n" +
    " b) Tasks left to do\n c) Completed tasks\n");
    expect(consoleSpy).toHaveBeenLastCalledWith("   diska");
  });

  it("should return the menu with finished tasks", () => {
    mockInput.mockReturnValueOnce("c");
    show_tasks_menu(user);

    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to show? \n a) All tasks\n" +
    " b) Tasks left to do\n c) Completed tasks\n");
    expect(consoleSpy).toHaveBeenLastCalledWith("   städa");
  });

  it("should return the menu with wrong input then finished tasks", () => {
    mockInput.mockReturnValueOnce("gjfk");
    mockInput.mockReturnValueOnce("c");
    show_tasks_menu(user);

    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to show? \n a) All tasks\n" +
    " b) Tasks left to do\n c) Completed tasks\n");
    expect(consoleSpy).toHaveBeenCalledWith("\nWrong input");
    expect(consoleSpy).toHaveBeenLastCalledWith("   städa");
  });
});



describe("main_menu test", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  /*
  it("test add or edit task", () => {
    mockInput.mockReturnValueOnce("a"); 
    test för task_edit_menu
  });
  

  it("test complete task", () => {
    mockInput.mockReturnValueOnce("b"); 
    main_menu();
  });

  

  it("show points", () => {
    mockInput.mockReturnValueOnce("c"); 
    main_menu();

    expect(mockInput).toHaveBeenCalledWith("Choose a, b, c, d, e or f: ");
    expect(consoleSpy).toHaveBeenCalledWith("");
  });
*/
  
/*
  it("show tasks", () => {
    mockInput.mockReturnValueOnce("d"); 
    mockInput.mockReturnValueOnce("a");
    main_menu();


    expect(mockInput).toHaveBeenCalledWith("Choose a, b or c: ");
    expect(consoleSpy).toHaveBeenCalledWith("What do you want to show? \n a) All tasks\n" +
    " b) Tasks left to do\n c) Completed tasks\n");
    expect(consoleSpy).toHaveBeenLastCalledWith("   städa");


    expect(mockInput).toHaveBeenCalledWith("Choose a, b, c, d, e or f: ");
    expect(consoleSpy).toHaveBeenCalledWith("");
  });

  */
  it("log out", () => {
    mockInput.mockReturnValueOnce("e"); 
    main_menu();


    expect(mockInput).toHaveBeenCalledWith("Choose a, b, c, d, e or f: ");
    expect(consoleSpy).toHaveBeenCalledWith("");
  });

  
  /*it("show tasks", () => {
    mockInput.mockReturnValueOnce("f"); 
    main_menu();

    expect(mockInput).toHaveBeenCalledWith("Choose a, b, c, d, e or f: ");
    expect(consoleSpy).toHaveBeenCalledWith("");
  });
*/


});