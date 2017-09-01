import * as rpr_constants from "./core/wrapper/radeon-pro-render";
const radeonrays_api = require('../build/Release/radeonrays.node');

module.exports = {
    ...radeonrays_api,
    ...rpr_constants
}

