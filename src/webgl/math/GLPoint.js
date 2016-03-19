/**
 * Created by grenlight on 16/1/28.
 */
export class GLPoint {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static pointByArray(arr) {
        return new GLPoint(arr[0], arr[1]);
    }

    static zero() {
        return new GLPoint();
    }

    static copy(p) {
        return new GLPoint(p.x, p.y);
    }

    getVector2() {
        return [this.x, this.y];
    }

    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }
    //将屏幕坐标转换成模型坐标
    swapToModelPosition(devicePixelRatio = 1, sceneWidthHalf = 0, sceneHeightHalf = 0) {
        this.x = this.x * devicePixelRatio - sceneWidthHalf;
        this.y = sceneHeightHalf - this.y * devicePixelRatio;
    }

    isEqualTo(p) {
        return (p.x === this.x) && (p.y === this.y) ;
    }
}
