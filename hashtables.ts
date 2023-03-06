import { type Pair, type List, head, tail, set_tail, pair, is_null } from '../lib/list';
import { flatten, build_list, map } from '../lib/list_prelude'

export type HashFunction<K> = (key: K) => number;

export const hash_id: HashFunction<number> = x => x;


export type ChainingHashtable<K, V> = {
    readonly arr:  Array<List<Pair<K, V>>>,
    readonly hash: HashFunction<K>,
    readonly length: number
}

export function ch_empty<K, V>(size: number, hash: HashFunction<K>): ChainingHashtable<K,V> {
    const arr = new Array(size);
    for (var i = 0 ; i < size ; i++) {
        arr[i] = null;
    }
    return { arr, hash, length: size };
}

type NonemptyList<T> = Pair<T, List<T>>;

function scan<K, V>(xs: List<Pair<K, V>>, key: K): V | undefined {
    return  is_null(xs)
            ? undefined
            : key === head(head(xs))
            ? tail(head(xs))
            : scan(tail(xs), key);
}

export function ch_lookup<K, V>({arr, hash, length}: ChainingHashtable<K,V>, key: K): V | undefined {
    return scan(arr[hash(key) % length], key);
}

function add<K, V>(xs: Pair<Pair<K, V>,List<Pair<K, V>>>, key: K, value: V): void {
    const tl = tail(xs);
    if (head(head(xs)) === key) {
        set_tail(head(xs), value);
    } else if (is_null(tl)) {
        set_tail(xs, pair(pair(key, value), null));
    } else {
        add(tl, key, value);
    }
}

export function ch_insert<K, V>({arr, hash, length}: ChainingHashtable<K,V>, key: K, value: V): void {
    const index = hash(key) % length;
    const xs    = arr[index];
    if (xs === null) {
        arr[index] = pair(pair(key, value), null);
    } else {
        add(xs, key, value);
    }
}

export function ch_delete<K, V>({arr, hash, length}: ChainingHashtable<K,V>, key: K): boolean {
    function scan_and_delete(xs: NonemptyList<Pair<K, V>>): boolean {
        const tl = tail(xs);
        if(is_null(tl)) {
            return false;
        } else if(key === head(head(tl))) {
            set_tail(xs, tail(tl));
            return true;
        } else  {
            return scan_and_delete(tl);
        }
    }
    const xs = arr[hash(key) % length];
    if (is_null(xs)) {
        return false;
    } else if (key === head(head(xs))) {
        arr[hash(key) % length] = tail(xs);
        return true;
    } else { 
        return scan_and_delete(xs);
    }
}

export function ch_keys<K, V>(tab: ChainingHashtable<K,V>): List<K> {
    return map(head, flatten(build_list(i => tab.arr[i], tab.length)));
}

export type ProbingFunction<K> = (length:number, key: K, i: number) => number;

export type ProbingHashtable<K, V> = {
    keys:  Array<K | null>,
    data:  Array<V>,
    probe: ProbingFunction<K>,
    length: number, // length of the arrays
    size: number // number of elements
};

export function probe_linear<K>(hash:  (key: K) => number): ProbingFunction<K> {
    return (length:number, key: K, i: number) => (hash(key) + i) % length;
}

export function probe_quadratic<K>(hash:  (key: K) => number): ProbingFunction<K> {
    return (length:number, key: K, i: number) => (hash(key) + i*i) % length;
}

export function ph_empty<K, V>(length: number, probe: ProbingFunction<K>): ProbingHashtable<K,V> {
    return { keys: new Array(length), data: new Array(length), probe, length, size: 0 };
}

function probe_from<K, V>(tab: ProbingHashtable<K,V>, key: K, i: number): number | undefined {
    function step(i: number): number | undefined {
        const index = tab.probe(tab.length, key, i);
        return i === tab.length || tab.keys[index] === undefined
                   ? undefined
               : tab.keys[index] === key
                   ? index
               : step(i + 1);
    }
    return step(i);
}

export function ph_lookup<K, V>(tab: ProbingHashtable<K,V>, key: K): V | undefined {
    const index = probe_from(tab, key, 0);
    return index == undefined
           ? undefined
           : tab.data[index];
}

export function ph_insert<K, V>(tab: ProbingHashtable<K,V>, key: K, value: V): boolean {
    function insertAt(index: number): true {
        tab.keys[index] = key;
        tab.data[index] = value;
        tab.size = tab.size + 1;
        return true;
    }
    function insertFrom(i: number): boolean {
        const index = tab.probe(tab.length, key, i);
        if (tab.keys[index] === key || tab.keys[index] === undefined) {
            return insertAt(index);
        } else if (tab.keys[index] === null) {
            const location = probe_from(tab, key, i);
            return insertAt(location === undefined ? index : location);
        } else {
            return insertFrom(i + 1);
        }
    }
    return tab.length === tab.size ? false : insertFrom(0);
}

export function ph_delete<K, V>(tab: ProbingHashtable<K,V>, key: K): boolean {
    const index = probe_from(tab, key, 0);
    if (index === undefined) {
        return false;
     } else { 
        tab.keys[index] = null;
        tab.size = tab.size - 1;
        return true;
    }
}

function filterNulls<T>(xs:List<T | undefined | null>): List<T> {
    if (is_null(xs)) {
        return null;
    } else {
        const x = head(xs);
        if (x === undefined || x === null) {
            return filterNulls(tail(xs));
        } else {
            return pair(x, filterNulls(tail(xs)));
        }
    }
}

export function ph_keys<K, V>(tab: ProbingHashtable<K,V>): List<K> {
    return filterNulls(build_list(i => tab.keys[i], tab.length));
}
