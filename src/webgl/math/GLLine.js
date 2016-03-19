/**
 * Created by grenlight on 16/1/31.
 */
import {GLPoint} from './GLPoint.js';

export class GLLine {
    /**
     * 求直线交点
     * 两向量叉乘==两向量构成的平行四边形(以两向量为邻边)的面积
     * @param {GLPoint} a
     * @param {GLPoint} b
     * @param {GLPoint} c
     * @param {GLPoint} d
     * @returns {GLPoint}
     */
    static  intersectionPoint(a, b, c, d){
        // 三角形abc 面积的2倍
        var area_abc = (a[0] - c[0]) * (b[1] - c[1]) - (a[1] - c[1]) * (b[0] - c[0]);
        // 三角形abd 面积的2倍
        var area_abd = (a[0] - d[0]) * (b[1] - d[1]) - (a[1] - d[1]) * (b[0] - d[0]);

        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,当作不相交处理);
        if ( area_abc*area_abd>=0 ) {
            return null;
        }

        // 三角形cda 面积的2倍
        var area_cda = (c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0]);
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        var area_cdb = area_cda + area_abc - area_abd ;
        if (  area_cda * area_cdb >= 0 ) {
            return null;
        }

        //计算交点坐标
        var t = area_cda / ( area_abd- area_abc );
        var dx= t*(b[0] - a[0]),
            dy= t*(b[1] - a[1]);
        return new GLPoint(a[0] + dx , a[1] + dy );
    }

    //明确知道相交的情况下使用,减少了两次相乘判断
    static  intersectionPoint2(a, b, c, d){
        var area_abc = (a[0] - c[0]) * (b[1] - c[1]) - (a[1] - c[1]) * (b[0] - c[0]);
        var area_abd = (a[0] - d[0]) * (b[1] - d[1]) - (a[1] - d[1]) * (b[0] - d[0]);
        var area_cda = (c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0]);
        var t = area_cda / ( area_abd- area_abc );

        return  [a[0] + t*(b[0] - a[0]), a[1] + t*(b[1] - a[1])];
    }

    /**
     * 点与线的关系:比较以直线起点为原点的直线斜率与原点到点的直线斜率
     * 0 在线上
     * 1 在上方
     * -1 在下方
     */
    static dotAndLineRelationship(line, dot) {
        let sloteLine = (line[1][1] - line[0][1])/(line[1][0] - line[0][0]);
        let sloteDot =  (dot[1] - line[0][1])/(dot[0] - line[0][0]);
        if (sloteDot > sloteLine) {
            return 1;
        } else if (sloteDot < sloteLine) {
            return -1;
        } else {
            return 0;
        }
    }
}
