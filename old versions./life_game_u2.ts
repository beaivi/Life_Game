//Se avklarade/icke avklarade uppgifter
//Logout
//Kalender
//Ta bort tasks
//Hindra från att lägga till samma task flera gånger
//Skapa förbestämda tasks att välja ifrån
//login
//Leaderboard?
//Fixa egna levlar
//stjärnmärkning
//Maxgräns på tasks samt tidsintervall för att lägga till tasks

import { ProbingHashtable, ph_empty, probe_linear, ph_lookup, ph_insert, 
         HashFunction 
       } from "../../../../lib/hashtables"

const input = require('prompt-sync')();

//Types
type User = {
             username: string,
             password: string,
             tasks: Array<Task>;
             score: Points,
            };

type Task = {
    name: string,
    freq: "daily" | "weekly" | "monthly",
    status: boolean
};
type Points = number;
type UserTable = ProbingHashtable<string, User>;

//djb2a hash function. Vi kan importera den istället kanske? från: https://www.npmjs.com/package/djb2a?activeTab=readme
function string_to_hash(name: string): number {
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

//Ska inte vara i global env som user_table, ska vara ett steg in egentligen ska fixas när vi laggt på stora while loopen
const user_logged_in = login();

/**
 * Creates a new user with username and password.
 * @returns the new user created
 */
function create_user(): User {
    function add_user(name: string): User {
        return {
            username: name,
            password: "",
            tasks: [],
            score: 0
    
        };
    }
    let created_user: boolean = false;
    let password: string = "";
    let username: string  = "";
    while (created_user === false) {
        username = input("Choose an username: ");
        if (ph_lookup(user_table, username) === undefined) {
            console.log("Your username was available.");
            ph_insert(user_table, username, add_user(username));
            created_user = true;
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
    return user as User; //Hur slippa as?
}

/**
 * Adds a new task to the user logged in.
 */
function add_tasks(): void {
    const username = ph_lookup(user_table, user_logged_in.username);
    function create_task() {
        const task_name: string = input("Add a task: ");
        while (true) {
        let freq: string = input("How often do you want to repeat this task? Daily, weekly or monthly ");
        freq = freq.toLowerCase();
        if (freq !== "daily" && freq !== "weekly" && freq !== "monthly") {
            console.log("Invalid input, write your choice are 'daily', 'weekly' or 'monthly' ");
        } 
        else {
            let new_task: Task = {
                name: task_name,
                freq: freq,
                status: false,
            };
            username?.tasks.push(new_task);
            console.log(task_name + " added");
            break;
        }
        }
    }
    create_task();
}

/**
 * Shows the user's level and points
 */
function get_level(){
    if(user_logged_in.score < 100){
        console.log("\nLevel 1: " + user_logged_in.score + " points")
    } else if(user_logged_in.score < 200){
        console.log("\nLevel 2: " + user_logged_in.score + " points")
    } else if(user_logged_in.score < 300){
        console.log("\nLevel 3: " + user_logged_in.score + " points")
    }
    
}

/**
 * Allows the user to mark a task as completed, adds points 
 * and shows if the user is leveling up.
 */
function complete_tasks(){

    function level_up(){
        if(user_logged_in.score === 100){
            console.log("Your reached level 2")
        } else if(user_logged_in.score === 200){
            console.log("You reached level 2")
        } else if(user_logged_in.score === 200){
            console.log("You reached level 3")
        } else {}
    }

    function add_points(task: Task) {
        if(task.freq === "daily"){
            console.log("1 point earned")
            user_logged_in.score = user_logged_in.score + 1;
            level_up();
        } else if(task.freq === "weekly"){
            console.log("3 points earned")
            user_logged_in.score = user_logged_in.score + 3;
            level_up();
        } else {
            console.log("10 points earned")
            user_logged_in.score = user_logged_in.score + 10;
            level_up();   
        }
    }

    const completed_task = input("Task compleded: ");

    function helper(taskarray: Array<Task>) {
        for (let i = 0; i < taskarray.length; i++) {
            if(completed_task === taskarray[i].name){
                console.log("Well done");
                user_logged_in.tasks[i].status = true;
                add_points(user_logged_in.tasks[i]);
              //  console.log(user.tasks[dwm]);
                return true;
            } else if(i === taskarray.length - 1){
                return false;
            } else {}
        }
    }
    if(!(helper(user_logged_in.tasks))){
        console.log("You have not added that task yet")
    } else {
    }
}
/**
 * Shows all tasks the user has added, 
 * taking into account the frequency of the task.
 */
function show_tasks(){
    if (user_logged_in.tasks.length === 0){
        console.log("You don't have any tasks")
    } else {
        const daily_tasks: Array<Task> = [];
        const weekly_tasks: Array<Task> = [];
        const monthly_tasks: Array<Task> = [];
        for(let i = 0; i < user_logged_in.tasks.length; i++){
            if(user_logged_in.tasks[i].freq === "daily"){
                daily_tasks[daily_tasks.length] = user_logged_in.tasks[i]
            } else if(user_logged_in.tasks[i].freq === "weekly"){
                weekly_tasks.push(user_logged_in.tasks[i]);
            } else if(user_logged_in.tasks[i].freq === "monthly"){
                monthly_tasks.push(user_logged_in.tasks[i]);
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
 * Lets the user decide what they want to do.
 */
function menu(){
    console.log("\nWhat do you want to do?")
    console.log("\n a) Add tasks \n b) Complete tasks \n c) Show your points \n" +
                 " d) Show your tasks \n e) Remove tasks \n")
    const c = input("Choose a, b, c, d or e: ");
    console.log("");
    if(c === "a"){
        add_tasks();
        menu();
    } else if(c === "b"){
        complete_tasks();
        menu();
    } else if(c === "c"){
        get_level();
        menu();
    } else if (c === "d"){
        show_tasks();
        menu();
    } else if(c === "e"){
            //    remove_tasks(user);
        menu();
    } else {
        console.clear();
        console.log("Wrong input");
        menu();
    }
}

/**
 * Login a user based on username and password, creates a new user if player
 * is not registerd already
 * @returns the user currently logged in
 */
function login(): any { //Var fixa så att vi kan returnera User?
    const curr_username: string = input("Username: ")
    let curr_user: User | undefined = undefined;
    for(let i = 0; i < user_table.keys.length; i++){
        if(user_table.keys[i] === curr_username){
            curr_user = ph_lookup(user_table, curr_username);
        }
    }

    if(curr_user !== undefined){
        let pass_input: Boolean = false;
        while(!pass_input){
        const password = input("Password: ");
        if(curr_user.password === password) {
            pass_input = true;
            return curr_user as User;
        } else {
            console.log("Wrong Pasword \n  Try again")
        }
        }
    } else {
        console.log("Username not found")
        const c = input("Sign up? y/n ")
        if(c === "y" || c === "Y"){
            return create_user();
        } else {
            console.log("Try again");
            return login();
        }
    }
}

const driver = menu();
console.log(driver);

/*
//Vad händer med progress när man tar bort tasks? Hur ska level påverkas?
function remove_tasks(user: User){
    function remove_tasks_helper(dwm: number, user: User): void { //Bättre att man får skriva in själv?
        const curr_dwm = daily_weekly_or_monthly[dwm];
        const user_task = user.tasks[dwm]
        if (user_task === undefined || user_task === null){
            console.log("You don't have any " + curr_dwm + " tasks");
            //Want to add?
        } else {
        for(let i = 0; i < user.tasks[dwm].length; i++) {
                while(true){
                    const c = prompt("Remove " + user.tasks[dwm][i].task + "? y/n ")
                    if(c === "y" || c === "Y"){
                        console.log(user.tasks[dwm][i].task + " removed")
                        break
                    } else if(c === "n" || c === "N"){
                        break
                    } else {
                        console.log("Wrong input")

                    }
                }
        }
        }

    }
    console.clear();
    console.log( " a) Remove daily tasks\n b) Remove weekly tasks\n c) Remove monthly tasks")
    const c = prompt("Choose a, b or c: ");
    if(c === "a"){
        remove_tasks_helper(0, user)
    } else if(c === "b"){
        remove_tasks_helper(1, user)
    } else if(c === "b"){
    remove_tasks_helper(1, user)
    } else {
        console.log("\nWrong input")
        remove_tasks(user);
    }
}

*/
