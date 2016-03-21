/**
 * Created by grenlight on 16/3/21.
 *
 * 管理图表上的标尺
 */

export class SCScale {
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
        let halfLineWidth = 0.5;
        let x = this.dataSource.scaleStartX;
        let maxZ = this.dataSource.colGap * this.dataSource.rowCount;
        console.log('maxZ:', maxZ);
        let offset = 0;
        let color = [1.0, 0.0, 0.0];
        for (let i=0; i<this.dataSource.scaleLabels.length; i++) {
            let y = (this.dataSource.scaleLabels[i] - this.dataSource.scaleCenterY) * this.dataSource.dataScale;
            let bottom = [x, y,  0];
            let top = [x, y,  maxZ];
            let topRight = [-x, y, maxZ];
            this.vertices.push(bottom[0]-halfLineWidth, bottom[1], bottom[2],
                bottom[0]+halfLineWidth, bottom[1], bottom[2],
                top[0]-halfLineWidth, top[1], top[2],
                top[0]+halfLineWidth, top[1], top[2],

                top[0]-halfLineWidth, top[1], top[2]-halfLineWidth,
                top[0]-halfLineWidth, top[1], top[2]+halfLineWidth,
                topRight[0], topRight[1], topRight[2]-halfLineWidth,
                topRight[0], topRight[1], topRight[2]+halfLineWidth);
            this.colors = this.colors.concat(color).concat(color).concat(color).concat(color).concat(color).concat(color).concat(color).concat(color);
            offset = i*8;
            this.indices.push(offset, offset+1, offset+2,
                offset+1, offset+2, offset+3,
                offset+4, offset+5, offset+6,
                offset+5, offset+6, offset+7);
        }
        console.log('scscale', this.vertices, this.colors);
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
}
