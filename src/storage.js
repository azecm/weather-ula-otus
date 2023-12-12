import {citiesList} from "./constants";

export const storageKey = "cities";
export function saveList() {
    return localStorage.setItem(storageKey, JSON.stringify(citiesList));
}

export function loadList() {
    const dataStr = localStorage.getItem(storageKey);
    if(dataStr){
        for(const row of JSON.parse(dataStr)){
            citiesList.push(row);
        }
    }
}

