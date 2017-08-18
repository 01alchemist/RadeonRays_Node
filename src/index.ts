import { RadeonRaysContext } from './api/radeon-rays-context';

export class RadeonProRender {

    static contexts:RadeonRaysContext[];

    private static instance:RadeonProRender;
    static getInstance():RadeonProRender {
        if(RadeonProRender.instance === undefined){
            RadeonProRender.instance = new RadeonProRender();
        }
        return RadeonProRender.instance;
    }
    private constructor() {

    }

}
