const rpr = require("../build/Debug/radeonrays.node")

const result = rpr.debugTypedArray(new Float32Array([1.1, 2.2, 3.3]))

console.log(result)
