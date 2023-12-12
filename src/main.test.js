import {startAll} from "./main";
import {requestDomain} from "./constants";
import {storageKey} from "./storage";


const resultIp = "1";
const city1 = "city-1";
const resultWeather = { description: "description", temp: 0 };

function setFetchResult() {
    window.fetch = (path = "") =>
        Promise.resolve({
            json: () => {
                if (path.startsWith("https://" + requestDomain.ipApi)) {
                    return Promise.resolve({ ip: resultIp });
                }
                if (path.startsWith("https://" + requestDomain.openWeather)) {
                    return Promise.resolve({
                        weather: [{ description: resultWeather.description, icon: "icon" }],
                        main: { temp: resultWeather.temp },
                        // ---
                        name: "",
                        coord: {
                            lon: "",
                            lat: "",
                        },
                    });
                }
                if (path.startsWith("https://" + requestDomain.sypExGeo)) {
                    return Promise.resolve({
                        city: {
                            lon: "",
                            lat: "",
                            name_ru: "name_ru",
                        },
                    });
                }

                return "";
            },
        });
}


function initTemplate(initInput = "") {
    document.body.innerHTML =
        "<div id='temperature'></div>" +
        "<div id='weatherDescription'></div>" +
        "<div id=city></div>" +
        "<div id=weatherImage></div>" +
        "<ol id=list></ol>" +
        "<input id=input value='" +
        initInput +
        "'/>" +
        "<img  id=map>" +
        "<button id=button>Нажмите</button>";
}

setFetchResult();
initTemplate();

const button = document.getElementById("button");
const input = document.getElementById("input");
const events = {keydown:()=>{}};
input.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
});

test("test startAll", async () => {
    localStorage.setItem(storageKey, JSON.stringify([city1]));
    const weatherDescription = document.getElementById("weatherDescription");
    expect(weatherDescription.innerHTML).toBe("");
    await startAll();
    localStorage.setItem(storageKey, JSON.stringify([city1]));
    expect(document.body.innerHTML).toContain(`<ol id="list"><li data-city="${city1}">${city1}</li></ol>`);
});

test("test addCityInList", async () => {
    for (let i=0;i<12;i++){
        const city = "city"+i;
        input.value = city;
        button.click();
        await wait(0);
        expect(document.body.innerHTML).toContain(`<li data-city="${city}">${city}</li>`);
    }
});

test("test cityFromListClick", async () => {
    const city = "city10";
    const elem = document.querySelector(`[data-city="${city}"]`);
    const impMap = document.getElementById("map");
    impMap.removeAttribute("src");
    expect(impMap.src).toBe("");
    elem.click();
    await wait(0);
    expect(impMap.src).toContain("static-maps.yandex.ru/");
});

test("test KeyboardEvent", async () => {
    const city = "city-keydown";
    input.value = city;
    events.keydown({ key: "Enter" });
    await wait(0);
    expect(document.body.innerHTML).toContain(
        `<li data-city="${city}">${city}</li>`,
    );
    expect(input.value).toBe("");
});


async function wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
}
