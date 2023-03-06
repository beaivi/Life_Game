import { type User, input, user_table } from "./types";
import { ph_lookup, ph_insert, ph_delete } from "./lib/hashtables";
import {back_to_menu} from "./menus";

/**
 * Creates a new user with username and password inputs.
 * @returns the new user created
 */
export function create_user(): User {
    function add_user(name: string): User {
        return {
            username: name,
            password: "",
            tasks: [],
            score: 0,
            level: 1

        };
    }
    let created_user: User | undefined = undefined;
    let password: string = "";
    let username: string  = "";

    while (created_user === undefined) {
        username = input("Choose an username: ");
        if (ph_lookup(user_table, username) === undefined) {
            console.log("Your username was available.\n");
            ph_insert(user_table, username, add_user(username));
            created_user = ph_lookup(user_table, username);
        }
        else {
            console.log("Your usernames was unavailable, please" + 
                        " try another one. ");
        }
    }
    const user: User | undefined = ph_lookup(user_table, username)

    while (password?.length < 6) {
        password = input("Choose a password for your user: ");
        if (password?.length < 6) {
            console.log("The password should be atleast 6 characters long. ")
        }
        else {
            console.log("You have successfully chosen a password.")
            if (user !== undefined) {
                user.password = password;
            } else {
                create_user();
            }
        }
    }
    return created_user;
}

/**
 * Lets the user change their username.
 * @param user the user that gets its username changed
 */
export function change_username(user: User): void {
    let username_available: boolean = false;
    while(!username_available) {
        let new_username: string = input("New username: ")
        if (ph_lookup(user_table, new_username) === undefined) {
            ph_delete(user_table, user.username);
            user.username = new_username;
            ph_insert(user_table, user.username, user);
            console.log("\nYou have sucessfully changed your username\n");
            username_available = true;
        } else {
            console.log("Your username was unavailable, please" + 
            " try another one. ");
            
        }
    
    }
}

/**
 * Lets the user change their password
 * @param user that gets its password changed
 */
export function change_password(user: User): void {
    let old_password_ok: boolean = false;
    while(!old_password_ok){
        const old_password: string = input("Old password: ")

        if(old_password === user.password){
            let password_match: boolean = false;
            while(!password_match){
                let new_password: string = input("New password: ")
                while(new_password?.length < 6) {
                if(new_password?.length < 6) {
                    console.log("\nThe password should be atleast 6" + 
                    " characters long.");
                    new_password = input("New password: ");
                }
                }
                const confirmed_password: string = input("Confirm your new" + 
                " password: ");
                if(new_password === confirmed_password){
                    user.password = new_password;
                    console.log("\nYou have sucessfully changed your" + 
                    " password\n");
                    password_match = true;
                } else {
                    console.log("\nPassword confirmation doesn't match "+ 
                    " the password, try again\n")
                }
            }
            old_password_ok = true;
        } else {
            console.log("Wrong password, try again");
        }
    }
}

/**
 * Login a user based on username and password, creates a new user if user
 * is not registerd already
 * @returns the user currently logged in, or @undefined if 
 * the user is not registered.
 */
export function login(): User | undefined { 
    const curr_username: string = input("Username: ");
    const curr_user = ph_lookup(user_table, curr_username);
    if(curr_user !== undefined) {
        let pass_input: boolean = false;
        while(!pass_input) {
            const password: string = input("Password: ");
            if(curr_user?.password === password) {
                pass_input = true;
                console.log("\nYou have successfully logged in.\n");
                return curr_user;
            } else if (password === "x") {
                back_to_menu();
            } else {
                console.log("\nWrong Password, try again\n If you want to go" +
                " back to the login menu write 'x'");
            }
        }
    } else {
        console.log("Username not found");
        return undefined;
    }
}
