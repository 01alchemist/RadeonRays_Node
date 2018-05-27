import * as rpr_constants from "./core/wrapper/radeon-pro-render";
let radeonrays_api;
try {
    radeonrays_api = require('../build/Release/radeonrays');
} catch (e) {
    console.log(e)
    // radeonrays_api = require('../build/Debug/radeonrays');
}

module.exports = {
    ...radeonrays_api,
    ...rpr_constants
}

