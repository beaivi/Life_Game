const mockInput = jest.fn();

jest.mock("prompt-sync", () => () => mockInput);



import { preset} from "./tasks";
import { type User, type Task } from "./types";



describe("create user test", () => {
    let consoleSpy: jest.SpyInstance;
    
    

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("task length should equal 6", () => {
        const user: User = {
            username: "John",
            password: "qwerty",
            tasks: [],
            score: 0,
            level: 1
        };
        
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        preset(user);
        expect(consoleSpy).toHaveBeenCalledWith("Added " + user.tasks.length + " tasks");
        expect(user.tasks.length).toStrictEqual(6);

    
    });

    it("task length should equal 5", () => {
        const user2: User = {
            username: "Jane",
            password: "qwerty",
            tasks: [],
            score: 0,
            level: 1
        };
        
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("n");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("y");
        mockInput.mockReturnValueOnce("n");
        preset(user2);
        expect(consoleSpy).toHaveBeenCalledWith("Added " + user2.tasks.length + " tasks");
        expect(user2.tasks.length).toStrictEqual(4);

    
    });

    it("should return not able to add preset tasks.", () => {
        const wp: Task = {
            name: "Water Plants",
            freq: "daily",
            special_points: undefined,
            status: false
        };
        
        const user3: User = {
            username: "Jennifer",
            password: "qwerty",
            tasks: [wp],
            score: 0,
            level: 1
        };
        
        mockInput.mockReturnValueOnce("y");
        preset(user3);
        expect(consoleSpy).toHaveBeenCalledWith("You can't choose tasks from the preset"
        + " if you already have tasks");
        expect(user3.tasks.length).toStrictEqual(1);

    
    });

});
