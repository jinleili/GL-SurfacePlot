/**
 * Created by grenlight on 16/3/20.
 */

export  class SCSurface {
    constructor(gl, prg, dataSource) {
        this.gl = gl;
        this.prg = prg;

        this.vertices = dataSource.vertices;
        this.colorList = dataSource.colors;
        this.indices = dataSource.indices;
        // console.log(this.vertices, this.colorList, this.indices);
        // this.vertices = [-25,0.0, 0.0,  25, 0.0, 0.0,  25, 50, 0.0];
        // this.indices = [0, 1, 2];
        // this.colorList = [1.0, 0.0, 0.0,  1.0, 0.0, 0.0,   1.0, 0.0, 0.0];
        this.vetexBuffer = gl.createArrayBufferWithData(this.vertices);
        this.colorBuffer = gl.createArrayBufferWithData(this.colorList);

        this.indexBufferList = [];
        let boundary = 65535;
        let maxLength = dataSource.indices.length;
        let count = Math.ceil( maxLength / boundary);
        for (let i=0; i<count; i++) {
            let lower = i*boundary;
            let uper = lower + boundary + 1;
            if (uper > (maxLength+1)) {
                uper = maxLength + 1;
            }
            let indices = dataSource.indices.slice(lower, uper);
            let indexBuffer = gl.createElementBufferWithData(indices);
            this.indexBufferList.push({buffer:indexBuffer, length:uper-lower-1});
            console.log(maxLength, boundary, count, uper);
        }
    }

    draw() {
        this.gl.enableVertexAttribArray(this.prg.vertexPosition);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
        //这个地方要写在bind后,相当于获取并设置顶点数据
        this.gl.vertexAttribPointer(this.prg.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.enableVertexAttribArray(this.prg.vertexColor);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.prg.vertexColor, 3, this.gl.FLOAT, false, 0, 0);
        
        this.indexBufferList.forEach( (indexBufferObj)=> {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBufferObj.buffer);
            this.gl.drawElements(this.gl.TRIANGLES, indexBufferObj.length, this.gl.UNSIGNED_SHORT, 0);
        });

    }
}

class  SubSurface {
    constructor(gl, prg, vertices, colorList, indices) {
        this.gl = gl;
        this.prg = prg;

        this.vertices = vertices;
        this.colorList = colorList;
        this.indices = indices;
        // console.log(this.vertices, this.colorList, this.indices);
        // this.vertices = [-25,0.0, 0.0,  25, 0.0, 0.0,  25, 50, 0.0];
        // this.indices = [0, 1, 2];
        // this.colorList = [1.0, 0.0, 0.0,  1.0, 0.0, 0.0,   1.0, 0.0, 0.0];
        this.vetexBuffer = gl.createArrayBufferWithData(this.vertices);
        this.indexBuffer = gl.createElementBufferWithData(this.indices);
        this.colorBuffer = gl.createArrayBufferWithData(this.colorList);
    }

    draw() {
        this.gl.enableVertexAttribArray(this.prg.vertexPosition);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
        //这个地方要写在bind后,相当于获取并设置顶点数据
        this.gl.vertexAttribPointer(this.prg.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.enableVertexAttribArray(this.prg.vertexColor);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.prg.vertexColor, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }
}