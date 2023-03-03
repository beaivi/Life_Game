import { ProbingHashtable, ph_empty, probe_linear, ph_lookup, ph_insert, 
    HashFunction 
  } from "./hashtables";

  //Types
export type User = {
    username: string,
    password: string,
    tasks: Array<Task>;
    score: Points,
    level: number
   };

export type Task = {
name: string,
freq: "daily" | "weekly" | "monthly",
status: boolean
};
type Points = number;
type UserTable = ProbingHashtable<string, User>;


export function string_to_hash(name: string): number {
    let hash = 0;
    if (name.length < 1) {
        return hash;
    }
    else {
        for (let i = 0; i < name.length; i++) {
            let char = name.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
    }
    return hash;
}

const my_hash: HashFunction<string> = string_to_hash;
const table_length = 20;
const user_table: UserTable = ph_empty(table_length, probe_linear(my_hash));
export const input = require('prompt-sync')();


/**
 * Creates a new user with username and password.
 * @param User.
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
            console.log("Your username was available.");
            ph_insert(user_table, username, add_user(username));
            created_user = ph_lookup(user_table, username);
        }
        else {
            console.log("Your usernames was unavailable, please try another one. ");
        }
    }
    const user: User | undefined = ph_lookup(user_table, username)

    while (password.length < 6) {
        password = input("Choose a password for your user ");
        if (password.length < 6) {
            console.log("The password should be atleast 6 characters long. ")
        }
        else {
            console.log("You have sucessfully chosen a password.")
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
 * Adds a new task to the user logged in.
 * @param User.
 * */
export function add_tasks(user: User): void {
    function create_task() {
        const task_name: string = input("Add a task: ");
        while (true) {
        let freq: string = input("How often do you want to repeat this task? Daily, weekly or monthly");
        freq = freq.toLowerCase();
        if (freq !== "daily" && freq !== "weekly" && freq !== "monthly") {
            console.log("Invalid input, write your choice as 'daily', 'weekly' or 'monthly' ");
        } 
        else { 
            let new_task: Task = {
                name: task_name,
                freq: freq,
                status: false,
            };
            user.tasks.push(new_task);
            console.log(task_name + " added");
            break;
        }
        }
    }

    while(true) {
        create_task();
        let repeat = input("Do you want to input another task? Y / N ")
        repeat = repeat.toLowerCase();
        if (repeat === "y") {
            create_task();
        } else {
            break;
        }
    }
}

    /* Jag la till level i record istället, tror det blir lättare att hålla reda på levels då.
    function get_level(user: User){
        if(user.score < 100){
            console.log("\nLevel 1: " + user.score + " points")
        } else if(user.score < 200){
            console.log("\nLevel 2: " + user.score + " points")
        } else if(user.score < 300){
            console.log("\nLevel 3: " + user.score + " points")
        }
    }
    */


/**
    * Allows the user to mark a task as completed, adds points 
    * and shows if the user is leveling up.
    * @param User.
**/
export function complete_tasks(user: User){
    //Ändrade den här så den fungerade med nya levels variabeln. Nu får man inte ett oändligt score,
    //eftersom vi drar bort 100 från scoret varje gång man levlar upp, vill vi inte det kan vi ändra
    //det till modulo 100.
    function level_up(){
        if (user.score > 100) {
            user.level += 1;
            user.score -= 100;
             console.log("You have reached level ", user.level);
        }   
    }
    function add_points(user: User, task: Task) {
        if(task.freq === "daily"){
            console.log("1 point earned")
            user.score = user.score + 1;
            level_up();
        } else if(task.freq === "weekly"){
            console.log("3 points earned")
            user.score = user.score + 3;
            level_up();
        } else {
            console.log("10 points earned")
            user.score = user.score + 10;
            level_up();   
        }
    }

    const completed_task = input("Task completed: ");

    function helper(taskarray: Array<Task>) {
        for (let i = 0; i < taskarray.length; i++) {
            if(completed_task === taskarray[i].name){
                console.log("Well done");
                user.tasks[i].status = true;
                add_points(user, user.tasks[i]);
              //  console.log(user.tasks[dwm]);
                return true;
            } else if(i === taskarray.length - 1){
                return false;
            } else {

            }
        }
    }
    if(!(helper(user.tasks))){
        console.log("You have not added that task yet")
    } else {}

}

/**
 * Shows all tasks the user has added, 
 * taking into account the frequency of the task.
 * @param User.
 */

export function show_tasks(user: User){
    if (user.tasks.length === 0){
        console.log("You don't have any tasks")
    } else {
        const daily_tasks: Array<Task> = [];
        const weekly_tasks: Array<Task> = [];
        const monthly_tasks: Array<Task> = [];

        for(let i = 0; i < user.tasks.length; i++){
            if(user.tasks[i].freq === "daily"){
                daily_tasks[daily_tasks.length] = user.tasks[i]
            } else if(user.tasks[i].freq === "weekly"){
                weekly_tasks.push(user.tasks[i]);
            } else if(user.tasks[i].freq === "monthly"){
                monthly_tasks.push(user.tasks[i]);
            } else {}
        }
        console.log("\nDaily tasks:")
        for(let i = 0; i < daily_tasks.length; i++){
            console.log(daily_tasks[i].name);
        }
        console.log("\nWeekly tasks: ")
        for(let i = 0; i < weekly_tasks.length; i++){
            console.log(weekly_tasks[i].name);
        }
        console.log("\nMonthly tasks: ")
        for(let i = 0; i < monthly_tasks.length; i++){
            console.log(monthly_tasks[i].name);
        }
    }
}

/**
 * Login a user based on username and password, creates a new user if player
 * is not registerd already
 * @returns the user currently logged in, or @undefined if the user is not registered.
 */

export function login(): User | undefined { 
    const curr_username: string = input("Username: ")
    const curr_user = ph_lookup(user_table, curr_username);
    if(curr_user !== undefined){
        let pass_input: Boolean = false;
        while(!pass_input){
        const password = input("Password: ");
        if(curr_user.password === password) {
            pass_input = true;
            return curr_user;
        } else {
            console.log("Wrong Pasword \n  Try again")
        }
        }
    } else {
        console.log("Username not found");
        return undefined;
    }
}

// Den funkar inte riktigt än.
export function remove_task(user: User) {
    const curr_task = input("Which task do you want to remove?: ")
    const task_look_up = user.tasks.find(x => x.name == curr_task);
    if (task_look_up === undefined) {
        let retry = input("You do not have such task, do you want to try again? Y / N")
        retry = retry.toLowerCase();
        if (retry === "y") {
            remove_task(user);
        } else {}
    } else {
        const index = user.tasks.indexOf(task_look_up);
        console.log(index, "index");
        user.tasks = user.tasks.slice(index, 1);
        } 
}

let active_user: User | undefined = undefined;

export function log_in_menu() {
    while (active_user === undefined) {
        console.log("Do you want to: \n A. register \n B. log in?")
        let choice = input("Choose A or B. ")
        choice = choice.toLowerCase();
        if (choice === "a") {
            active_user = create_user();
            console.log("You have successfully created a new user.")
        } else if (choice === "b") {
            active_user = login();
            console.log("You have successfully logged in.")
        }
        else {
            console.log("Wrong input, try again. ")
        }
    }
}

/**Den här funkar, men det finns mkt som kan förbättras, bland annat
 * så printas menyn ut direkt igen, alltså måste man scrolla upp för att se outputen från det man gjorde
 * 
 * 
**/
while (true) {
    if (active_user === undefined) {
        log_in_menu();
    }
    if (active_user !== undefined) {
        console.log("\nWhat do you want to do?")
        console.log("\n a) Add tasks \n b) Complete tasks \n c) Show your points \n" +
                 " d) Show your tasks \n e) Remove tasks \n f) Log out \n")
        const choice = input("Choose a, b, c, d, e or f: ");
        console.log("");
        if(choice === "a"){
            add_tasks(active_user);
        } else if(choice === "b"){
            complete_tasks(active_user);
        } else if(choice === "c"){
            const level = x => x.level;
            const score = x => x.score;
            console.log("Your level is ", level(active_user), "\n and your score is:", score(active_user));
        } else if (choice === "d"){
            show_tasks(active_user);
        } else if(choice === "e"){
            remove_task(active_user);
        } else if (choice === "f"){
            active_user = undefined;

        } else {
            console.clear();
            console.log("Wrong input");
        }
    } 
}
