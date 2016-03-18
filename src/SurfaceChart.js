/**
 * Created by grenlight on 16/3/17.
 */

import  { ChartCanvas } from './ChartCanvas.js';

export class SurfaceChart {
    constructor(dataArr,  width = 600, height = 500) {
        this.width = width;
        this.height = height;
        this.paddingLR = 50;
        this.paddingTop = 50;
        this.paddingBottom = 50;

        if (this.width < 300 || this.height < 200) {
            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!dataArr || dataArr.length === 0) {
            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
        }
        
        this.canvas = new ChartCanvas(width, height);
        this.domElement = this.canvas.renderer.view;

        this.rowCount = dataArr.length;
        this._validateRowAndCol(this.rowCount);
        this.colCount = dataArr[0].length;
        this._validateRowAndCol(this.colCount);

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

        for (let i=0; i<this.rowCount; i++) {
            let rowArr = dataArr[i];
            let newRowArr = [];

            for (let j=0; j<this.colCount; j++) {
                let value = parseFloat(rowArr[j]);
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

        //生成刻度集合
        this._calculateScaleLabel();
        //转换数据点为屏幕顶点坐标
        this._generateVertices();
    }

    /**
     * 转换数据点为屏幕顶点坐标
     */
    _generateVertices() {
        this.vertices = [];
        let colGap = (this.width - this.paddingLR*2)/(this.colCount-1);
        //初始值给负, 避免后面赋值时的条件判断
        let z = -colGap;
        for (let i=0; i<this.rowCount; i++) {
            z += colGap;

            let x = -colGap;
            let rowData = this.dataSource[i];
            for (let j=0; j<this.colCount; j++) {
                x += colGap;
                this.vertices.push(x, rowData[j] * this.dataScale, z);
            }
        }
        console.log(this.vertices);
    }
    /**
     * 生成刻度集合
     * @private
     */
    _calculateScaleLabel() {
        let distance = Math.abs(this.maxValue - this.minValue) ;
        //为了图形美观,坐标上的刻度值应该做一定的舍入
        let gap = distance /(this.referenceLineCount - 1).toFixed(2);
        gap = this._calculateGap(gap, 1);

        let currentLabel = 0;
        if (this.maxValue > 0 && this.minValue < 0) {
            while  (currentLabel < this.maxValue) {
                currentLabel += gap;
                this.scaleLabels.unshift(currentLabel);
            }
            currentLabel = 0;
        } else {
            currentLabel = this.maxValue;
        }
        this.scaleLabels.push(currentLabel);
        while  (currentLabel > this.minValue) {
            currentLabel -= gap;
            this.scaleLabels.push(currentLabel);
        }
        this.dataScale = (this.height - this.paddingBottom - this.paddingTop) /
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

}