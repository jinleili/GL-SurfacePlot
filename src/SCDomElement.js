/**
 * Created by grenlight on 16/3/21.
 */

import {Vector3} from './webgl/math/Vector3.js';

export class  SCDomElement {
    constructor(style, title = null) {
        this.title = title;
        this.style = style;
        this.panel = this.createPanel(style);
      
        if (this.title) {
            this.createTitle(style);
        }
        this.leftLabels = [];
        this.leftLabelsTN = [];
        this.createLabels(style);
    }

    createPanel(style) {
        let styleStr = 'position:relative;display:block; padding:0px; margin: 0px;  -webkit-tap-highlight-color:rgba(0, 0, 0, 0); -webkit-user-select: none; user-select: none; width:' + style.width + 'px; ' + 'height:' + style.height + 'px; color: ' + style.fontColor +'; background-color:'+ style.backgroundColor;
        return this.createElement('div', styleStr);
    }

    createLabels() {
        for (let i=0; i<7; i++) {
            let div = this.createElement('div', 'position:absolute; text-align:right; font-size: 12px; display:None;' +
                ' width: 100px; height20px');
            let textNode = document.createTextNode("");
            div.appendChild(textNode);
            this.panel.appendChild(div);
            this.leftLabels.push(div);
            this.leftLabelsTN.push(textNode);
        }
    }

    /**
     * 将标尺刻度显示到屏幕
     *
     * @param {array} arr
     * @param {Matrix4} matrix
     */
    showLabels(arr, matrix) {
        for (let i=0; i< arr.length; i++) {
            let div = this.leftLabels[i];
            let textNode = this.leftLabelsTN[i];
            let coord = arr[i].coord;
            console.log('coord0: ', coord);
            Vector3.applyMatrix4(coord, matrix);
            console.log('coord1: ',  coord);
            div.style.display = 'block';
            // div.style.top = this.style.canvasHeight/2 - coord[1] + 'px';
            // div.style.left = this.style.canvasWidth/2 - 100-30 +coord[0] + 'px';
            div.style.top = (1-coord[1]) * this.style.height/2 + 'px';
            div.style.left = (1+coord[0]) * this.style.width/2 - 110 + 'px';
            textNode.nodeValue = arr[i].label;
        }
    }

    createTitle(style) {
        let styleStr = 'position:absolute; left:0px; top: 5px; font-size: 20px; font-style:bold;  width:' + style.width + 'px; ' + 'height:30px; text-align: center; z-index: 10';
        let titleElement = this.createElement('h3', styleStr);
        titleElement.innerHTML = this.title;
        this.panel.appendChild(titleElement);
    }

    createElement(elementType, styleStr) {
        let ele = document.createElement(elementType);
        ele.setAttribute('style', styleStr);
        return ele;
    }
}