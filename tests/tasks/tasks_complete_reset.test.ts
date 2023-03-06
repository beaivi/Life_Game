const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);

import { preset,  complete_tasks, reset_tasks, remove_task, } from "../tasks";
import { type User, type Task, type Freq } from "../types";

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
    status: false,
  
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
    score: 99,
    level: 1,
}

describe("complete_tasks test", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
    
    it("should call both add_points and level_up", () => {
        mockInput.mockReturnValueOnce("Vacuum");
        complete_tasks(user3);
        expect(mockInput).toBeCalledWith("Task completed: ");
        expect(consoleSpy).toHaveBeenCalledWith("3 points earned");
        expect(consoleSpy).toHaveBeenCalledWith("\nWell done");
        expect(consoleSpy).toHaveBeenCalledWith("You have reached level ", user3.level);


    });

    it("should update the status of the task", () => {
        expect(user3.tasks[0].status).toBe(false);
        expect(user3.tasks[1].status).toBe(false);
        expect(user3.tasks[2].status).toBe(false);
        expect(user3.tasks[3].status).toBe(true);
    });

    it("should not be possible to complete an already completed task", () => {
        mockInput.mockReturnValueOnce("Vacuum");
        complete_tasks(user3);
        const status: string = "next week";
        expect(mockInput).toBeCalledWith("Task completed: ");
        expect(consoleSpy).toHaveBeenCalledWith("You have already completed that task, "
        + "wait until " + status 
        + " to complete that task again");

    });

    it("should not be possible to complete unexisting tasks", () => {
        mockInput.mockReturnValueOnce("Go to bed");
        complete_tasks(user3);
        expect(consoleSpy).toHaveBeenCalledWith("\nYou have not added that task");
    });

});

describe("reset_tasks test", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it("should reset even if it is no task with completed status in frequency", () => {
        mockInput.mockReturnValueOnce("daily");
        reset_tasks(user3);
        const curr_freq: string = "daily";
        expect(mockInput).toBeCalledWith("Reset daily, weekly " 
        + "or monthly tasks: ");
        expect(consoleSpy).toHaveBeenCalledWith("Your " + curr_freq + " tasks has been resetted");
        expect(user3.tasks[0].status).toBe(false);
        expect(user3.tasks[1].status).toBe(false);
        expect(user3.tasks[2].status).toBe(false);
        expect(user3.tasks[3].status).toBe(true);
    });

    it("should reset even if it is no tasks in inputed frequency", () => {
        mockInput.mockReturnValueOnce("monthly");
        reset_tasks(user3);
        const curr_freq: string = "monthly";
        expect(mockInput).toBeCalledWith("Reset daily, weekly " 
        + "or monthly tasks: ");
        expect(consoleSpy).toHaveBeenCalledWith("Your " + curr_freq + " tasks has been resetted");
    });


    it("should reset a choiced frequency", () => {
        mockInput.mockReturnValueOnce("weekly");
        reset_tasks(user3);
        const curr_freq: string = "weekly";
        expect(mockInput).toBeCalledWith("Reset daily, weekly " 
        + "or monthly tasks: ");
        expect(consoleSpy).toHaveBeenCalledWith("Your " + curr_freq + " tasks has been resetted");
       
    });

    it("should reset the correct statuses", () => {
        expect(user3.tasks[0].status).toBe(false); //kolla
        expect(user3.tasks[1].status).toBe(false);
        expect(user3.tasks[2].status).toBe(false);
        expect(user3.tasks[3].status).toBe(false);
    
    });

    it("should reset even if user has no tasks", () => {
        mockInput.mockReturnValueOnce("weekly");
        reset_tasks(user2);
        const curr_freq: string = "weekly";
        expect(mockInput).toBeCalledWith("Reset daily, weekly " 
        + "or monthly tasks: ");
        expect(consoleSpy).toHaveBeenCalledWith("Your " + curr_freq + " tasks has been resetted");
       
    });

    it("should detect wrong input", () => {
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

});
