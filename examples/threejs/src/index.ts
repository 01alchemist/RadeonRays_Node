import { Terminal } from './utils/terminal';
import { demos } from "./demos/index"
import * as UIL from "../../../../uil";
export function main() {
    createGUI();
}

function changeDemo(demo) {
    console.log(demo);
}

function createGUI() {
    const demoList = demos.map(demo => ({label:demo.NAME, class:demo}));
    Terminal.info("Creating GUI");
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#141414";
    var ui:any = new UIL.Gui( { css:'top:10px; left:130px;', size:300, center:true } );
    ui.add('title', { name:'RadeonRays + Three.js'});
    ui.add('list', { name:'Demo', callback:changeDemo, list:demoList});
}

main()
