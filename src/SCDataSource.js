/**
 * Created by grenlight on 16/3/19.
 */
import {Color} from './webgl/utils/Color.js';

export class  SCDataSource {
    constructor(chartData, styleObj) {
        this.colorGroup = this._colors(styleObj.surfaceColors);

        this.style = styleObj;
        this.drawWidth = styleObj.drawWidth;
        this.drawHeight = styleObj.drawHeight;

        this.dataArr = this._parseData(chartData);
        this.rowCount = this.rowHeaders.length;
        this._validateRowAndCol(this.rowCount);
        this.colCount = this.colHeaders.length;
        this._validateRowAndCol(this.colCount);

        // 使图形呈现横向展开的状态
        this.isNeedSwapRowCol = false;
        if (this.rowCount > this.colCount) {
            this.isNeedSwapRowCol = true;
        }
        // 数据采样: 如果数据的行或列数超出了绘制区宽高,则按绘制区宽高值采样行列数据
        this.sampleRow = 1;
        this.sampleCol = 1;

        let factor = 2* window.devicePixelRatio;
        let rowWidth = (this.isNeedSwapRowCol ? this.drawWidth : this.drawHeight)/factor;
        let colWidth = (this.isNeedSwapRowCol ?  this.drawHeight : this.drawWidth)/factor ;
        if (this.rowCount > rowWidth) {
            this.sampleRow = Math.floor( this.rowCount / rowWidth);
        }
        if (this.colCount > colWidth) {
            this.sampleCol = Math.floor(this.colCount / colWidth);
        }

        //参考线条数
        this.referenceLineCount = 6;
        //y 轴上的标尺数据集
        this.scaleLabels = [];
        // y 轴上的 数值<=>像素 缩放比
        this.dataScale = 0;

        //选第一个值做为起始参考值
        this.minValue = this.maxValue = parseFloat(this.dataArr[0][0]);
        this._validateDataType(this.minValue);
        this._formatData(this.dataArr);
    }

    /**
     *  处理约定的格式: {colNameArr:["col0", ...], rows:[{rowName:"row0", data:[3, 0, ...]}, ...]}
     * @param jsonData
     * @returns {Array}
     * @private
     */
    _parseData(jsonData) {
        let rowArr = jsonData['rows'];
        let length = rowArr.length;
        this.rowHeaders = [];
        this.colHeaders = jsonData['colNameArr'];

        let  newArr = [];
        for (let i=0; i<length; i++) {
            let  item = rowArr[i];
            this.rowHeaders.push(item.rowName);
            newArr.push(item.data);
        }

        return newArr;
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
            throw new Error('SurfacePlot 至少需要 2 行 2 列数据 ');
        }
    }

    _validateDataType(data) {
        if (data === undefined) {
            throw new Error('SurfacePlot 需要的数据项必须是整数或浮点数');
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

        for (let i=0; i<this.rowCount; i+=this.sampleRow) {
            let rowArr = dataArr[Math.floor(i)];
            let newRowArr = [];
            for (let j=0; j<this.colCount; j+=this.sampleCol) {
                let value = parseFloat(rowArr[Math.floor(j)]);
                this._validateDataType(value);
                newRowArr.push(value);

                if (value < this.minValue) {
                    this.minValue = value;
                } else if (value > this.maxValue) {
                    this.maxValue = value;
                }
            }
            this.dataSource.push(newRowArr);
        }
        //更新行列
        this.rowCount = this.dataSource.length;
        this.colCount = this.dataSource[0].length;
        //列间距不能取整, 会导致渲染超出绘制区
        this.colGap  = parseFloat((this.drawWidth/(this._getColCount()-1)).toFixed(4));

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
        this.indices = [];

        this.colors = [];
        //z 轴远端坐标
        this.zFar = -(this.colGap*(this.rowCount-1)/2);

        //初始值给正, 避免后面赋值时的条件判断
        let z = this.zFar - this.colGap;

        let maxRowIndex = (this.rowCount-1);
        for (let i=maxRowIndex; i >= 0; i--) {
            z += this.colGap;
            let x =this.scaleStartX -this.colGap;
            let rowData = this.dataSource[i];
            let rowTemp = (maxRowIndex - i) * this.colCount;

            for (let j=0; j<this.colCount; j++) {
                x += this.colGap;
                let yValue = rowData[j] ;
                if (typeof(yValue) !== 'number') {
                    console.log("invalid data: ", i, j, rowData);
                }
                this.vertices.push(x, (yValue - this.scaleCenterY) * this.dataScale, z);

                let color = this._calculateVertexColor(yValue);
                this.colors.push(color[0], color[1], color[2]);

                if (rowTemp > 0 && j >=1) {
                    let current = rowTemp + j;
                    let pre = current -1;
                    let preRow = current - this.colCount;
                    let preRowPre = preRow - 1;
                    this.indices.push(preRowPre, preRow, pre,  preRow, current, pre);
                }
            }
        }
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
    
    /**
     * 生成刻度集合 及 应对屏幕中心线的刻度 scaleCenterY
     *
     * @private
     */
    _calculateScaleLabel() {
        let distance = this.maxValue - this.minValue ;
        //为了图形美观,坐标上的刻度值应该做一定的舍入
        let scaleGap = Math.abs(distance) /(this.referenceLineCount - 1).toFixed(2);
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

    /**
     * 通过刻度平面与三角形边的交点做曲面细分
     */
    _subdividingSurface() {

    }

    /**
     * 求刻度平面与三角形边的交点
     * 除 3 个顶点之外, 只要与其中一条边有交点, 定与另两条边中的其中一条也有相交
     *
     * 设曲面上的 4 个构成的最小曲面元的坐标点分别为 p00, p01, p10, p11, 则有
     * p00, p01 && p10, p11 在 x 轴平面,
     * p00, p10 && p01, p11在 z 平面
     * 角 [p01, p00, p10] && [p10, p11, p01]是直角
     *
     * 要计算 y 刻度平面 s 与线段 p00, p10 的交点:
     * 先检查 s 是否在p00.y 与 p10.y 的区间 L 内, 在则计算 s.y 离 p00.y 的距离与 L 的比: r = s.y  / (p00.y - p10.y)
     * 交点 = p00 + (p10-p00) * r
     *
     */
    _calCrossoverPoint(planeY, pStart, pEnd) {
        if ((planeY >= pStart[1] && planeY <= pEnd[1]) ||
            (planeY <= pStart[1] && planeY >= pEnd[1])) {
            let rate = (planeY - pStart[1]) / (pEnd[1] - pStart[1]);
            let cpZ = (pEnd[2] - pStart[2]) * rate;
            return [pStart[0], planeY, cpZ];
        }
        return null;
    }

}


class  CrossoverPoint {
    /**
     *
     * @param owner
     * @param color
     * @param neighbor 邻居
     * @param neighborType {number} 邻居类型 0=原三角形顶点, 1=另一个交点
     */
    constructor(owner, color, neighbor, neighborType) {

    }

    setNeighbor() {

    }
}
