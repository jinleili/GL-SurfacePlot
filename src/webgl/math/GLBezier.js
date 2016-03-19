/**
 * Created by grenlight on 16/1/28.
 *
 *通过 bezier 曲线来计算细分曲面上顶点的位置，
 *先将曲线上的点存在字典里，拟合 x 轴坐标来计算在曲线上 y 轴的坐标
 *
 *想过：通过某个轴上的点直接算出曲线上的坐标，但是 n 多点的计算会有性能问题。
 *
 *这样计算曲线上的点的集合：当 x, y 上的点距离上一个点都小于0.5时，则抛弃。
 */

export class GLBezier {
    constructor() {
    }

    /**
     *生成表达曲线的坐标点集
     *有时，可能并不需要太高的曲线精度
     *
     *@param  {Number} precision 0~1
     */
    generateCoords(points, distance=0, precision=0.5) {
        //由于这个应用内最多只有2个控制点的曲线,为降低采样，先计算端点内的距离L，然后定义步长为 1/(L*precision)
        let pStart = points[0];
        let pEnd = points[points.length -1];
        if (distance === 0) {
            distance = GLBezier.getDistance(pStart, pEnd);
        }

        let totalStep = Math.floor(distance * precision);
        if (totalStep <= 1) {
            let distanceX = pStart[0] - pEnd[0];
            let distanceY = pStart[1] - pEnd[1];
            return [{coords:pEnd,
                slope:Math.atan2(distanceY, distanceX),
                distance:Math.sqrt(distanceX*distanceX + distanceY*distanceY) }];
        }

        this.stepLength = 1.0 / totalStep;

        let bezierPoints = [];
        let adgeArr = this.calculateControlEdge(points);
        let lastPoint = points[0];
        for (let i = 0; i < totalStep; i ++) {
            var ps = this.calculateReferenceLine(points, adgeArr, i);
            //计算绘制点的斜边长 及 与X轴的夹角
            var lengthX = ps[1][0] - ps[0][0];
            var lengthY = ps[1][1] - ps[0][1];
            let drawX = ps[0][0] + lengthX * ((i+1)*this.stepLength);
            let drawY = ps[0][1] + lengthY * ((i+1)*this.stepLength);

            let distanceX = drawX - lastPoint[0];
            let distanceY = drawY - lastPoint[1];

            /**
             * 减少画线时不必要的的顶点
             * 经测试发现这个处理没有必要,因为前面的precision精度控制已经保证了点的密集度
             */
            if (Math.abs(distanceX)>1 || Math.abs(distanceY)>1) {
                lastPoint = [drawX, drawY];
                bezierPoints.push({coords: [drawX, drawY],
                    slope:Math.atan2(distanceY, distanceX),
                    distance:Math.sqrt(distanceX*distanceX + distanceY*distanceY) });
            }
            //console.log('calculateReferenceLine:', ps[0], ps[1]);
            //console.log('coords:', drawX, drawY);
            //console.log('---------');
        }
        return bezierPoints;
    }

    //计算参考线,
    calculateReferenceLine(ps, adges, currentStep) {
        let arr = [];
        for (var j = 0; j < (ps.length - 1); j++) {
            var cx = ps[j][0] + adges[j].deltaX * currentStep;
            var cy = ps[j][1] + adges[j].deltaY * currentStep;
            arr.push([cx, cy]);
        }
        if (arr.length === 2) {
            return arr;
        } else {
            let edgeList = this.calculateControlEdge(arr);
            return this.calculateReferenceLine(arr, edgeList, currentStep);
        }
    }

    //计算控制多边形的边信息及总的边长
    calculateControlEdge(points) {
        let adgeArr = [];
        for (let i = 1; i < points.length; i++) {
            var lengthX = points[i][0] - points[i - 1][0];
            var lengthY = points[i][1] - points[i - 1][1];
            var adge = this.edge();
            adge.length = Math.sqrt(lengthX * lengthX + lengthY * lengthY);
            adge.angleSin = lengthY / adge.length;
            adge.angleCos = lengthX / adge.length;
            //预先计算好基于步长的各边的x,y的增量
            adge.calculateDelta(this.stepLength);
            adgeArr.push(adge);
        }
        return adgeArr;
    }

    //定义边
    edge() {
        return {
            length: 0,
            angleCos: 0,
            angleSin: 0,
            deltaX: 0, //x,y的增量
            deltaY: 0,
            calculateDelta: function(step) {
                this.deltaX = step * this.length * this.angleCos;
                this.deltaY = step * this.length * this.angleSin;
            }
        };
    }

    static getDistance(a, b) {
        var lengthX = b[0] - a[0];
        var lengthY = b[1] - a[1];
        return Math.sqrt(lengthX * lengthX + lengthY * lengthY);
    }

}
