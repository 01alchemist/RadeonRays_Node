const rpr = require("../build/Release/radeonrays.node")

const result = rpr.debugString("This is a utf-8 string")

console.log(result)
