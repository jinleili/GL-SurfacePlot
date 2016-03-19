/**
 * Created by grenlight on 16/3/18.
 */
  
export class Color {
  static hex2rgb(hex) {
    if (hex.substr(0, 1) === '#') {
      hex = '0x' + hex.substr(1, hex.length - 1);
    }
    let out = [];
    out[0] = (hex >> 16 & 0xFF) / 255;
    out[1] = (hex >> 8 & 0xFF) / 255;
    out[2] = (hex & 0xFF) / 255;

    return out;
  }
}
