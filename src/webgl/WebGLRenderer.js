/**
 * Created by grenlight on 16/3/18.
 */
import * as GLUtils from './utils/GLUtils.js';

export class WebGLRenderer {
    constructor(elementId = null, width = 400, height = 400) {
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.canvas = null;

        if (elementId !== null) {
            this.canvas = document.getElementById(elementId);
        }

        if (this.canvas === null) {
            this.canvas = document.createElement('canvas');
            // this.canvas.setAttribute('id', elementId);
            document.body.appendChild(this.canvas);
        }
        this.gl = this.getGLContext();
        if (this.gl === null) {
            this.isWebGLSuported = false;
        } else {
            this.isWebGLSuported = true;
            this.gl.createArrayBufferWithData = GLUtils.createArrayBufferWithData;
            this.gl.createElementBufferWithData = GLUtils.createElementBufferWithData;
            this.gl.createTextureWithData = GLUtils.createTextureWithData;
            this.gl.makeProgram = GLUtils.makeProgram;
        }
        this.setStyle(width, height);
    }

    setStyle(width=400, height = 400, otherStyleStr = null) {
        if (this.canvas == null) {
            return;
        }

        this.canvasWidth = width * window.devicePixelRatio;
        this.canvasHeight = height * window.devicePixelRatio;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight ;

        if (otherStyleStr === null) {
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height+ 'px';
        } else {
            this.canvas.setAttribute('style', `width:${width}px; height: ${height}px; ${otherStyleStr};`);
        }
        this.canvas.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';

        this.centerX = this.canvasWidth / 2.0;
        this.centerY = this.canvasHeight / 2.0;
    }

    getGLContext() {
        let names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
        let context = null;
        for (var i = 0; i < names.length; ++i) {
            context = this.canvas.getContext(names[i]);
            if (context) {
                break;
            }
        }
        return context;
    }
}
