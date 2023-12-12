import {callIfTrue} from "./constants";


test("test callIfTrue", async () => {
    expect(callIfTrue(false, () => 5)()).toBe(undefined);
    expect(callIfTrue(true, () => 5)()).toBe(5);
});
