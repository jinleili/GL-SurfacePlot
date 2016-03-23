/**
 * Created by grenlight on 16/3/21.
 *
 * 管理图表上的标尺线及刻度
 */
import  { SCLabel } from './SCLabel.js';

export class SCRuler {
    constructor(gl, prg, dataSource) {
        this.gl = gl;
        this.prg = prg;
        this.dataSource = dataSource;
        this.generateScale();

        this.vetexBuffer = gl.createArrayBufferWithData(this.vertices);
        this.indexBuffer = gl.createElementBufferWithData(this.indices);
        this.colorBuffer = gl.createArrayBufferWithData(this.colors);
    }

    /**
     * 计算标尺的顶点
     * 
     * 标尺默认的状态是个顺时针旋转了 90 度的 L:
     * 一条标尺线由两条直线(四个三角形)组成
     */
    generateScale() {
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.labelList = [];
        let halfLineWidth = 1.0;
        let x = this.dataSource.scaleStartX;
        let maxZ = this.dataSource.zFar;
        let offset = 0;
        let color = this.dataSource.style.rgbFontColor;
        let y, bottom, top, topRight;
        for (let i=0; i<this.dataSource.scaleLabels.length; i++) {
            let label = this.dataSource.scaleLabels[i];
            y = (label - this.dataSource.scaleCenterY) * this.dataSource.dataScale;
            bottom = [x, y,  -maxZ];
            top = [x, y,  maxZ];
            topRight = [-x, y, maxZ];

            this.labelList.push({coord:bottom, label:label});
            this.vertices.push( bottom[0], bottom[1]+halfLineWidth, bottom[2],
                bottom[0], bottom[1]-halfLineWidth, bottom[2],
                top[0], top[1]+halfLineWidth, top[2],
                top[0], top[1]-halfLineWidth, top[2],
                topRight[0], topRight[1]+halfLineWidth, topRight[2],
                topRight[0], topRight[1]-halfLineWidth, topRight[2] );
            this.colors = this.colors.concat(color).concat(color).concat(color).concat(color).concat(color).concat(color);
            offset = i*6;
            this.indices.push(offset, offset+1, offset+2,
                offset+1,  offset+3, offset+2,
                offset+2, offset+3, offset+4,
                offset+3,  offset+5, offset+4);
        }
        //底部刻度
        bottom = [-x, y,  maxZ];
        top = [-x, y,  -maxZ];
        topRight = [x, y, -maxZ];
        this.vertices.push( bottom[0], bottom[1]+halfLineWidth, bottom[2],
            bottom[0], bottom[1]-halfLineWidth, bottom[2],
            top[0], top[1]+halfLineWidth, top[2],
            top[0], top[1]-halfLineWidth, top[2],
            topRight[0], topRight[1]+halfLineWidth, topRight[2],
            topRight[0], topRight[1]-halfLineWidth, topRight[2] );
        this.colors = this.colors.concat(color).concat(color).concat(color).concat(color).concat(color).concat(color);
        offset += 6;
        this.indices.push(offset, offset+1, offset+2,
            offset+1,  offset+3, offset+2,
            offset+2, offset+3, offset+4,
            offset+3,  offset+5, offset+4);

    }

    draw() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
        //这个地方要写在bind后,相当于获取并设置顶点数据
        this.gl.vertexAttribPointer(this.prg.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.prg.vertexPosition);

        this.gl.enableVertexAttribArray(this.prg.vertexColor);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.prg.vertexColor, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    drawLabel() {
        
    }

}
