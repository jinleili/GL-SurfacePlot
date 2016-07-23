/**
 * Created by grenlight on 16/3/17.
 */

import { SCDataSource } from './SCDataSource.js';
import { SCSurface } from './SCSurface.js';
import { SCRuler } from './SCRuler.js';
import { SCStyle } from './SCStyle.js';
import { SCDomElement } from './SCDomElement.js';

import { pixelVS, pixelFS } from './shaders.js';
import { WebGLRenderer } from './webgl/WebGLRenderer.js';
import { Matrix4 } from './webgl/math/Matrix4.js';

export class SurfacePlot {
    constructor(chartData,  params) {
        if (params.width < 300 || params.height < 200) {
            throw new Error('SurfacePlot 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!chartData || !chartData['rows'] || chartData['rows'].length === 0) {
            throw new Error('SurfacePlot 需要有效数组做为初始化参数');
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

        this.dataSource = new SCDataSource(chartData, this.style);

        this.mvMatrix = Matrix4.identity();
        let rotateY = -20, rotateX = 20;
        if (this.dataSource.isNeedSwapRowCol) {
            rotateY = - 90 - 20;
        }

        /**
         * 基于曲面在 3D 空间的深度调整平移量
         * zFar 太小,表明行列比太大, 此时纵深太小,就没有必要再在 x 轴上做旋转了
         */
        let zFar = 0;
        if (this.dataSource.isNeedSwapRowCol) {
            zFar = Math.abs(this.dataSource.scaleStartX)*2.5;
            if (zFar < 420) {
                zFar = 420;
            }
        } else {
            zFar = Math.abs(this.dataSource.zFar)*2.5;
            if (zFar < 450) {
                zFar = 450;
            }
        }
        
        let offsetZ = -this.style.canvasHeight-zFar;
        Matrix4.translate(this.mvMatrix, [-30,  -10.0, offsetZ]);
        
        Matrix4.rotate(this.mvMatrix, this.mvMatrix, rotateX/180*Math.PI, [1, 0, 0]);
        Matrix4.rotate(this.mvMatrix, this.mvMatrix, rotateY/180*Math.PI, [0, 1, 0]);

        //构建一个与图表坐标系一致的投影矩阵

        if (this.style.usePerspective === true) {
            this.pMatrix = Matrix4.perspective(45/180*Math.PI, this.style.canvasWidth/ this.style.canvasHeight, 0.1, 50000);
        } else {
            this.pMatrix = Matrix4.orthogonal(-this.renderer.canvasWidth, this.renderer.canvasWidth, -this.renderer.canvasHeight, this.renderer.canvasHeight, -5000.0, 5000.0);
        }

        this.initProgram();

        //曲面绘制类
        this.surface  = new SCSurface(this.renderer.gl,  this.prg, this.dataSource);
        //标尺线及刻度
        if (this.style.isNeedShowScale === true) {
            this.ruler = new SCRuler(this.renderer.gl, this.prg, this.dataSource);
            let finalMatrix = Matrix4.multiplyMatrices(this.pMatrix, this.mvMatrix);
            this.domElementObj.showYLabels(this.ruler.yLabelList, finalMatrix);
            let zList = this.ruler.zLabelList;
            let xList = this.ruler.xLabelList;
            if (this.dataSource.isNeedSwapRowCol === true) {
                zList = this.ruler.xLabelList;
                xList = this.ruler.zLabelList;
            }
            this.domElementObj.showZLabels(zList, finalMatrix);
            this.domElementObj.showXLabels(xList, finalMatrix);
        }

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
     * 绘制
     */
    draw() {
        this.gl.viewport(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        let color = this.style.rgbBackgroundColor;
        this.gl.clearColor(color[0], color[1], color[2], 1.0);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        if (this.ruler) {
            this.ruler.draw();
        }
        this.surface.draw();
    }

}

window.SurfacePlot = SurfacePlot;