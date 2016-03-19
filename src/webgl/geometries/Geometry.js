/**
 * Created by grenlight on 16/3/19.
 */

import { Object3D } from '../core/Object3D.js';

export class Geometry extends Object3D {
  constructor() {
    super();
    //我们可以使用Object.defineProperty创建一个不能被修改的对象的属性
    // Object.defineProperty(this, 'id', {
    //   value: GREN.GeometryIdCount++
    // });
    this.vertices = [];
    this.colors = []; // one-to-one vertex colors, used in Points and Line
    this.indices = [];
    this.textureCoords = [];

    this.vetexBuffer = null;
    this.indexBuffer = null;
    this.textureBuffer = null;

    this.faces = [];
    this.faceVertexUvs = [[]];

    this.skinWeights = [];
    this.skinIndices = [];

    this.lineDistances = [];

    this.boundingBox = null;
    this.boundingSphere = null;

    this.hasTangents = false;

    this.dynamic = true; // the intermediate typed arrays will be deleted when set to false

    // 标记是否更新

    this.verticesNeedUpdate = false;
    this.elementsNeedUpdate = false;
    this.uvsNeedUpdate = false;
    this.normalsNeedUpdate = false;
    this.tangentsNeedUpdate = false;
    this.colorsNeedUpdate = false;
    this.lineDistancesNeedUpdate = false;

    this.groupsNeedUpdate = false;
  }

  createBuffers(gl) {
    this.vetexBuffer = gl.createArrayBufferWithData(this.vertices);
    this.indexBuffer = gl.createElementBufferWithData(this.indices);
    this.textureBuffer = gl.createArrayBufferWithData(this.textureCoords);
  }

  bindBuffers(gl, prg, keys) {
    gl.enableVertexAttribArray(prg[keys[0]]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vetexBuffer);
    gl.vertexAttribPointer(prg[keys[0]], 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.enableVertexAttribArray(prg[keys[1]]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.vertexAttribPointer(prg[keys[1]], 2, gl.FLOAT, false, 0, 0);
  }


}
