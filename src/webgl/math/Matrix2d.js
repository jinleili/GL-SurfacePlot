/**
 * Created by grenlight on 16/1/28.
 * 
 * @class 2x3 Matrix
 * @name mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [0, 2, tx,
 *  1, 3, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [0, 3, tx,
 *  1, 4, ty,
 *  2, 5, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

export class Matrix2d {
    constructor() {
        this.identity = Matrix2d.identity();
    }
    static identity() {
        return new Float32Array([
            1, 0,
            0, 1,
            0, 0,
        ]);
    }
    static copy(a) {
        let out = Matrix2d.identity();
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        return out;
    }

    static scale(a, v) {
        let x = v[0], y = v[1];

        a[0] *= x;
        a[1] *= x;
        a[2] *= y;
        a[3] *= y;
    }

    static translate(a, v) {
        let x = v[0], y = v[1];
        a[4] += a[0] * x + a[2] * y ;
        a[5] += a[1] * x + a[3] * y ;
    }


    /**
     * Rotates a Matrix2d by the given angle
     *
     * @param {Matrix2d} out the receiving matrix
     * @param {Matrix2d} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Matrix2d} out
     */
    static rotate(out,  rad) {
        let a0 = out[0], a1 = out[1], a2 = out[2], a3 = out[3], a4 = out[4], a5 = out[5],
            s = Math.sin(rad),
            c = Math.cos(rad);
        out[0] = a0 *  c + a2 * s;
        out[1] = a1 *  c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        out[4] = a4;
        out[5] = a5;

        return out;
    };
}