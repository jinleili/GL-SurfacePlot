/**
 * Created by grenlight on 16/3/22.
 */

import {Color} from './webgl/utils/Color.js';

export class SCStyle {
    constructor(params) {
        this.width = params.width;
        this.height = params.height;
        this.fontColor = params.fontColor ? params.fontColor : 0xfafafa;
        this.backgroundColor = params.backgroundColor ? params.backgroundColor : 0x353535;
        this.rgbFontColor = Color.hex2rgb(this.fontColor);
        this.rgbBackgroundColor = Color.hex2rgb(this.backgroundColor);

        //这里的 padding 并不表示最终曲面与画板的实际内边距
        this.paddingLR = 50;
        this.paddingTop = 50;
        this.paddingBottom = 50;

        this._canvasWidth = 0;
        this._canvasHeight = 0;
        this.drawWidth  = 0;
        this.drawHeight = 0;
    }

    set canvasWidth(newValue) {
        this._canvasWidth = newValue;
        this.drawWidth = this._canvasWidth - (this.paddingLR * 2);
    }
    get canvasWidth() {
        return this._canvasWidth;
    }

    set canvasHeight(newValue) {
        this._canvasHeight = newValue;
        this.drawHeight = this._canvasHeight - (this.paddingBottom + this.paddingTop);
    }
    get canvasHeight() {
        return this._canvasHeight;
    }

}
