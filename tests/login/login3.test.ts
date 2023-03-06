const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);
import { create_user } from "./user";
import { log_in_menu } from "./menus";


describe("log in menu test", () => {
    let consoleSpy: jest.SpyInstance;
    let loginSpy: jest.SpyInstance;
    let createUserSpy: jest.SpyInstance;

    const username = "John Doe";
    const password = "qwerty";
    mockInput.mockReturnValueOnce(username);
    mockInput.mockReturnValueOnce(password);
    mockInput.mockReturnValue("n");
    create_user();

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
      loginSpy = jest.spyOn(require("./user"), "login")
      createUserSpy = jest.spyOn(require("./user"), "create_user");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
      
    });
    
    it("wrong input when not entering a or b", () => {
        mockInput.mockReturnValueOnce("hello");
        mockInput.mockReturnValueOnce("b");
        mockInput.mockReturnValueOnce(username);
        mockInput.mockReturnValueOnce(password);
        mockInput.mockReturnValueOnce("x");
        log_in_menu();
        expect(consoleSpy).toHaveBeenCalledWith("\nWrong input, try again. \n");
    });
});
