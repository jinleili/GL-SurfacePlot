/**
 * Created by grenlight on 16/3/17.
 */

import { SCDataSource } from './SCDataSource.js';
import { SCSurface } from './SCSurface.js';
import { SCRuler } from './SCRuler.js';
import { SCStyle } from './SCStyle.js';
import { SCDomElement } from './SCDomElement.js';

import { pixelVS, pixelFS } from './webgl/shaders/shaders.js';
import { WebGLRenderer } from './webgl/WebGLRenderer.js';
import { Matrix4 } from './webgl/math/Matrix4.js';
import { Vector4 } from './webgl/math/Vector4.js';

export class SurfaceChart {
    constructor(dataArr,  params) {
        if (params.width < 300 || params.height < 200) {
            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!dataArr || dataArr.length === 0) {
            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
        }

        this.style = new SCStyle(params);

        this.renderer = new WebGLRenderer();
        this.renderer.setStyle( params.width, params.height, `margin:0px; position:absolute; z-index:0;`);
        this.gl = this.renderer.gl;

        this.style.canvasHeight = this.renderer.canvasHeight;
        this.style.canvasWidth = this.renderer.canvasWidth;

        this.domElementObj = new SCDomElement(this.style, params.title);
        this.domElement = this.domElementObj.panel;
        this.domElement.appendChild(this.renderer.canvas);

        this.dataSource = new SCDataSource(dataArr, this.style);

        this.mvMatrix = Matrix4.identity();
        let offsetZ = -this.style.canvasHeight+this.dataSource.zFar*2.5;
        Matrix4.translate(this.mvMatrix, [30,  0.0, offsetZ]);
        Matrix4.rotate(this.mvMatrix, this.mvMatrix, 0.35, [1, 0, 0]);
        Matrix4.rotate(this.mvMatrix, this.mvMatrix, -30/180*Math.PI, [0, 1, 0]);

        //构建一个与图表坐标系一致的投影矩阵
        // this.pMatrix = Matrix4.orthogonal(-this.renderer.centerX, this.renderer.centerX, -this.renderer.centerY, this.renderer.centerY, -5000.0, 5000.0);
        this.pMatrix = Matrix4.perspective(45/180*Math.PI, this.style.canvasWidth/ this.style.canvasHeight, 0.1, 50000);

        this.initProgram();

        //曲面绘制类
        this.surface  = new SCSurface(this.renderer.gl,  this.prg, this.dataSource);
        //标尺线
        this.ruler = new SCRuler(this.renderer.gl, this.prg, this.dataSource);
        this.draw();

        this.domElementObj.showLabels(this.ruler.labelList, this.mvMatrix);
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
     * 绘制
     */
    draw() {
        this.gl.viewport(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        let color = this.style.rgbBackgroundColor;
        this.gl.clearColor(color[0], color[1], color[2], 1.0);

        //透明度混合
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.ruler.draw();
        this.surface.draw();
    }

}