/**
 * Created by grenlight on 16/3/23.
 */

export class Vector3 {
    static applyMatrix4 ( out, m ) {
        let x = out[0];
        let y = out[1];
        let z = out[2];
        let w = 1;

        out[0] = m[ 0 ] * x + m[ 4 ] * y + m[ 8 ] * z + m[ 12 ] * w;
        out[1] = m[ 1 ] * x + m[ 5 ] * y + m[ 9 ] * z + m[ 13 ] * w;
        out[2] = m[ 2 ] * x + m[ 6 ] * y + m[ 10 ] * z + m[ 14 ] * w;
        let scale = m[ 3 ] * x + m[ 7 ] * y + m[ 11 ] * z + m[ 15 ] * w;

        out[0] = out[0]/scale;
        out[1] = out[1]/scale;
        out[2] = out[2]/scale;

        return out;
    }
}
