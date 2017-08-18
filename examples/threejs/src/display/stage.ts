import { ViewPort } from './viewport';
export class Stage {
    threeView:ViewPort;
    radeonView:ViewPort;

    constructor(){
        this.threeView = new ViewPort("three-view");
        this.threeView = new ViewPort("radeon-view");
    }
}