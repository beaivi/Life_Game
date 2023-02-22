//Se avklarade/icke avklarade uppgifter
//Kalender
//Ta bort tasks
//Hindra från att lägga till samma task flera gånger
//Skapa förbestämda tasks att välja ifrån
//login
//Leaderboard?
//Fixa egna levlar

import * as PromptSync from "prompt-sync";

import { type ProbingFunction, type ProbingHashtable, type HashFunction, 
         probe_linear, ph_empty, ph_insert, ph_lookup
       } from "./hashtables"
import { type List, list, append, head, tail, is_null } from './list';
import { length, list_ref } from "./list_prelude";

const prompt: PromptSync.Prompt = PromptSync({sigint:true});
//Types
type User = {
             username: string,
             name: string,
             tasks: dwm,
             score: Points,
            };
type Points = number;
type dwm = Array<TaskArray>
type TaskArray = Array<Task>; //bst eller rbt istället?
type Task = {
             task: string,
             progress: boolean 
            };
type UserTable = ProbingHashtable<string, User>;

const my_hash: HashFunction<string> = x => x.length;
const user_table: UserTable = ph_empty(100, probe_linear(my_hash));
const daily_weekly_or_monthly = ["daily", "weekly", "monthly"];

function new_user(): User { 
    var username_input = prompt("Choose username: ");
    var name = prompt("What's your name? ");
    const tasks: dwm = [[], [], []];
    const user : User = { username: "",        
                          name: "", 
                          tasks: tasks,
                          score: 0
                        };
    user.username = username_input;
    user.name = name;
    ph_insert(user_table, user.username, user);
    return user;
}
//Hur göra om två lika tasks
function add_tasks(dwm: number, user: User): void {
    const curr_dwm =  daily_weekly_or_monthly[dwm];
    function get_tasks() {
        console.log("");
        const new_task: Task = {task: prompt("Add a " + curr_dwm + " task: "),
                                progress: false
                               };
        console.clear();
        user.tasks[dwm][user.tasks[dwm].length] = new_task;

        console.log("\nTask " + new_task.task + " added to your " + curr_dwm + " tasks!\n");
    }
    get_tasks();
    while (true) {
        const c: string = prompt("Do you want to add more " + curr_dwm + " tasks? y/n ");
        if (c !== "y" && c !== "n" && c !== "Y" && c !== "N"){
            console.log("\nWrong input! \n");
        } else {
            if (c === "y" || c === "Y") {
                 get_tasks();
            } else {
                break;
            }
        }
    }
    console.log("\nYou have the following " + curr_dwm + " tasks: ")
    for (let i = 0; i < user.tasks[dwm].length; i++) {
        console.log(user.tasks[dwm][i].task)
    
    }
}

function add_points(dwm: number, user: User) {
    if(dwm === 0){
        console.log("1 point earned")
        user.score = user.score + 1;
        level_up(user);
    } else if(dwm === 1){
        console.log("3 points earned")
        user.score = user.score + 3;
        level_up(user);
    } else {
        console.log("10 points earned")
        user.score = user.score + 10;
        level_up(user);   
    }
}

function get_level(user: User){
    if(user.score < 100){
        console.log("Level 1: " + user.score + " points")
    } else if(user.score < 200){
        console.log("Level 2: " + user.score + " points")
    } else if(user.score < 300){
        console.log("Level 3: " + user.score + " points")
    }
    
}

function level_up(user: User){
    if(user.score === 100){
        console.log("You reached level 2")
    } else if(user.score === 200){
        console.log("You reached level 3")
    } else if(user.score === 300){
        console.log("You reached level 4")
    } else {}
}

function complete_tasks(user: User){
    const completed_task = prompt("\nTask compleded: ");
    function helper(dwm: number, taskarray: TaskArray) {
        for (let i = 0; i < taskarray.length; i++) {
            if(completed_task === taskarray[i].task){
                console.log("Well done");
                user.tasks[dwm][i].progress = true;
                add_points(dwm, user);
                console.log(user.tasks[dwm]);
                return true;
            } else if(i === taskarray.length - 1){
                return false;
            } else {}
        }
    }
    if(!(helper(0, user.tasks[0]) || helper(1, user.tasks[1]) || helper(2, user.tasks[2]))){
        console.log("You have not added that task yet")
    } else {
    }
}
function show_tasks(user: User){
    if (user.tasks[0].length === 0 && user.tasks[1].length === 0 && user.tasks[2].length === 0){
        console.log("You don't have any tasks")
    }
    console.log("\nDaily tasks:")
    for(let i = 0; i < user.tasks[0].length; i++){
        console.log(user.tasks[0][i].task);
    }
    console.log("\nWeekly tasks: ")
    for(let i = 0; i < user.tasks[1].length; i++){
        console.log(user.tasks[1][i].task);
    }
    console.log("\nMonthly tasks: ")
    for(let i = 0; i < user.tasks[1].length; i++){
        console.log(user.tasks[2][i].task);
    }


}

function menu(user: User){
    console.log("\nWhat do you want to do?")
    console.log("\n a) Add daily tasks \n b) Add weekly tasks" +
                "\n c) Add monthly tasks \n d) Complete tasks \n e) Show your points \n" +
                 " f) Show your tasks \n g) Remove tasks \n")
    const c = prompt("Choose a, b, c, d, e or f: ");
    if(c === "a"){
        add_tasks(0, user);
        menu(user);
    } else if(c === "b"){
        add_tasks(1, user);
        menu(user);
    } else if(c === "c"){
        add_tasks(2, user);
        menu(user);
    } else if (c === "d"){
        complete_tasks(user);
        menu(user);
    } else if(c === "e"){
        get_level(user);
        menu(user);
    } else if(c === "f"){
        show_tasks(user);
        menu(user);
    } else if(c === "g"){
        remove_tasks(user);
        menu(user);
    } else {
        console.clear();
        console.log("Wrong input");
        menu(user);
    }
}
function driver_loop():void {
    const curr_user = new_user(); //or login
    menu(curr_user);
    //remove_daily_tasks(curr_user);
}


console.log(driver_loop());


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
    } else if(c === "c"){
    remove_tasks_helper(2, user)
    } else {
        console.log("\nWrong input")
        remove_tasks(user);
    }
}