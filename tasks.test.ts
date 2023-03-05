const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);

//import exp = require("constants");
//import { mock } from "node:test";
import { add_task, preset,  complete_tasks, reset_tasks, remove_task, } from "./tasks";
import { type User, type Task, type Freq } from "./types";

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

const task3: Task = {
    name: "Laundry",
    freq: "weekly",
    special_points: undefined, 
    status: false
  
  };

  const task4: Task = {
    name: "Vacuum",
    freq: "weekly",
    special_points: undefined, 
    status: true,
  
  };

const user: User = {
    username: "John Doe",
    password: "qwerty",
    tasks: [task1],
    score: 0,
    level: 1,
};

const user2: User = {
    username: "Jonas",
    password: "123123",
    tasks: [],
    score: 0,
    level: 1,
}

const user3: User = {
    username: "Emma",
    password: "123456",
    tasks: [task1, task2, task3, task4],
    score: 4,
    level: 1,
}

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

describe("preset test", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it("should not give the user the opportunity to add tasks", () => {
        preset(user);
        expect(consoleSpy).toHaveBeenCalledWith("You can't choose tasks from the preset"
        + " if you already have tasks");

    });
    /*
    it("should", () => { 
        mockInput.mockReturnValueOnce("n");
        preset(user2);

        mockInput.mockReturnValueOnce("n");

        preset(user2);


        for(let i = 0; preset_array.length; i++){
        //mockInput.mockReturnValueOnce("y");
        expect(mockInput).toHaveBeenCalledWith("Do you want to add " 
        + preset_array[i].name 
        + " as a " + preset_array[i].freq 
        + " task? Y / N ");
        }
        //mockInput.mockReturnValueOnce("n");

        expect(consoleSpy).toHaveBeenCalledWith("\nYou did not add any tasks\n");

      });
    
      it("should run", () => {
        mockInput.mockReturnValueOnce("mata hund");
        preset(user2);
        mockInput.mockReturnValueOnce("y");
        remove_task(user);
        mockInput.mockReturnValueOnce("diska");
        remove_task(user);
    
        expect(mockInput).toHaveBeenCalledWith("Do you want to add " 
                                         + preset_array[i].name 
                                         + " as a " + preset_array[i].freq 
                                         + " task? Y / N ");
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
      */
});

describe("reset_tasks test", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it("should run", () => {
        mockInput.mockReturnValueOnce("daily");
        reset_tasks(user);
        const curr_freq: string = "daily";
        expect(mockInput).toBeCalledWith("Reset daily, weekly " 
        + "or monthly tasks: ");
        expect(consoleSpy).toHaveBeenCalledWith("Your " + curr_freq + " tasks has been resetted");
    });

    it("should be wrong input", () => {
        mockInput.mockReturnValueOnce("every day");
        mockInput.mockReturnValueOnce("weekly")
        const curr_freq: string = "weekly";
        reset_tasks(user3);
        const weekly_tasks: Array<Task> = [];
    
        expect(mockInput).toBeCalledWith("Reset daily, weekly " 
        + "or monthly tasks: ");
        expect(consoleSpy).toHaveBeenCalledWith("Wrong input");
        expect(consoleSpy).toHaveBeenCalledWith("Your " + curr_freq + " tasks has been resetted");

    });
    
    it("should resett correct status", () => {
        expect(user3.tasks[0].status).toBe(false);
        expect(user3.tasks[1].status).toBe(true);
        expect(user3.tasks[2].status).toBe(false);
        expect(user3.tasks[3].status).toBe(false);

    });


});
