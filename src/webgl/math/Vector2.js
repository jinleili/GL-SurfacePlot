/**
 * Created by grenlight on 16/1/6.
 *
 * Vector2 与 GLPoint 在概念上不一样,但数字表达上是一样的
 */
export class Vector2 {

    /**
     * Transforms the vec2 with a mat2d
     *
     * @param { Array } out the receiving vector
     */
    static transformByMat2d(out, m) {
        var x = out[0],
            y = out[1];
        out[0] = m[0] * x + m[2] * y + m[4];
        out[1] = m[1] * x + m[3] * y + m[5];
        return out;
    }

    static generateVector(origin, p) {
        return [p[0] - origin[0], p[1] - origin[1]];
    }

    static dotProduct(a, b) {
        return a[0]*b[0] + a[1]*b[1];
    }
}