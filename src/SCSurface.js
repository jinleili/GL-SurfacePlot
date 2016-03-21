/**
 * Created by grenlight on 16/3/20.
 */

export  class SCSurface {
    constructor(gl, prg, dataSource) {
        this.gl = gl;
        this.prg = prg;
        this.dataSource = dataSource;

        this.vertices = dataSource.vertices;
        this.colorList = dataSource.colors;
        this.indices = dataSource.indices;
        // this.vertices = [0.0,0.0, 0.2,  50.0, 0.0, 0.2,  50.0, 50.0, 0.2];
        // this.indices = [0, 1, 2];
        // this.colorList = [1.0, 0.0, 0.0,  1.0, 0.0, 0.0,   1.0, 0.0, 0.0];
        this.vetexBuffer = gl.createArrayBufferWithData(this.vertices);
        this.indexBuffer = gl.createElementBufferWithData(this.indices);
        this.colorBuffer = gl.createArrayBufferWithData(this.colorList);

        this.updateBufferData();
    }

    updateBufferData() {
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        //
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colorList), this.gl.STATIC_DRAW);

        // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
    }


    draw() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
        //这个地方要写在bind后,相当于获取并设置顶点数据
        this.gl.vertexAttribPointer(this.prg.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.prg.vertexPosition);

        this.gl.enableVertexAttribArray(this.prg.vertexColor);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.prg.vertexColor, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);

    }
}