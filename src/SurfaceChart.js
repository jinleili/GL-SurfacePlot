/**
 * Created by grenlight on 16/3/17.
 */

export class SurfaceChart {
    constructor(container, dataArr,  rowCount = 0, colCount = 0) {
        this.parentElement = container;
        this.width = this.parentElement.style.width;
        this.height = this.parentElement.style.height;

        if (this.width < 300 || this.height < 200) {
            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!dataArr || dataArr.length === 0) {
            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
        }
        if (rowCount < 2 || colCount < 2) {
            throw new Error('SurfaceChart 至少需要两行两列数据 ');
        }
        //选第一个值做为起始参考值
        this.minValue = this.maxValue = parseFloat(dataArr[0]);
        if (!this.minValue) {
            this._throwDataTypeError();
        }
        this._formatData(dataArr);
    }

    _throwDataTypeError() {
        throw new Error('SurfaceChart 需要的数据项必须是整数或浮点数');
    }

    /**
     * 格式化数据
     *
     * 获取最小最大值及 x, y 轴上的 数值<=>像素 缩放比
     * @param dataArr
     * @private
     */
    _formatData(dataArr) {
        this.dataSource = [];

        for (let i=1; i<dataArr.length; i++) {
            let value = parseFloat(dataArr[i]);
            if (!value) {
                this._throwDataTypeError();
            }
            if (value < this.minValue) {
                this.minValue = value;
            } else if (value > this.maxValue) {
                this.maxValue = value;
            }
            this.dataSource.push(value);
        }
        ////为了图形美观,坐标上的最小最大值应该做一定的延展
        //this.minValue = Math.floor(this.minValue);
        //this.maxValue = Math.ceil(this.maxValue);
        let distance = Math.abs(this.maxValue - this.minValue) ;

        this.minValue -= extensionValue;
        this.maxValue += extensionValue;
    }
}