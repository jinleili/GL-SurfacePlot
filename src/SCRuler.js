/**
 * Created by grenlight on 16/3/21.
 *
 * 管理图表上的标尺线及刻度
 */
let halfLineWidth = 0.5;
let scaleGap = 35* window.devicePixelRatio;
let scaleLength = 10;

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
     * 计算标尺线及刻度线的顶点
     * 
     * 标尺默认的状态是个顺时针旋转了 90 度的 L:
     */
    generateScale() {
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.yLabelList = [];
        this.xLabelList = [];
        this.zLabelList = [];

        let x = this.dataSource.scaleStartX;
        x = Math.abs(x)<35 ? -35: x;

        // 当行列数量的比值太大时, zFar 就会太小了
        let maxZ = this.dataSource.zFar;
        maxZ = Math.abs(maxZ)<35 ? -35: maxZ;

        let offset = 0;
        let y, bottom, top, topRight;
        for (let i=0; i<this.dataSource.scaleLabels.length; i++) {
            let label = this.dataSource.scaleLabels[i];
            y = (label - this.dataSource.scaleCenterY) * this.dataSource.dataScale;
            if (this.dataSource.isNeedSwapRowCol) {
                bottom = [-x, y,  -maxZ];
                top = [x, y,  -maxZ];
                topRight = [x, y, maxZ];
            } else {
                bottom = [x, y,  -maxZ];
                top = [x, y,  maxZ];
                topRight = [-x, y, maxZ];
            }

            this.yLabelList.push({coord:bottom, label:label});
            offset = i*3;
            this._concatVertices(bottom, top, topRight, offset);
        }
        offset += 3;

        //底部标尺线
        if (this.dataSource.isNeedSwapRowCol) {
            bottom = [-x, y,  -maxZ];
            top = [-x, y,  maxZ];
            topRight = [x, y, maxZ];
        } else {
            bottom = [-x, y,  maxZ];
            top = [-x, y,  -maxZ];
            topRight = [x, y, -maxZ];
        }
        this._concatVertices(bottom, top, topRight, offset);

        // x 刻度线
      this._generateScaleX(x, y, -maxZ, offset+3);
    }

    _generateScaleX(startX, startY, startZ, offset) {
        let distance  = this.dataSource.colGap*this.dataSource.colCount;
        let maxCountX = distance / 45;

        let newStartZ = startZ;
        if (this.dataSource.isNeedSwapRowCol === true) {
            newStartZ = (-newStartZ) - scaleLength;
        }
        let jumpX = 1;
        if (maxCountX < this.dataSource.colHeaders.length) {
            jumpX =  (Math.ceil(this.dataSource.colHeaders.length/maxCountX));
        }
        let newCount = this.dataSource.colHeaders.length /jumpX;
        let stepX = distance/ newCount;
        let color = this.dataSource.style.rgbScaleColor;

        let offsetX = 0;
        for (let i=0; i<newCount; i++) {
            offsetX = stepX*(i+0.5);
            let near = [startX+offsetX, startY, newStartZ+scaleLength];
            let far = [startX+offsetX, startY, newStartZ];

            this._concatVertices2(near, far, offset);
            offset += 2;

            this.xLabelList.push({coord:near, label:this.dataSource.colHeaders[i*jumpX]});
        }
        this._generateScaleZ(-startX, startY, startZ, offset);
    }

    _generateScaleZ(startX, startY, startZ, offset) {
        let distance  = Math.abs(this.dataSource.zFar)*2;
        let maxCountZ = distance / scaleGap;
        let jumpZ = 1;
        if (maxCountZ < this.dataSource.rowHeaders.length) {
            jumpZ =  (Math.ceil(this.dataSource.rowHeaders.length/maxCountZ));
        }
        let newCount = Math.ceil(this.dataSource.rowHeaders.length /jumpZ);
        let stepZ = distance / newCount;

        let offsetZ = 0;
        for (let i=0; i<newCount; i++) {
            offsetZ = stepZ*(i+0.5);
            let left = [startX, startY, startZ-offsetZ];
            let right = [startX+scaleLength, startY, startZ-offsetZ];
            this._concatVertices2(left, right, offset);
            offset += 2;
            this.zLabelList.push({coord:right, label:this.dataSource.rowHeaders[i*jumpZ]});
        }
    }
    
    _concatVertices(bottom, top, topRight, offset) {
        let color = this.dataSource.style.rgbScaleColor;
        this.vertices.push( bottom[0], bottom[1], bottom[2],
            top[0], top[1], top[2],
            topRight[0], topRight[1], topRight[2] );
        this.colors = this.colors.concat(color).concat(color).concat(color).concat(color);
        this.indices.push(offset, offset+1, offset+1, offset+2);
    }

    _concatVertices2(bottom, top,  offset) {
        let color = this.dataSource.style.rgbScaleColor;
        this.vertices.push( bottom[0], bottom[1], bottom[2],
            top[0], top[1], top[2]);
        this.colors = this.colors.concat(color).concat(color);
        this.indices.push(offset, offset+1);
    }

    /**
     * 画一条水平或垂直的立方线
     * @param firstP
     * @param secondP
     * @param isHorizontal
     * @param color
     * @param offset
     * @returns {Array}
     * @private
     */

    _generateBoxLineInfo(firstP, secondP, isHorizontal, color, offset) {
        let flt, flb, frt, frb, slt, slb, srt, srb;
        if (isHorizontal) {
            flt = [firstP[0],firstP[1]-halfLineWidth, firstP[2]-halfLineWidth];
            flb = [firstP[0],firstP[1]+halfLineWidth, firstP[2]-halfLineWidth];
            frt = [firstP[0],firstP[1]-halfLineWidth, firstP[2]+halfLineWidth];
            frb = [firstP[0],firstP[1]+halfLineWidth, firstP[2]+halfLineWidth];

            slt = [secondP[0],secondP[1]-halfLineWidth, secondP[2]-halfLineWidth];
            slb = [secondP[0],secondP[1]+halfLineWidth, secondP[2]-halfLineWidth];
            srt = [secondP[0],secondP[1]-halfLineWidth, secondP[2] + halfLineWidth];
            srb = [secondP[0],secondP[1]+halfLineWidth, secondP[2] + halfLineWidth];
        } else {
            flt = [firstP[0]-halfLineWidth,firstP[1]-halfLineWidth, firstP[2]];
            flb = [firstP[0]-halfLineWidth,firstP[1]+halfLineWidth, firstP[2]];
            frt = [firstP[0]+halfLineWidth,firstP[1]-halfLineWidth, firstP[2]];
            frb = [firstP[0]+halfLineWidth,firstP[1]+halfLineWidth, firstP[2]];

            slt = [secondP[0]-halfLineWidth,secondP[1]-halfLineWidth, secondP[2]];
            slb = [secondP[0]-halfLineWidth,secondP[1]+halfLineWidth, secondP[2]];
            srt = [secondP[0]+halfLineWidth,secondP[1]-halfLineWidth, secondP[2]];
            srb = [secondP[0]+halfLineWidth,secondP[1]+halfLineWidth, secondP[2]];
        }

        let vertices = [], colors = [], indices = [];
         vertices = vertices.concat(flt).concat(flb).concat(frt).concat(frb).concat(slt).concat(slb).concat(srt).concat(srb);
        colors = colors.concat(color).concat(color).concat(color).concat(color).concat(color).concat(color).concat(color).concat(color);
        indices.push(offset+4, offset+5, offset,
            offset+5,  offset+1, offset,
            offset+4, offset, offset+6,
            offset,  offset+2, offset+6,
            offset+2, offset+3, offset+6,
            offset+3, offset+7, offset+6,
            offset+3, offset+1, offset+7,
            offset+1, offset+5, offset+7);

        this.vertices = this.vertices.concat(vertices);
        this.colors = this.colors.concat(colors);
        this.indices = this.indices.concat(indices);
        offset += 8;
        return offset;
    }

    draw() {
        this.gl.lineWidth(2);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
        //这个地方要写在bind后,相当于获取并设置顶点数据
        this.gl.vertexAttribPointer(this.prg.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.prg.vertexPosition);

        this.gl.enableVertexAttribArray(this.prg.vertexColor);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.prg.vertexColor, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.LINES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }
}
