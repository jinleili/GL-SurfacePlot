/**
 * Created by grenlight on 16/3/19.
 */

import { Geometry } from './Geometry.js';
import { Matrix4 } from '../math/Matrix4.js';

export class Box2 extends Geometry {
  constructor(renderer, prg, width, height, offsetX) {
    super();

    this.gl = renderer.gl;
    this.prg = prg;

    this.windowHeight = renderer.canvasHeight;
    this.windowWidth = renderer.canvasWidth;

    this.halfWindowX = renderer.canvasWidth / 2.0;
    this.halfWindowY = renderer.canvasHeight / 2.0;
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;

    this.vertices = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];
    // this.vertices = [-0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0];
    this.indices = [0, 1, 2, 0, 2, 3];

    //通过平移Y轴来实现这个动画
    this.translateY = 0;

    this.speed = 0;
    this.needsUpdate = false;

    this.isBufferBinded = false;

    this.vetexBuffer = null;
    this.indexBuffer = null;
    this.baseMVMatrix = Matrix4.identity();

    this.mvMatrix = Matrix4.identity();
    this.pMatrix = Matrix4.identity();

    this.mvMatrixList = [];
    this.frameIndex = 0;

    /*
     得到满屏模型视图矩阵
     这里的这个0.5需要与下边的顶点一致
    */
    Matrix4.translate(this.baseMVMatrix, [0.0, 0.0, 0.0]);

    //缩放成想要的状态
    Matrix4.scale(this.baseMVMatrix, [width, this.windowHeight, 1]);

    // 平移到X,Y轴向上的正确位置
    Matrix4.translate(this.baseMVMatrix, [(offsetX * 2 + 1) - this.windowWidth / width, 2, 0]);

    this.reset();
  }

  reset() {
    this.speed = 0.001;
    this.currentHeight = 0;
    this.translateY = 0;
    this.needsUpdate = true;
    this.frameIndex = 0;
    this.mvMatrixList = [];

    this.generateMVMatrixArray();
  }

  updateMVMatrix() {
    if (this.frameIndex < this.mvMatrixList.length) {
      this.mvMatrix = this.mvMatrixList[this.frameIndex];
      this.frameIndex++;
    }
  }

  //以左上角为原点的像素值，需要在这里转化为以中心点为原点平移的矩阵
  generateMVMatrixArray() {
    if (this.translateY === -2) {
      this.needsUpdate = false;
      return;
    }
    this.translateY -= this.speed;
    if (this.translateY < -2) {
      this.translateY = -2;
    }
    this.speed += Math.random() * 0.004 + 0.001; // * this.mvMatrixList.length;

    var matrix = Matrix4.copy(this.baseMVMatrix);
    Matrix4.translate(matrix, [0, this.translateY, 0]);
    this.mvMatrixList.push(matrix);
    this.generateMVMatrixArray();
  }

  createIndexBuffer() {
    this.vetexBuffer = this.gl.createArrayBufferWithData(this.vertices);
    this.indexBuffer = this.gl.createElementBufferWithData(this.indices);
  }

  bindReaderBuffers() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
    this.gl.vertexAttribPointer(this.prg.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.prg.vertexPosition);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  }

  update() {
    this.updateMVMatrix();

    this.gl.uniformMatrix4fv(this.prg.uMVMatrix, false, this.mvMatrix);

    this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT,
      0);
  // this.gl.drawElements(this.gl.LINES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
  }
}
