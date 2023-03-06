const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);


import { change_username, change_password, login, create_user } from "./user";
import { type User } from "./types";



const user: User = {
  username: "John Doe",
  password: "qwerty",
  tasks: [],
  score: 0,
  level: 1,
};

const user2: User = {
  username: "John Doe",
  password: "qwerty",
  tasks: [],
  score: 0,
  level: 1
};



describe("change_username test", () => {
    let consoleSpy: jest.SpyInstance;
  
    

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it("should return succesfully changed your username", () => {
        mockInput.mockReturnValueOnce("Jane Doe");
        change_username(user);  //changing name of user to Jane Doe.
    
        expect(consoleSpy).toHaveBeenCalledWith("\nYou have sucessfully changed your username\n");
      });

      it("should return the input", () => {
        change_username(user);
    
        expect(mockInput).toHaveBeenCalledWith("New username: ");
      });

      it("should return unavailable name", () => {
        mockInput.mockReturnValueOnce("John Doe");
        change_username(user2);
        mockInput.mockReturnValueOnce("John Doe");
        change_username(user); 
        //Tries to change the name of 2 users to John Doe.
    
        expect(consoleSpy).toHaveBeenCalledWith("Your username was unavailable, please try another one. ");
      }); 

      it ("Username has changed", () => {
        mockInput.mockReturnValueOnce("Anna");
        change_username(user);
        expect(user.username).toStrictEqual("Anna");

      });
      
});


describe("change_password test", () => {
  let consoleSpy: jest.SpyInstance;
   

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("testing correct user password.", () => {
    mockInput.mockReturnValueOnce(user.password);
    change_password(user);

    expect(mockInput).toHaveBeenCalledWith("New password: ");
  });

  it("testing incorrect user password", () => {
    mockInput.mockReturnValueOnce("hej");

    change_password(user);

    expect(consoleSpy).toHaveBeenCalledWith("Wrong password, try again");
  });
  

  it("testing too short password: ", () => {
    mockInput.mockReturnValueOnce(user.password);
    mockInput.mockReturnValueOnce("hej");

    change_password(user);

    expect(consoleSpy).toHaveBeenCalledWith("\nThe password should be atleast 6 characters long.");
  });

  
  it("should return the input", () => {
      change_password(user);
  
      expect(mockInput).toHaveBeenCalledWith("Old password: ");
    });

    
    it("successfully changed the password. ", () => {
      mockInput.mockReturnValueOnce(user.password);
      mockInput.mockReturnValueOnce("password");
      mockInput.mockReturnValueOnce("password");
      change_password(user);
  
      expect(mockInput).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenCalledWith("\nYou have sucessfully changed your password\n");
      expect(user.password).toStrictEqual("password");
    });
    

    
    it("new password does not match ", () => {
      mockInput.mockReturnValueOnce(user.password);
      mockInput.mockReturnValueOnce("password");
      mockInput.mockReturnValueOnce("hello");
      change_password(user);
  
      expect(consoleSpy).toHaveBeenCalledWith("\nPassword confirmation doesn't match "+ 
      " the password, try again\n");
      expect(user.password).toStrictEqual(user.password);
    });
   
});



describe("login test", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  

  it("should return the input", () => {
    login();
    expect(mockInput).toHaveBeenCalledWith("Username: ");
  });
  
  
  it("should return username not found and return undefined", () => {
    mockInput.mockReturnValueOnce("Orange321");
    const test = login();
    test;
    expect(consoleSpy).toHaveBeenCalledWith("Username not found");
    expect(test).toStrictEqual(undefined);

  });

  it("should successfully login and return the correct user", () => {
    const kajsa: User = {
      username: "Kajsa Kavat",
      password: "qwerty",
      tasks: [],
      score: 0,
      level: 1
    };
    mockInput.mockReturnValueOnce("Kajsa Kavat");
    mockInput.mockReturnValueOnce("qwerty");
    create_user();
    mockInput.mockReturnValueOnce("Kajsa Kavat");
    mockInput.mockReturnValueOnce("qwerty");
    const test = login();
    test;
    expect(consoleSpy).toHaveBeenCalledWith("\nYou have successfully logged in.\n");
    expect(test).toStrictEqual(kajsa);

  });
  
  it("correct username, but incorrect password", () => {
    mockInput.mockReturnValueOnce("Kajsa Kavat");
    mockInput.mockReturnValueOnce("Hello123");
    mockInput.mockReturnValueOnce("qwerty"); 
    
    login();

    expect(mockInput).toHaveBeenCalledWith("Password: ");
    expect(consoleSpy).toHaveBeenCalledWith("\nWrong Password, try again\n If you want to go" +
    " back to the login menu write 'x'");

  });

  

});



