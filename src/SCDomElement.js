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
        this.createLabels();
    }

    createPanel(style) {
        let styleStr = 'position:relative;display:block; padding:0px; margin: 0px;  -webkit-tap-highlight-color:rgba(0, 0, 0, 0); -webkit-user-select: none; user-select: none; width:' + style.width + 'px; ' + 'height:' + style.height + 'px; color: ' + style.fontColor +'; background-color:'+ style.backgroundColor;
        return this.createElement('div', styleStr);
    }

    createLabels() {
        for (let i=0; i<8; i++) {
            let [div, textNode] = this.createSingleLabel();
            this.leftLabels.push(div);
            this.leftLabelsTN.push(textNode);
        }
    }
    
    createSingleLabel(degress=0) {
        let div = this.createElement('div', `position:absolute; text-align:right; font-size: 12px; display:None;
         width: 100px; height:12px; line-height:12px; overflow:hidden; color:${this.style.scaleColor};
         transform:rotate(${degress}deg); -ms-transform:rotate(${degress}deg); 	
         -moz-transform:rotate(${degress}deg); 	
         -webkit-transform:rotate(${degress}deg); -o-transform:rotate(${degress}deg)`);
        let textNode = document.createTextNode("");
        div.appendChild(textNode);
        this.panel.appendChild(div);
        return [div, textNode];
    }

    /**
     * 将标尺刻度显示到屏幕
     *
     * @param {array} arr
     * @param {Matrix4} matrix
     */
    showYLabels(arr, matrix) {
        for (let i=0; i< arr.length; i++) {
            let div = this.leftLabels[i];
            let textNode = this.leftLabelsTN[i];
            let coord = arr[i].coord;

            //将透视空间的坐标转换成实际屏幕坐标
            Vector3.applyMatrix4(coord, matrix);
            div.style.top = (1-coord[1]) * this.style.height/2 - 6+ 'px';
            div.style.left = (1+coord[0]) * this.style.width/2 - 110 + 'px';
            textNode.nodeValue = arr[i].label;
            div.style.display = 'block';
        }
    }

    showZLabels(arr, matrix) {
        for (let i=0; i< arr.length; i++) {
            let [div, textNode] = this.createSingleLabel();
            let coord = arr[i].coord;

            //将透视空间的坐标转换成实际屏幕坐标
            Vector3.applyMatrix4(coord, matrix);
            div.style.top = (1-coord[1]) * this.style.height/2 - 6 + 'px';
            div.style.left = (1+coord[0]) * this.style.width/2 +10+ 'px';
            div.style.textAlign = 'left';
            div.style.fontSize = '8px';
            textNode.nodeValue = arr[i].label;
            div.style.display = 'block';
        }
    }

    showXLabels(arr, matrix) {
        for (let i=0; i< arr.length; i++) {
            let [div, textNode] = this.createSingleLabel(-90);
            let coord = arr[i].coord;

            //将透视空间的坐标转换成实际屏幕坐标
            Vector3.applyMatrix4(coord, matrix);
            div.style.top = (1-coord[1]) * this.style.height/2  + 45+ 'px';
            div.style.left = (1+coord[0]) * this.style.width/2 -55+ 'px';
            div.style.fontSize = '8px';
            textNode.nodeValue = arr[i].label;
            div.style.display = 'block';
        }
    }

    createTitle(style) {
        let styleStr = 'position:absolute; left:0px; top: 15px; margin:0px;font-size: 20px; font-style:bold;  width:' + style.width + 'px; ' + 'height:25px; text-align: center; z-index: 10';
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