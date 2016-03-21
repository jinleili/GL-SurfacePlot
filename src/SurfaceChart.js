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
        this.paddingLR = 50;
        this.paddingTop = 50;
        this.paddingBottom = 50;

        if (width < 300 || height < 200) {
            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!dataArr || dataArr.length === 0) {
            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
        }

        this.renderer = new WebGLRenderer('surfacechart', width, height);
        this.renderer.canvas.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
        this.renderer.canvas.style.margin = '0px';
        this.domElement = this.renderer.canvas;
        this.gl = this.renderer.gl;

        this.width = this.renderer.canvasWidth;
        this.height = this.renderer.canvasHeight;

        this.dataSource = new SCDataSource(dataArr, this.width - this.paddingLR*2, this.height - this.paddingBottom - this.paddingTop);

        this.mvMatrix = Matrix4.identity();
        // Matrix4.scale(this.mvMatrix, [1/this.width, 1/this.height, 1/this.height]);
        Matrix4.scale(this.mvMatrix, [0.6, 0.6, 0.7]);

        // Matrix4.translate(this.mvMatrix, [this.paddingLR, this.height/2, 0]);
        Matrix4.rotate(this.mvMatrix, this.mvMatrix, 0.3, [1, 0, 0]);
        Matrix4.rotate(this.mvMatrix, this.mvMatrix, 0.75, [0, 1, 0]);

        // this.pMatrix = Matrix4.orthogonal(0, this.renderer.canvasWidth, this.renderer.canvasHeight, 0, -5000.0, 5000.0);
        //构建一个与图表坐标系一致的投影矩阵
        this.pMatrix = Matrix4.orthogonal(-this.renderer.centerX, this.renderer.centerX, -this.renderer.centerY, this.renderer.centerY, -5000.0, 5000.0);
        // this.pMatrix = Matrix4.perspective(45, this.width/this.height, 0.01, 5000);

        this.initProgram();

        //曲面绘制类
        this.surface  = new SCSurface(this.renderer.gl,  this.prg, this.dataSource);

        this.draw();
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

            this.gl.uniformMatrix4fv(this.prg.mvMatrix, false, this.mvMatrix);
            this.gl.uniformMatrix4fv(this.prg.pMatrix, false, this.pMatrix);
        }
    }

    /**
     * 绘制笔触
     */
    draw() {
        this.gl.clearColor(0.25, 0.25, 0.25, 1.0);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight);

        this.surface.draw();
    }

}