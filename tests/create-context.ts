import RPR from "./../src/core/wrapper/radeon-pro-render"
const rpr = require("../build/Debug/radeonrays.node")
console.time("CreateContext");
const result1 = rpr.CreateContext(RPR.RPR_CREATION_FLAGS_ENABLE_GPU0)
console.timeEnd("CreateContext");
console.log(result1)
if (result1.status === RPR.RPR_SUCCESS) {
    console.time("ContextGetInfo");
    const result2 = rpr.ContextGetInfo(result1.context)
    console.timeEnd("ContextGetInfo");
    console.log(result2)
}
