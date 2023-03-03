import { ProbingHashtable, ph_empty, probe_linear, ph_lookup, ph_insert, 
    HashFunction, 
    ch_insert
  } from "../../../../lib/hashtables";

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
            console.log("Your username was available.\n");
            ph_insert(user_table, username, add_user(username));
            created_user = ph_lookup(user_table, username);
        }
        else {
            console.log("Your usernames was unavailable, please try another one. ");
        }
    }
    const user: User | undefined = ph_lookup(user_table, username)

    while (password.length < 6) {
        password = input("Choose a password for your user: ");
        if (password.length < 6) {
            console.log("The password should be atleast 6 characters long. ")
        }
        else {
            console.log("\nYou have sucessfully chosen a password.")
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
        let task_exists: boolean = false;
        for(let i = 0; i < user.tasks.length; i++){
            if(task_name === user.tasks[i].name){
                task_exists = true;
                console.log("\nYou already have " + task_name + " as a task\n");
                break;
            }
        }
        while (!task_exists) {
        let freq: string = input("How often do you want to repeat this task? Daily, weekly or monthly: ");
        freq = freq.toLowerCase();
        if (freq !== "daily" && freq !== "weekly" && freq !== "monthly") {
            console.log("\nInvalid input, write your choice as 'daily', 'weekly' or 'monthly'. ");
        } 
        else { 
            let new_task: Task = {
                name: task_name,
                freq: freq,
                status: false,
            };
            user.tasks.push(new_task);
            console.log("\n" + task_name + " added as a " + freq + " task\n");
            task_exists = true;
        }
        }
    }
    create_task();
    while(true) {
        let repeat: string = input("Do you want to input another task? Y / N ")
        repeat = repeat.toLowerCase();
        if (repeat === "y") {
            console.log("");
            create_task();
        } else {
            break;
        }
    }
}

function preset(user: User): void { //Ska bara gå att kalla på om man har en helt tom tasks array. Annars kan det bli dubbletter
    //Tänker att den kan komma upp som ett första val direkt när man skapat nytt konto och eventuellt om man tar bort ALLA sina tasks med remove.
    function add_presets(){
        function add_tasks_to_array(task_name: string, task_freq){
            choices.push({name: task_name, freq: task_freq, status: false,});
        }
        const choices: Array<Task> = []
        add_tasks_to_array("Cook", "daily"); //Någon annan får gärna lägga in rimilga tasks ca 3-4 per freq kanske är rimligt.
        add_tasks_to_array("Make bed", "daily");
        add_tasks_to_array("Dishes", "daily");
        add_tasks_to_array("Water plants", "weekly");
        add_tasks_to_array("Vakum", "Weekly");
        add_tasks_to_array("Laundry", "Monthly");
        
        for(let i = 0; i < choices.length; i++){
            console.log("");
            let choice = input("Do you want to add " + choices[i].name +
                            " as a " + choices[i].freq + " task? Y / N ");
            choice = choice.toLowerCase();
            if(choice === "y"){
                user.tasks.push(choices[i]);
            } else {}
        }
    }
    if(user.tasks.length === 0){
        let choice = input("\nDo you want to choose some tasks from a preset? Y / N ")
        choice = choice.toLowerCase();
        if(choice === "y"){
            return add_presets();
        } else {}
    } else {
        console.log("You can't choose tasks from the preset if you already have tasks");
    }
}

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

    const completed_task: string = input("Task completed: ");

    function helper(taskarray: Array<Task>) {
        for (let i = 0; i < taskarray.length; i++) {
            if(completed_task === taskarray[i].name){
                if(!taskarray[i].status){
                    console.log("\nWell done");
                    user.tasks[i].status = true;
                    add_points(user, user.tasks[i]);
                return true;
                } else {
                    let status: string = "";
                    if(taskarray[i].freq === "daily"){
                        status = "tomorrow";
                    } else if(taskarray[i].freq === "weekly"){
                        status = "next week";
                    } else if(taskarray[i].freq === "monthly"){
                        status = "next month";
                    }
                    console.log("You have already completed that task, wait until " +
                                status + " to complete that task again" );
                    return true;
                }
            } else if(i === taskarray.length - 1){
                return false;
            } else {

            }
        }
    }
    if(!(helper(user.tasks))){
        console.log("\nYou have not added that task")
    } else {}

}

/**
 * Shows all tasks the user has added, 
 * taking into account the frequency of the task.
 * @param User.
 */

export function show_tasks(user: User) {
    function show_tasks_with_freq(taskarray: Array<Task>) {
        function show_freq(taskarray: Array<Task>, freq: string) {
            if(taskarray.length !== 0) {
                console.log("\n" + freq)
                for(let i = 0; i < taskarray.length; i++){
                    console.log("   " + taskarray[i].name);
                }
            }
        }
        const daily_tasks: Array<Task> = [];
        const weekly_tasks: Array<Task> = [];
        const monthly_tasks: Array<Task> = [];
        for(let i = 0; i < taskarray.length; i++){
            if(taskarray[i].freq === "daily"){
                daily_tasks.push(taskarray[i]);
            } else if(taskarray[i].freq === "weekly"){
                weekly_tasks.push(taskarray[i]);
            } else if(taskarray[i].freq === "monthly"){
                monthly_tasks.push(taskarray[i]);
            } else {}
        }
        show_freq(daily_tasks, "  Daily tasks: ");
        show_freq(weekly_tasks, "  Weekly tasks: ");
        show_freq(monthly_tasks, "  Monthly tasks: ");
    }
    function show_tasks_status(user: User, completed: boolean) {
        let tasks_with_curr_status: Array<Task> = [];
        for(let i = 0; i < user.tasks.length; i++){
            if(user.tasks[i].status === completed){
                tasks_with_curr_status.push(user.tasks[i]);
            }
        }
        if(tasks_with_curr_status.length === 0){
            if(completed){
                console.log("\nYou have not completed any tasks yet.")
            } else {
                console.log("\nYou have completed all your tasks")
            }
        } else {
            if(completed){
                console.log("\nYou have completed the following tasks: ");
            } else {
                console.log("\nYou have the following tasks left to do: ");
            }
                show_tasks_with_freq(tasks_with_curr_status);
            }
    }
    if (user.tasks.length === 0){
        console.log("You don't have any tasks")
    } else {
        while(true){
            console.log("What do you want to show? \n a) All tasks\n" +
                        " b) Tasks left to do\n c) Completed tasks\n")
            let choice: string = input("Choose a, b or c: ");
            choice = choice.toLowerCase();
            if(choice === "a"){
                console.log("\nYou have the following tasks: ")
                show_tasks_with_freq(user.tasks)
                break;
            } else if(choice === "b"){
                show_tasks_status(user, false);
                break;
            } else if(choice === "c") {
                show_tasks_status(user, true);
                break;
            } else {
                console.log("\nWrong input")
            }
        }
    }
}

/**
 * Login a user based on username and password, creates a new user if user
 * is not registerd already
 * @returns the user currently logged in, or @undefined if the user is not registered.
 */

export function login(): User | undefined { 
    const curr_username: string = input("Username: ")
    const curr_user = ph_lookup(user_table, curr_username);
    if(curr_user !== undefined){
        let pass_input: Boolean = false;
        while(!pass_input){
        const password: string = input("Password: ");
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
    const curr_task: string = input("Which task do you want to remove?: ")
    const task_look_up: Task | undefined  = user.tasks.find(x => x.name == curr_task);
    if (task_look_up === undefined) {
        let retry: string = input("You do not have such task, do you want to try again? Y / N")
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
        let choice: string = input("Choose A or B. ")
        choice = choice.toLowerCase();
        if (choice === "a") {
            active_user = create_user();
            console.log("You have successfully created a new user.")
            preset(active_user);
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
        let choice: string = input("Choose a, b, c, d, e or f: ");
        choice = choice.toLowerCase();
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
