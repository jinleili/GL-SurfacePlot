/**
 * Created by grenlight on 16/3/17.
 */

import { SCDataSource } from './SCDataSource.js';
import { SCSurface } from './SCSurface.js';
import { pixelVS, pixelFS } from './webgl/shaders/shaders.js';
import { WebGLRenderer } from './webgl/WebGLRenderer.js';
import { Matrix4 } from './webgl/math/Matrix4.js';

export class SurfaceChart {
    constructor(dataArr,  width = 600, height = 500) {
        this.width = width;
        this.height = height;
        this.paddingLR = 50;
        this.paddingTop = 50;
        this.paddingBottom = 50;

        if (width < 300 || height < 200) {
            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!dataArr || dataArr.length === 0) {
            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
        }
        this.dataSource = new SCDataSource(dataArr, this.width - this.paddingLR*2, this.height - this.paddingBottom - this.paddingTop);

        this.renderer = new WebGLRenderer(null, this.width, this.height);
        this.renderer.view.setAttribute('style', 'margin:0px; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); width:' + width + 'px; height: ' + height + 'px');
        this.domElement = this.renderer.view;
        //曲面绘制类
        this.surface  = new SCSurface(this.renderer.gl, this.dataSource);

        this.initProgram();
    }

    /**
     *  初始化着色器
     */
    initProgram() {
        this.prg = this.gl.makeProgram(pixelVS, pixelFS);
        if (this.prg === null) {
            console.log('着色器加载失败');
        } else {
            this.prg.setAttribLocations(['vertexPosition', 'vertexColor']);
            this.prg.setUniformLocations(['pMatrix', 'mvMatrix']);
            this.mvMatrix = Matrix4.identity();
            //Matrix4.scale(this.mvMatrix, [this.renderer.canvasWidth, this.renderer.canvasHeight, 1]);
            this.pMatrix = Matrix4.orthogonal(0, this.renderer.canvasWidth, this.renderer.canvasHeight, 0, -5000.0, 5000.0);
            this.gl.uniformMatrix4fv(this.prg.mvMatrix, false, this.mvMatrix);
            this.gl.uniformMatrix4fv(this.prg.pMatrix, false, this.pMatrix);
        }
    }

    /**
     * 绘制笔触
     */
    draw() {
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight);

        this.surface.draw();
    }

}