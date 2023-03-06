import { ProbingHashtable, ph_empty, probe_linear, HashFunction } from "./lib/hashtables";

export function string_to_hash(name: string): number {
    let hash = 0;
    if (name?.length < 1) {
        return hash;
    }
    else {
        for (let i = 0; i < name?.length; i++) {
            let char = name?.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
    }
    return hash;
}

export type User = {
    username: string,
    password: string,
    tasks: Array<Task>;
    score: Points,
    level: number
   };

export type Task = {
name: string,
freq: Freq,
special_points: Points | undefined,
status: boolean
};

export type UserTable = ProbingHashtable<string, User>;
export type Freq = "daily" | "weekly" | "monthly"
type Points = number;

export const my_hash: HashFunction<string> = string_to_hash;
const table_length = 20;
export const user_table: UserTable = ph_empty(table_length, probe_linear(my_hash));

export const input = require('prompt-sync')();

