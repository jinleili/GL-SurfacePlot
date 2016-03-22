/**
 * Created by grenlight on 16/3/22.
 */

export  class Vector4 {

    static applyMatrix4 ( vec, m ) {
        let x = vec[0];
        let y = vec[1];
        let z = vec[2];
        let w = vec[3];

        let e = m;

        vec[0] = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
        vec[1] = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
        vec[2] = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
        vec[3] = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

        return vec;
    }
}
