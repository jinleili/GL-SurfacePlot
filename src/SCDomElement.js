/**
 * Created by grenlight on 16/3/21.
 */

import {Color} from './webgl/utils/Color.js';

export class  SCDomElement {
    constructor(params) {
        this.width = params.width;
        this.height = params.height;
        this.title = params.title;
        this.fontColor = params.fontColor ? params.fontColor : 0xfafafa;
        this.backgroundColor = params.backgroundColor ? params.backgroundColor : 0x353535;

        this.panel = this.createPanel();
      
        if (this.title) {
            this.createTitle();
        }
    }

    createPanel() {
        let style = 'position:relative;display:block; padding:0px; margin: 0px;  -webkit-tap-highlight-color:rgba(0, 0, 0, 0); -webkit-user-select: none; user-select: none; width:' + this.width + 'px; ' + 'height:' + this.height + 'px; color: ' + this.fontColor +'; background-color:'+ this.backgroundColor;
        return this.createElement('div', style);
    }

    createTitle() {
        let style = 'position:absolute; left:0px; top: 5px; font-size: 20px; font-style:bold;  width:' + this.width + 'px; ' + 'height:30px; text-align: center; z-index: 0';
        let titleElement = this.createElement('h3', style);
        titleElement.innerHTML = this.title;
        this.panel.appendChild(titleElement);
    }

    createElement(elementType, styleStr) {
        let ele = document.createElement(elementType);
        ele.setAttribute('style', styleStr);
        return ele;
    }
}