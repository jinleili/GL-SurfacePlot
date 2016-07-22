/**
 * Created by grenlight on 16/3/19.
 */

export class Geometry  {
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
