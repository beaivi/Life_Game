const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);
import { log_in_menu, back_to_menu, main_menu } from "../menus";


describe("log in menu test", () => {
    let consoleSpy: jest.SpyInstance;
    let loginSpy: jest.SpyInstance;
    let createUserSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
      loginSpy = jest.spyOn(require("../user"), "login")
      createUserSpy = jest.spyOn(require("../user"), "create_user");
      const mockActiveUser = jest.fn();
      jest.resetModules();
    });
  
    afterEach(() => {
      jest.resetAllMocks();
      
    });
    
    it("create_user to be called when choosing a", () => {
        mockInput.mockReturnValueOnce("a");
        mockInput.mockReturnValueOnce("Alicia");
        mockInput.mockReturnValueOnce("qwerty");
        mockInput.mockReturnValue("n");
        log_in_menu();
        expect(createUserSpy).toHaveBeenCalledTimes(1);
        expect(loginSpy).toHaveBeenCalledTimes(0);

    });
});