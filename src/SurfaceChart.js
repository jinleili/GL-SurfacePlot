/**
 * Created by grenlight on 16/3/17.
 */

export class SurfaceChart {
    constructor(container, dataArr,  rowCount = 0, colCount = 0) {
        this.parentElement = container;
        this.width = this.parentElement.offsetWidth;
        this.height = this.parentElement.offsetHeight;

        if (this.width < 300 || this.height < 200) {
            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!dataArr || dataArr.length === 0) {
            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
        }
        if (rowCount < 2 || colCount < 2) {
            throw new Error('SurfaceChart 至少需要两行两列数据 ');
        }
        //参考线条数
        this.referenceLineCount = 6;
        //y 轴上的标尺数据集
        this.scaleLabels = [];
        // y 轴上的 数值<=>像素 缩放比
        this.dataScale = 0;

        //选第一个值做为起始参考值
        this.minValue = this.maxValue = parseFloat(dataArr[0]);
        this._validateDataType(this.minValue);
        this._formatData(dataArr);
    }

    _validateDataType(data) {
        if (data === undefined) {
            //console.log(data);
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

        for (let i=1; i<dataArr.length; i++) {
            let value = parseFloat(dataArr[i]);
            this._validateDataType(value);
            if (value < this.minValue) {
                this.minValue = value;
            } else if (value > this.maxValue) {
                this.maxValue = value;
            }
            this.dataSource.push(value);
        }

        let distance = Math.abs(this.maxValue - this.minValue) ;
        //为了图形美观,坐标上的刻度值应该做一定的舍入
        let gap = distance /(this.referenceLineCount - 1).toFixed(1);
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
        this.dataScale = (this.height -100) /
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