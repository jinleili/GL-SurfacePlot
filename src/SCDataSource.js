/**
 * Created by grenlight on 16/3/19.
 */
import {Color} from './webgl/utils/Color.js';

export class  SCDataSource {
    constructor(dataArr, styleObj) {
        this.colorGroup = this._colors(styleObj.surfaceColors);

        this.style = styleObj;
        this.drawWidth = styleObj.drawWidth;
        this.drawHeight = styleObj.drawHeight;
        this.rowCount = dataArr.length;
        this._validateRowAndCol(this.rowCount);
        this.colCount = dataArr[0].length;
        this._validateRowAndCol(this.colCount);

        // 使图形呈现横向展开的状态
        this.isNeedSwapRowCol = false;
        if (this.rowCount > this.colCount) {
            this.isNeedSwapRowCol = true;
        }
        // 数据采样: 如果数据的行或列数超出了绘制区宽高,则按绘制区宽高值采样行列数据
        this.simpleRow = 1;
        this.simpleCol = 1;

        let factor = 1.5;//2* window.devicePixelRatio;
        let rowWidth = (this.isNeedSwapRowCol ? this.drawWidth : this.drawHeight)/factor;
        let colWidth = (this.isNeedSwapRowCol ?  this.drawHeight : this.drawWidth)/factor ;
        if (this.rowCount > rowWidth) {
            this.simpleRow = Math.floor( this.rowCount / rowWidth);
        }
        if (this.colCount > colWidth) {
            this.simpleCol = Math.floor(this.colCount / colWidth);
        }

        //参考线条数
        this.referenceLineCount = 6;
        //y 轴上的标尺数据集
        this.scaleLabels = [];
        // y 轴上的 数值<=>像素 缩放比
        this.dataScale = 0;

        //选第一个值做为起始参考值
        this.minValue = this.maxValue = parseFloat(dataArr[0][0]);
        this._validateDataType(this.minValue);
        this._formatData(dataArr);
    }

    _colors(colors) {
        let arr = [];
        for (let i=0; i<colors.length; i++) {
            arr.push(Color.hex2rgb(colors[i]));
        }
        return arr;
    }

    _validateRowAndCol(count) {
        if (count < 2) {
            throw new Error('SurfaceChart 至少需要两行两列数据 ');
        }
    }

    _validateDataType(data) {
        if (data === undefined) {
            throw new Error('SurfaceChart 需要的数据项必须是整数或浮点数');
        }
    }

    /**
     * 格式化数据
     *
     * 获取最小最大值及  y 轴上的 数值<=>像素 缩放比
     * @param dataArr
     * @private
     */
    _formatData(dataArr) {
        this.dataSource = [];

        for (let i=0; i<this.rowCount; i+=this.simpleRow) {
            let rowArr = dataArr[Math.floor(i)];
            let newRowArr = [];

            for (let j=0; j<this.colCount; j+=this.simpleCol) {
                let value = parseFloat(rowArr[Math.floor(j)]);
                this._validateDataType(value);
                if (value < this.minValue) {
                    this.minValue = value;
                } else if (value > this.maxValue) {
                    this.maxValue = value;
                }
                newRowArr.push(value);
            }
            this.dataSource.push(newRowArr);
        }
        //更新行列
        this.rowCount = this.dataSource.length;
        this.colCount = this.dataSource[0].length;

        //列间距不能取整, 会导致渲染超出绘制区
        this.colGap  = (this.drawWidth)/(this._getColCount()-1).toFixed(3);

        //生成刻度集合
        this._calculateScaleLabel();
        //转换数据点为屏幕顶点坐标
        this._generateVertices();
    }

    _getRowCount() {
        if (this.isNeedSwapRowCol) {
            return this.colCount;
        }
        return this.rowCount;
    }

    _getColCount() {
        if (this.isNeedSwapRowCol) {
            return this.rowCount;
        }
        return this.colCount;
    }

    /**
     * 转换数据点为屏幕顶点坐标
     * 顶点由内向外生成
     */
    _generateVertices() {
        this.vertices = [];
        this.colors = [];
        //z 轴远端坐标
        this.zFar = -(this.colGap*this.rowCount/2);
        //初始值给正, 避免后面赋值时的条件判断
        let z = this.zFar - this.colGap;

        for (let i=0; i<this.rowCount; i++) {
            z += this.colGap;
            let x =-(this.drawWidth/2.0) -this.colGap;
            let rowData = this.dataSource[i];
            for (let j=0; j<this.colCount; j++) {
                x += this.colGap;
                let yValue = rowData[j] ;
                if (typeof(yValue) !== 'number') {
                    console.log("invalid data: ", i, j, rowData);
                }
                this.vertices.push(x, (yValue - this.scaleCenterY) * this.dataScale, z);

                let color = this._calculateVertexColor(yValue);
                this.colors.push(color[0], color[1], color[2]);
            }
        }
        this._generateIndices();
        // console.log(this.minValue, this.maxValue);
        // console.log(this.scaleLabels);
    }

    _calculateVertexColor(yValue) {
        let pre = this.scaleLabels[0];
        for (let k=1; k<this.scaleLabels.length; k++) {
            let current = this.scaleLabels[k];
            if (yValue <= pre && yValue >=current) {
                return this.colorGroup[k-1];
            }
            pre = current;
        }
        return this.colorGroup[0];
    }
    
    _generateIndices() {
        this.indices = [];
        for (let i=1; i<this.rowCount; i++) {
            let rowTemp = i * this.colCount;
            for (let j=1; j<this.colCount; j++) {
                let current = rowTemp + j;
                let pre = current -1;
                let preRow = current - this.colCount;
                let preRowPre = preRow - 1;
                this.indices.push(preRowPre, preRow, pre,  preRow, current, pre);
            }
        }
    }
    
    /**
     * 生成刻度集合 及 应对屏幕中心线的刻度 scaleCenterY
     *
     * @private
     */
    _calculateScaleLabel() {
        let distance = Math.abs(this.maxValue - this.minValue) ;
        //为了图形美观,坐标上的刻度值应该做一定的舍入
        let scaleGap = distance /(this.referenceLineCount - 1).toFixed(2);
        scaleGap = this._calculateGap(scaleGap, 1);

        this.scaleCenterY = this.minValue + distance/2.0;
        //标尺 在 x 轴上的绘制起点
        this.scaleStartX = this.colCount/2 * (-this.colGap);

        let currentLabel = 0;
        if (this.maxValue > 0 && this.minValue < 0) {
            while  (currentLabel < this.maxValue) {
                currentLabel += scaleGap;
                this.scaleLabels.unshift(currentLabel);
            }
            currentLabel = 0;
        } else {
            currentLabel = this.maxValue;
        }
        this.scaleLabels.push(currentLabel);
        while  (currentLabel > this.minValue) {
            currentLabel -= scaleGap;
            this.scaleLabels.push(currentLabel);
        }
        this.dataScale = this.drawHeight /
            (Math.abs(this.scaleLabels[0]-this.scaleLabels[this.scaleLabels.length-1]));
        console.log('dataScale: ',this.drawHeight, this.dataScale, this.scaleCenterY, distance, scaleGap);
    }

    /**
     * 将 y 轴上的刻度值做舍入, 使数值看起来更漂亮
     * @param gap
     * @param limit
     * @returns {*}
     * @private
     */
    _calculateGap(gap, limit) {
        if (gap < limit) {
            return gap;
        } else {
            limit *= 10;
            let newValue = (gap/limit).toFixed(1) * limit;
            return this._calculateGap(newValue,  limit);
        }
    }

}