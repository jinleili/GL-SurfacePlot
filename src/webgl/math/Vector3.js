/**
 * Created by grenlight on 16/3/23.
 */

export class Vector3 {
    static applyMatrix4 ( vec, m ) {
        let x = vec[0];
        let y = vec[1];
        let z = vec[2];
        let w = 0;
        
        vec[0] = m[ 0 ] * x + m[ 4 ] * y + m[ 8 ] * z + m[ 12 ] * w;
        vec[1] = m[ 1 ] * x + m[ 5 ] * y + m[ 9 ] * z + m[ 13 ] * w;
        vec[2] = m[ 2 ] * x + m[ 6 ] * y + m[ 10 ] * z + m[ 14 ] * w;

        return vec;
    }
}
