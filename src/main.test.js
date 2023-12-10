import {getIP, getWeather, addCityInList, startAll} from "./main";
import {callIfTrue, requestDomain} from "./constants";


const resultIp = "1";
const city1 = "city-1";
const resultWeather = {description: "description", temp: 0};

//result = {ip: "", weather:{description:"", temp:0}}
function setFetchResult() {
    window.fetch = (path = "") => Promise.resolve(
        {
            json: () => {
                if(path.startsWith("https://"+requestDomain.ipApi)){
                    return Promise.resolve(
                        {ip: resultIp}
                    )
                }
                if(path.startsWith("https://"+requestDomain.openWeather)){
                    return Promise.resolve(
                        {
                            weather:[{description:resultWeather.description, icon:'icon'}],
                            main:{temp:resultWeather.temp},
                            // ---
                            name: "",
                            coord: {
                                lon: "",
                                lat: ""
                            }
                        }
                    )
                }
                if(path.startsWith("https://"+requestDomain.sypExGeo)){
                    return Promise.resolve(
                        {
                            city: {
                                lon: "",
                                lat: "",
                                name_ru: "name_ru"
                            }
                        }
                    )
                }

                return ""
            }
        });
}


function initTemplate (initInput = "") {
    document.body.innerHTML = "<div id='temperature'></div>"
    + "<div id='weatherDescription'></div>"
    + "<div id=city></div>"
    + "<div id=weatherImage></div>"
    + "<ol id=list></ol>"
    + "<input id=input value='"+initInput+"'/>"
    + "<img  id=map>"
    + "<button id=button>Нажмите</button>"
    ;
}

setFetchResult();

test("test getIP", async () => {
    //const resultIp = "1";
    //setFetchResult();
    expect(await getIP()).toBe(resultIp);
});

test("test callIfTrue", async () => {
    expect(callIfTrue(false, ()=>5)()).toBe(undefined);
    expect(callIfTrue(true, ()=>5)()).toBe(5);
});

test("test getWeather", async () => {
    initTemplate();

    const weatherDescription = document.getElementById("weatherDescription");
    expect(weatherDescription.innerHTML).toBe("");
    await getWeather("");
    expect(weatherDescription.innerHTML).toBe(resultWeather.description);
});

test("test startAll [empty localStorage] ", async () => {
    initTemplate();

    const weatherDescription = document.getElementById("weatherDescription");
    expect(weatherDescription.innerHTML).toBe("");
    await startAll();
    expect(document.body.innerHTML).toContain(`<ol id="list"></ol>`);
});

test("test addCityInList", async () => {
    initTemplate(city1);

    const weatherDescription = document.getElementById("weatherDescription");
    expect(weatherDescription.innerHTML).toBe("");
    await addCityInList();
    expect(weatherDescription.innerHTML).toBe(resultWeather.description);
});

test("test startAll [localStorage - single position]", async () => {
    initTemplate();

    const weatherDescription = document.getElementById("weatherDescription");
    expect(weatherDescription.innerHTML).toBe("");
    await startAll();
    expect(document.body.innerHTML).toContain(`<ol id="list"><li data-city="${city1}">${city1}</li></ol>`);
});

test("test addCityInList [over 10]", async () => {
    initTemplate();
    const input = document.getElementById("input");
    for (let i=0; i<12;i++){
        input.value = "city"+i;
        await addCityInList();
    }
    expect(document.body.innerHTML).toContain(`<li data-city="city11">city11</li>`);
});

test("test cityFromListClick", async () => {
    initTemplate(city1);
    await startAll();
    await addCityInList();
    const elem = document.querySelector(`[data-city="${city1}"]`);

    const impMap = document.getElementById("map");
    expect(impMap.src).toBe("")
    elem.click();
    await wait(0);
    expect(impMap.src).toContain("static-maps.yandex.ru/")
});

test("test KeyboardEvent", async () => {
    initTemplate();

    const input = document.getElementById("input");
    const events = {};
    input.addEventListener = jest.fn((event, cb) => {
        events[event] = cb;
    });
    await startAll();

    const city = 'city-keydown';
    input.value = city;
    events.keydown({key: "Enter"});
    await wait(0);
    expect(document.body.innerHTML).toContain(`<li data-city="${city}">${city}</li>`);
    expect(input.value).toBe("");
});

test("test - bad city", async () => {
    window.fetch = () =>
        Promise.resolve({
            json:()=>Promise.resolve({})
        });
    expect(await getWeather("")).toEqual(false);
});

async function wait(ms){
    return new Promise((res)=>setTimeout(res, ms))
}
