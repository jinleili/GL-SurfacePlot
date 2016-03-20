/**
 * Created by grenlight on 16/1/6.
 */

export let pixelVS = `
attribute vec3 vertexPosition;
attribute vec3 vertexColor;

uniform mat4 mvMatrix;
uniform mat4 pMatrix;

varying vec3 color;

void main(void) {
  color = vertexColor;
  gl_Position = pMatrix * mvMatrix * vec4(vertexPosition, 1.0);
}
`;

export let pixelFS = `
precision highp float;

varying vec3 color;

void main(void) {
  gl_FragColor = color;
}
`;