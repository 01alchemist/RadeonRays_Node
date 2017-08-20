const rpr = require("../dist/index");

test("createContext", () => {
    expect(rpr.createContext()).toBeTruthy();
});
