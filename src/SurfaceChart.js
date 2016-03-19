/**
 * Created by grenlight on 16/3/17.
 */

import  { ChartCanvas } from './ChartCanvas.js';
import { SCDataSource } from './SCDataSource.js';

export class SurfaceChart {
    constructor(dataArr,  width = 600, height = 500) {
        this.width = width;
        this.height = height;
        this.paddingLR = 50;
        this.paddingTop = 50;
        this.paddingBottom = 50;

        if (width < 300 || height < 200) {
            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
        }
        if (!dataArr || dataArr.length === 0) {
            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
        }
        
        this.canvas = new ChartCanvas(width, height);
        this.domElement = this.canvas.renderer.view;

    }

}