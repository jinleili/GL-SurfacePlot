/**
 * Created by grenlight on 16/3/17.
 */

import { SCDataSource } from './SCDataSource.js';
import { WebGLRenderer } from './webgl/WebGLRenderer.js';
import { SCSurface } from './SCSurface.js';

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
        this.dataSource = new SCDataSource(dataArr, this.width - this.paddingLR*2, this.height - this.paddingBottom - this.paddingTop);

        this.renderer = new WebGLRenderer(null, this.width, this.height);
        this.renderer.view.setAttribute('style', 'margin:0px; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); width:' + width + 'px; height: ' + height + 'px');
        this.domElement = this.renderer.view;
        //曲面绘制类
        this.surface  = new SCSurface(this.dataSource);
    }

}