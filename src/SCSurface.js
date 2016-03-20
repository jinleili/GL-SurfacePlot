/**
 * Created by grenlight on 16/3/20.
 */

export  class SCSurface {
    constructor(gl, dataSource) {
        this.gl = gl;
        this.dataSource = dataSource;

        this.vetexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        this.vertices = dataSource.vertices;
        this.indices = dataSource.indices;
    }

    bindBuffer() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    draw() {
        
    }
}