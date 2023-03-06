const mockInput = jest.fn();
jest.mock("prompt-sync", () => () => mockInput);


import {create_user, change_username, change_password, login,} from "./user";
import {type User} from "./types"
import exp = require("constants");


const user: User = {
    username: "John Doe",
    password: "qwerty",
    tasks: [],
    score: 0,
    level: 1,
  };

  const user2: User = {
      username: "Jane Doe",
      password: "qwerty",
      tasks: [],
      score: 0,
      level: 1
  };

    describe("create user test", () => {
    let consoleSpy: jest.SpyInstance;
    
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
    
    it("should return a created user", () => {
      mockInput.mockReturnValueOnce("Felicia");
      mockInput.mockReturnValueOnce("dfhskg");
      create_user();

      expect(mockInput).toHaveBeenCalledWith("Choose a username: " && "Choose a password for your user: ");
      expect(consoleSpy).toHaveBeenCalledWith("Your username was available.\n");
      expect(consoleSpy).toHaveBeenCalledWith("You have successfully chosen a password.");
    });

    it("should return taken username", () => {
      mockInput.mockReturnValueOnce("Felicia");
      mockInput.mockReturnValueOnce("Alicia");
      mockInput.mockReturnValueOnce("jgifhsg");
      create_user();

      expect(mockInput).toHaveBeenCalledWith("Choose a username: " && "Choose a password for your user: ");
      expect(consoleSpy).toHaveBeenCalledWith("Your usernames was unavailable, please try another one. ");
      expect(consoleSpy).toHaveBeenCalledWith("Your username was available.\n");
      expect(consoleSpy).toHaveBeenCalledWith("You have successfully chosen a password.");
    });

    it("should return too short password", () => {
      mockInput.mockReturnValueOnce("Jonna");
      mockInput.mockReturnValueOnce("12");
      mockInput.mockReturnValueOnce("jgifhsg");
      create_user();

      expect(mockInput).toHaveBeenCalledWith("Choose a username: " && "Choose a password for your user: ");
      expect(consoleSpy).toHaveBeenCalledWith("Your username was available.\n");
      expect(consoleSpy).toHaveBeenCalledWith("The password should be atleast 6 characters long. ");
      expect(consoleSpy).toHaveBeenCalledWith("You have successfully chosen a password.");
    });

    it("should return not available username and too short password", () => {
      mockInput.mockReturnValueOnce("Jonna");
      mockInput.mockReturnValueOnce("Jonny");
      mockInput.mockReturnValueOnce("hej");
      mockInput.mockReturnValueOnce("jgifhsg");
      create_user();

      expect(mockInput).toHaveBeenCalledWith("Choose a username: " && "Choose a password for your user: ");
      expect(consoleSpy).toHaveBeenCalledWith("Your usernames was unavailable, please try another one. ");
      expect(consoleSpy).toHaveBeenCalledWith("Your username was available.\n");
      expect(consoleSpy).toHaveBeenCalledWith("The password should be atleast 6 characters long. ");
      expect(consoleSpy).toHaveBeenCalledWith("You have successfully chosen a password.");
    });
});
    

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
        change_username(user);
    
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
  
      expect(consoleSpy).toHaveBeenCalledWith("\nPassword confirmation doesn't match the password, try again\n");
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
    mockInput.mockReturnValueOnce("Kajsa Kavat");
    mockInput.mockReturnValueOnce("qwerty");
    create_user();
    mockInput.mockReturnValueOnce("Kajsa Kavat");
    mockInput.mockReturnValueOnce("qwerty");
    const test = login();
    test;
    expect(consoleSpy).toHaveBeenCalledWith("\nYou have successfully logged in.\n");
    //expect(test).toStrictEqual(user2);

  });
  
  it("correct username, but incorrect password", () => {
    mockInput.mockReturnValueOnce("Kajsa Kavat");
    mockInput.mockReturnValueOnce("Hello123") //Kör först fel lösenord.
    mockInput.mockReturnValueOnce("qwerty"); //Sen för att inte vara fast i oändlig while-loop körs det rätta lösenordet.
    //egentligen borde vi lägga till i login funktionen, ett val att gå tillbaka till register menyn, ifall
    //man glömt sitt lösenord, annars kmr användaren också vara fast i oändlig loop.
    
    login();

    expect(mockInput).toHaveBeenCalledWith("Password: ");
    expect(consoleSpy).toHaveBeenCalledWith("\nWrong Password, try again\n");

  });

});


