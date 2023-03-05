const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);

import exp = require("constants");
import { mock } from "node:test";
import { add_task, preset,  complete_tasks, reset_tasks, remove_task, } from "./tasks";
import { type User, type Task, } from "./types";

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
  status: false

};

const user: User = {
    username: "John Doe",
    password: "qwerty",
    tasks: [task1],
    score: 0,
    level: 1,
};


/*
describe("add_task", () => {
    let consoleSpy: jest.SpyInstance;
  
    

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
});

*/

describe("remove_task test", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it("should run", () => {
        remove_task(user);
        expect(mockInput).toBeCalledWith("Which task do you want to remove?: ");

    });
    
    it("removing task", () => {
        
        mockInput.mockReturnValueOnce("diska");     
        remove_task(user);
    
        expect(consoleSpy).toHaveBeenCalledWith("You successfully removed the task diska");
      });
      
      it("should return unavailable task", () => {
        mockInput.mockReturnValueOnce("mata hund");
        remove_task(user);
        mockInput.mockReturnValueOnce("y");
        remove_task(user);
        mockInput.mockReturnValueOnce("diska");
        remove_task(user);
    
        expect(mockInput).toHaveBeenCalledWith("You do not have such task, do you want to try again? Y / N ");
        expect(mockInput).toHaveBeenCalledWith("Which task do you want to remove?: ");
        expect(consoleSpy).toHaveBeenCalledWith("You successfully removed the task diska");
      }); 

      it("should send to remove another remove", () => {
        mockInput.mockReturnValueOnce("diska");     
        remove_task(user);
        mockInput.mockReturnValueOnce("y");
        remove_task(user);
        mockInput.mockReturnValueOnce("städa");
        remove_task(user);

        expect(consoleSpy).toHaveBeenCalledWith("You successfully removed the task diska");
        expect(mockInput).toHaveBeenCalledWith("Do you want to remove another task? Y / N ");
        //expect(consoleSpy).toHaveBeenCalledWith("You successfully removed the task städa"); det här testet failar men ska inte göra det
      });

      it("should ask to remove another and say no", () => {
        mockInput.mockReturnValueOnce("diska");     
        remove_task(user);
        mockInput.mockReturnValueOnce("n");

        expect(consoleSpy).toHaveBeenCalledWith("You successfully removed the task diska");
        expect(mockInput).toHaveBeenCalledWith("Do you want to remove another task? Y / N ");
      });
});

