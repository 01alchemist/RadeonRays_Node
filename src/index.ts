import { RadeonRaysContext } from './api/radeon-rays-context';
const radeonrays = require('../build/Release/radeonrays.node');

const contexts:RadeonRaysContext[] = [];

export function createContext(){
    return radeonrays.createContext();
}

export default {
    createContext
}
