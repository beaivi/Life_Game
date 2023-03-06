import { type User, input, type Task, type Freq } from "./types";

/**
 * Adds a new task to the user logged in.
 * @param user, the user that the task will be added to.
 * */
export function add_task(user: User): void {
    function create_task(): void {
        const curr_task: string = input("Add a task: ");
        let task_exists: boolean = false;
        const task: Task | undefined = user.tasks.find(x => 
                                                         x.name == curr_task);
        if (task !== undefined) {
                task_exists = true;
                console.log("\nYou already have " + curr_task + " as a task\n");
            }
        while (!task_exists) {
            let freq: string = input("How often do you want to repeat the task?"
                                   + " Daily, weekly or monthly: ");
            freq = freq?.toLowerCase();
            if (freq !== "daily" && freq !== "weekly" && freq !== "monthly") {
                console.log("\nInvalid input, write your choice as" + 
                            " 'daily', 'weekly' or 'monthly'. ");
            } else { 
                let new_task: Task = {
                    name: curr_task,
                    freq: freq,
                    special_points: undefined,
                    status: false,
                    };
                let have_chosen: boolean = false;
                while (!have_chosen) {
                    let choice: string = input("Would you like to change how " +
                                             " many points this task gives"  + 
                                             " when completed? "
                                             + "Y / N ");
                    choice = choice?.toLowerCase();
                    if (choice === "y") {
                        let is_number: boolean = false;
                        while (!is_number) {
                            let own_points: string = input("How many points " 
                                                         + "should your earn " 
                                                         + "for completing " 
                                                         + curr_task + "? ");
                            const points: number = parseFloat(own_points);
                            if (isNaN(points)) {
                                console.log("\nInput must be a number");
                            } else {
                                new_task.special_points = points;
                                is_number = true;
                                have_chosen = true;
                            }
                        }
                    } else if (choice === "n") {
                        have_chosen = true;
                    } else {
                        console.log("\nWrong input");
                    }
                }
                user.tasks.push(new_task);
                console.log("");
                console.log(curr_task + " added as a " + freq + " task\n");
                task_exists = true;
            }
        }
    }
    create_task();
    let have_chosen: boolean = false;
    while (!have_chosen) {
        let repeat: string = input("Do you want to input another task? Y / N ");
        repeat = repeat?.toLowerCase();
        if (repeat === "y") {
            console.log("");
            have_chosen = true;
            create_task();
        } else if (repeat === "n") {
            have_chosen = true;
        } else {
            console.log("Wrong input");
        }
    }
}

/**
 * Lets the user choose tasks from a preset of tasks
 * @param user the user the presets may be added to.
 */
export function preset(user: User): void { 
    function add_presets(): void {
        function add_tasks_to_array(task_name: string, task_freq: Freq): void {
            const curr_task: Task = {name: task_name, 
                                     freq: task_freq, 
                                     special_points: undefined, 
                                     status: false,
                                    }
            preset_array.push(curr_task);
        }
        const preset_array: Array<Task> = [];
        add_tasks_to_array("Cook", "daily");
        add_tasks_to_array("Make bed", "daily");
        add_tasks_to_array("Dishes", "daily");
        add_tasks_to_array("Water plants", "weekly");
        add_tasks_to_array("Vacuum", "weekly");
        add_tasks_to_array("Laundry", "monthly");
        for (let i = 0; i < preset_array.length; i++) {
            console.log("");
            let have_chosen: boolean = false;
            while (!have_chosen) {
                let choice: string = input("Do you want to add " 
                                         + preset_array[i].name 
                                         + " as a " + preset_array[i].freq 
                                         + " task? Y / N ");
                choice = choice?.toLowerCase();
                if (choice === "y") {
                    user.tasks.push(preset_array[i]);
                    have_chosen = true;
                } else if (choice === "n") {
                    have_chosen = true;
                } else {
                    console.log("Wrong input");
                }
            }
        }
        if (user.tasks.length !== 0) {
            console.log("Added " + user.tasks.length + " tasks");
        } else {
            console.log("\nYou did not add any tasks\n");
            let have_chosen: boolean = false;
            while (!have_chosen) {
                let choice: string = input("Do you want do add your own tasks?" 
                                         + " Y / N ");
                choice = choice?.toLowerCase();
                if (choice === "y") {
                    add_task(user);
                    have_chosen = true;
                } else if (choice === "n") {
                    have_chosen = true;
                } else {
                    console.log("Wrong input");
                }
            }

        }
    }
    if (user.tasks.length === 0) {
        let have_chosen: boolean = false;
        while (!have_chosen) {
            let choice: string = input("Do you want to choose "
                                     + "some tasks from a preset?" 
                                     + " Y / N ");
            choice = choice?.toLowerCase();
            if (choice === "y") {
                add_presets();
                have_chosen = true;
            } else if (choice === "n") {
                have_chosen = true;
            } else {
                console.log("\nWrong input\n");
            }
        }
    } else {
        console.log("You can't choose tasks from the preset"
                  + " if you already have tasks");
    }
}

/**
    * Allows the user to mark a task as completed, adds points 
    * and shows if the user is leveling up.
    * @param user the user that gets its tasks updated
**/
export function complete_tasks(user: User): void {
    function level_up(): void {
        if (user.score > 100) {
            user.level += 1;
            user.score -= 100;
             console.log("You have reached level ", user.level);
        }   
    }
    function add_points(user: User, task: Task): void {
        if (task.special_points !== undefined) {
            console.log(task.special_points + " points earned");
            user.score = user.score + task.special_points;
            level_up();
        }
        else if (task.freq === "daily") {
            console.log("1 point earned");
            user.score = user.score + 1;
            level_up();
        } else if (task.freq === "weekly") {
            console.log("3 points earned");
            user.score = user.score + 3;
            level_up();
        } else {
            console.log("10 points earned");
            user.score = user.score + 10;
            level_up();   
        }
    }
    function task_existence(taskarray: Array<Task>): boolean {
        for (let i = 0; i < taskarray.length; i++) {
            if (completed_task === taskarray[i].name) {
                if (!taskarray[i].status) {
                    console.log("\nWell done");
                    user.tasks[i].status = true;
                    add_points(user, user.tasks[i]);
                } else {
                    let status: string = "";
                    if (taskarray[i].freq === "daily") {
                        status = "tomorrow";
                    } else if (taskarray[i].freq === "weekly") {
                        status = "next week";
                    } else if (taskarray[i].freq === "monthly") {
                        status = "next month";
                    }
                    console.log("You have already completed that task, "
                              + "wait until " + status 
                              + " to complete that task again" );
                }
                return true;
            } else {}
        }
        return false;
    }
    const completed_task: string = input("Task completed: ");
    if (!(task_existence(user.tasks))) {
        console.log("\nYou have not added that task");
    } else {}
}

/**
 * Resetts the status of a users daily, weekly or monthly tasks
 * @param user the user that gets its task's status resetted
 */
export function reset_tasks(user: User): void {
    function reset(user: User, curr_freq: string): void {
        for (let i = 0; i < user.tasks.length; i++) {
            if (user.tasks[i].freq === curr_freq) {
                user.tasks[i].status = false;
            }
        }
        is_resetted = true;
        console.log("Your " + curr_freq + " tasks has been resetted");
    }
    let is_resetted: boolean = false;
    while (!is_resetted) {
        let reset_prompt: string = input("Reset daily, weekly " 
                                       + "or monthly tasks: ");
        reset_prompt = reset_prompt?.toLowerCase();
        if (reset_prompt === "daily") {
            reset(user, "daily");
        } else if (reset_prompt === "weekly") {
            reset(user, "weekly");
        } else if (reset_prompt === "monthly") {
            reset(user, "monthly");
        } else {
            console.log("Wrong input");
        }
    }
}

/**
 * Removes a task from a users tasks
 * @param user the user who gets its task removed
 */
export function remove_task(user: User): void {
    const curr_task: string = input("Which task do you want to remove?: ");
    const find_task: Task | undefined  = user.tasks.find(x => 
                                                           x.name == curr_task);
    if (find_task === undefined) {
        let retry: string = input("You do not have such task, " 
                                + "do you want to try again? Y / N ");
        retry = retry?.toLowerCase();
        if (retry === "y") {
            remove_task(user);
        } else {}
    } else {
        const index: number = user.tasks.indexOf(find_task);
        user.tasks.splice(index, 1);
        console.log("You successfully removed the task " + curr_task);
        const repeat: string = input("Do you want to remove another task? " 
                                   + "Y / N ");
        if (repeat === "Y") {
            remove_task(user);
        } else {}
    } 
}
