
import {getCity, getCityCoordinatesByName, getWeather} from "./api";

function mockFetchSucces(result){
    window.fetch = () =>
        Promise.resolve({
            json: () => Promise.resolve(result),
        });
}

function mockFetchFail(){
    window.fetch = () => Promise.reject();
}

test("test getCity", async () => {
    mockFetchSucces({city:"city",longitude:"1",latitude:"2"})
    expect(await getCity()).toEqual({ cityName: 'city', ll: '1,2' });
    mockFetchFail();
    expect(await getCity()).toBe(null);
});

test("test getCityCoordinatesByName", async () => {
    mockFetchSucces({coord:{lon:"lon", lat:"lat"}})
    expect(await getCityCoordinatesByName()).toEqual("lon,lat");
    mockFetchFail();
    expect(await getCityCoordinatesByName()).toBe(null);
});

test("test getWeather", async () => {
    mockFetchSucces({
        name:"name",
        main: {temp:0},
        weather:[{description:"description", icon:"icon"}]
    })
    expect(await getWeather()).toEqual({
        description: 'description',
        name: 'name',
        icon:'icon',
        temp: 0
    });
    mockFetchFail();
    expect(await getWeather()).toBe(null);
});
