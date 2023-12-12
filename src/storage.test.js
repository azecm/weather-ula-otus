import {citiesList} from "./constants";
import {loadList, saveList, storageKey} from "./storage";


test("test saveList", async () => {
    citiesList.push("1");
    saveList();
    expect(localStorage.getItem(storageKey)).toBe(`["1"]`);
});

test("test loadList", async () => {
    // очищаем от предыдущего теста
    citiesList.shift();
    expect(citiesList.length).toEqual(0);
    loadList();
    expect(citiesList.length).toEqual(1);
    // ---
    citiesList.shift();
    localStorage.removeItem(storageKey);
    loadList();
    expect(citiesList.length).toEqual(0);
});
