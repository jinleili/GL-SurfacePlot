/**
 * Created by grenlight on 16/3/21.
 */
    
export class  SCDomElement {
    constructor(style, title = null) {
        this.title = title;
        this.panel = this.createPanel(style);
      
        if (this.title) {
            this.createTitle(style);
        }
    }

    createPanel(style) {
        let styleStr = 'position:relative;display:block; padding:0px; margin: 0px;  -webkit-tap-highlight-color:rgba(0, 0, 0, 0); -webkit-user-select: none; user-select: none; width:' + style.width + 'px; ' + 'height:' + style.height + 'px; color: ' + style.fontColor +'; background-color:'+ style.backgroundColor;
        return this.createElement('div', styleStr);
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