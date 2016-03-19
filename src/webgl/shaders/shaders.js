/**
 * Created by grenlight on 16/1/6.
 */

export let pixelVS = `
attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoords;

uniform mat4 mvMatrix;
uniform mat4 pMatrix;

varying vec2 textureCoord;

void main(void) {
  textureCoord = vertexTextureCoords;
  gl_Position = pMatrix * mvMatrix * vec4(vertexPosition, 1.0);
}
`;

export let pixelFS = `
precision highp float;

uniform sampler2D texture;
varying vec2 textureCoord;

void main(void) {
  gl_FragColor = texture2D(texture, textureCoord);
}
`;