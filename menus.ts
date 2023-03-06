import { type User, type Task, input } from "./types";
import { change_password, change_username, login, create_user } from "./user";
import { preset, add_task, reset_tasks, complete_tasks, remove_task  } from "./tasks";

/**
 * Shows all tasks the user has added, 
 * taking into account the frequency of the task.
 * @param user the user with the tasks shown
 */
export function show_tasks_menu(user: User): void {
    function show_tasks_with_freq(taskarray: Array<Task>): void {
        function show_freq(taskarray: Array<Task>, freq: string) {
            if(taskarray.length !== 0) {
                console.log("\n" + freq);
                for(let i = 0; i < taskarray.length; i++){
                    console.log("   " + taskarray[i].name);
                }
            }
        }
        const daily_tasks: Array<Task> = [];
        const weekly_tasks: Array<Task> = [];
        const monthly_tasks: Array<Task> = [];
        for(let i = 0; i < taskarray.length; i++) {
            if(taskarray[i].freq === "daily"){
                daily_tasks.push(taskarray[i]);
            } else if(taskarray[i].freq === "weekly") {
                weekly_tasks.push(taskarray[i]);
            } else if(taskarray[i].freq === "monthly") {
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
            if(user.tasks[i].status === completed) {
                tasks_with_curr_status.push(user.tasks[i]);
            }
        }
        if(tasks_with_curr_status.length === 0) {
            if(completed) {
                console.log("\nYou have not completed any tasks yet.");
            } else {
                console.log("\nYou have completed all your tasks");
            }
        } else {
            if(completed) {
                console.log("\nYou have completed the following tasks: ");
            } else {
                console.log("\nYou have the following tasks left to do: ");
            }
                show_tasks_with_freq(tasks_with_curr_status);
            }
    }
    if (user.tasks.length === 0) {
        console.log("You don't have any tasks");
    } else {
        while(true) {
            console.log("What do you want to do? \n a) Show all tasks\n" +
                        " b) Show tasks left to do\n c)" + 
                        " Show completed tasks\n x) Back to main menu");
            let choice: string = input("Choose a, b or c: ");
            choice = choice.toLowerCase();
            if(choice === "a"){
                console.log("\nYou have the following tasks: ");
                show_tasks_with_freq(user.tasks);
                return;
            } else if(choice === "b") {
                show_tasks_status(user, false);
                return;
            } else if(choice === "c") {
                show_tasks_status(user, true);
                return;
            } else if(choice === "x") {
                return;
            }
            else {
                console.log("\nWrong input");
            }
        }
    }
}

/**
 * Displays a menu over the settings available and lets the user decide
 * what do do.
 * @param user the user loged in
 */
export function settings_menu(user: User): void {
    console.log("What do you want to do?");
    console.log("\n a) Change password \n b) Change username\n" + 
                " x) Back to main menu ");
    let have_chosen = false;
    while(!have_chosen){
        let choice: string = input("Choose a, b or x: ");
        choice?.toLowerCase();
        if(choice === "a"){
            change_password(user);
            have_chosen = true;
            return;
        } else if(choice === "b"){
            change_username(user);
            have_chosen = true;
            return;
        } else if (choice === "x"){
            return;
        } else {
            console.log("\nWrong input\n");
        }
    }
}


export let active_user: User | undefined = undefined;

/**
 * Displays a menu with the choices of either logging in, or registering.
 */

export function log_in_menu(): void {
    while (active_user === undefined) {
        console.log("\nDo you want to: \n a). register \n b). log in? \n ")
        let choice: string = input("Choose a or b ")
        choice = choice?.toLowerCase();
        if (choice === "a") {
            active_user = create_user();
            console.log("\nYou have successfully created a new user.\n")
            preset(active_user);
            return;
        } else if (choice === "b") {
            active_user = login();
            return;
        } 
        else {
            console.log("\nWrong input, try again. \n")
        }
    }
}

/**
 * Lets the user decide what they want to do with their tasks
 * @param user the user logged in
 */
export function task_edit_menu(user: User): void {
    console.log("\nWhat do you want do do?");
    console.log("\n a) Add tasks \n b) Remove tasks \n c) Reset time\n " + 
                "x) Back to main menu\n");
    let have_chosen: boolean = false;
    console.log("");
    while(!have_chosen) {
        let choice: string = input("Choose a, b, c or x: ");
        choice = choice?.toLowerCase();
        if(choice === "a") {
            add_task(user);
            have_chosen = true;
        } else if(choice === "b") {
            remove_task(user);
            have_chosen = true;
            return;
        } else if(choice === "c") {
            reset_tasks(user);
            have_chosen = true;
            return;
        } else if (choice === "x"){
            return;
        }
        else {
            console.log("Wrong input");
        }
    }
}

/**
 * Displays the main menu, the main that the user will ge redirected back to
 * everytime they finish an action.
**/

export function main_menu(): void {
    let exit: boolean = false; 
    while (!exit) {
        if (active_user === undefined) {
            log_in_menu();
        }   
        if (active_user !== undefined) {
            console.log("\nWhat do you want to do?")
            console.log("\n a) Add or edit tasks \n b) Complete tasks \n" 
                      + " c) Show your points \n" +
                        " d) Show your tasks \n e) Log out \n f) Settings \n" + 
                        " x) Exit out of program.")
            let choice: string = input("Choose a, b, c, d, e ,f or x: ");
            choice = choice?.toLowerCase();
            console.log("");
            if(choice === "a"){
                task_edit_menu(active_user);
            } else if(choice === "b"){
                complete_tasks(active_user);
            } else if(choice === "c"){
                const level = (x: User)  => x.level;
                const score = (x: User) => x.score;
                console.log("Your level is ", level(active_user) + 
                            "\nand your score is:", score(active_user));
            } else if (choice === "d"){
                show_tasks_menu(active_user);
            } else if (choice === "e"){
                active_user = undefined;
            } else if (choice === "f"){
                settings_menu(active_user);
            } else if (choice === "x") {
                exit = true;
            }
            else {
                console.clear();
                console.log("Wrong input");
            }
        } 
    }

}
