const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);

import { add_task, preset,  complete_tasks, reset_tasks, remove_task, } from "../tasks";
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

const user: User = {
    username: "John Doe",
    password: "qwerty",
    tasks: [task1, task2],
    score: 0,
    level: 1,
};


describe("add_task", () => {
    let consoleSpy: jest.SpyInstance;
  
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });

    
    it("should fail to add one task", () => {
      mockInput.mockReturnValueOnce("städa");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledWith("Add a task: ");
      expect(consoleSpy).toHaveBeenCalledWith("\nYou already have städa as a task\n");
    });

    it("should add one daily task", () => {
      mockInput.mockReturnValueOnce("mata hund");
      mockInput.mockReturnValueOnce("Daily");
      mockInput.mockReturnValueOnce("n");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledTimes(4);
      expect(consoleSpy).toHaveBeenCalledWith("mata hund added as a daily task\n");
    });

    it("should add one weekly task", () => {
      mockInput.mockReturnValueOnce("mata hamster");
      mockInput.mockReturnValueOnce("weekly");
      mockInput.mockReturnValueOnce("n");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledTimes(4);
      expect(consoleSpy).toHaveBeenCalledWith("mata hamster added as a weekly task\n");
    });

    it("should add one monthly task", () => {
      mockInput.mockReturnValueOnce("mata orm");
      mockInput.mockReturnValueOnce("monthly");
      mockInput.mockReturnValueOnce("n");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledTimes(4);
      expect(consoleSpy).toHaveBeenCalledWith("mata orm added as a monthly task\n");
    });

    it("should add two tasks", () => {
      mockInput.mockReturnValueOnce("laga mat");
      mockInput.mockReturnValueOnce("Daily");
      mockInput.mockReturnValueOnce("n");
      mockInput.mockReturnValueOnce("y");
      mockInput.mockReturnValueOnce("bortsa tänderna");
      mockInput.mockReturnValueOnce("daily");
      mockInput.mockReturnValueOnce("n");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledTimes(7);
      expect(consoleSpy).toHaveBeenCalledWith("laga mat added as a daily task\n");
      expect(consoleSpy).toHaveBeenCalledWith("bortsa tänderna added as a daily task\n");
    });

    it("should add two tasks of different freq", () => {
      mockInput.mockReturnValueOnce("laga frukost");
      mockInput.mockReturnValueOnce("Daily");
      mockInput.mockReturnValueOnce("n");
      mockInput.mockReturnValueOnce("y");
      mockInput.mockReturnValueOnce("handla mat");
      mockInput.mockReturnValueOnce("weekly");
      mockInput.mockReturnValueOnce("n");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledTimes(7);
      expect(consoleSpy).toHaveBeenCalledWith("laga frukost added as a daily task\n");
      expect(consoleSpy).toHaveBeenCalledWith("handla mat added as a weekly task\n");
    });

    it("should add special points", () => {
      mockInput.mockReturnValueOnce("spring");
      mockInput.mockReturnValueOnce("Daily");
      mockInput.mockReturnValueOnce("y");
      mockInput.mockReturnValueOnce("3");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledTimes(5);
      expect(consoleSpy).toHaveBeenCalledWith("spring added as a daily task\n");
    });

    
    it("should add special points but wrong input", () => {
      mockInput.mockReturnValueOnce("springa");
      mockInput.mockReturnValueOnce("Daily");
      mockInput.mockReturnValueOnce("y");
      mockInput.mockReturnValueOnce("y");
      mockInput.mockReturnValueOnce("3");
      mockInput.mockReturnValueOnce("n");
      add_task(user);

      expect(mockInput).toHaveBeenCalledTimes(6);
      expect(consoleSpy).toHaveBeenCalledWith("springa added as a daily task\n");
    });
});
