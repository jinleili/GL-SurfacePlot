/**
 * Created by grenlight on 16/3/19.
 */

import { Geometry } from './Geometry.js';

export class PlaneGeometry extends Geometry {
    constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
        super();

        let pixelWidth = width * this.devicePixelRatio;
        let pixelHeight = height * this.devicePixelRatio;

        this.widthHalf = pixelWidth / 2;
        this.heightHalf = pixelHeight / 2;

        this.gridX = widthSegments;
        this.gridY = heightSegments;

        this.segmentWidth = pixelWidth / this.gridX;
        this.segmentHeight = pixelHeight / this.gridY;

        this.generateVetices();
    }

    generateVetices() {
        let gridX1 = this.gridX + 1;
        let gridY1 = this.gridY + 1;
        this.vertices = new Float32Array(gridX1 * gridY1 * 3);
        this.textureCoords = new Float32Array(gridX1 * gridY1 * 2);

        let offset = 0;
        let offset2 = 0;

        for (let iy = 0; iy < gridY1; iy++) {
            let y = iy * this.segmentHeight - this.heightHalf;

            for (let ix = 0; ix < gridX1; ix++) {
                var x = ix * this.segmentWidth - this.widthHalf;
                this.vertices[offset] = x;
                this.vertices[offset + 1] = -y;

                this.textureCoords[offset2] = ix / this.gridX;
                this.textureCoords[offset2 + 1] = 1 - (iy / this.gridY);

                offset += 3;
                offset2 += 2;
            }
        }

        offset = 0;
        this.indices = new ((this.vertices.length / 3) > 65535 ? Uint32Array : Uint16Array)(this.gridX * this.gridY * 6);

        for (let iy = 0; iy < this.gridY; iy++) {

            for (let ix = 0; ix < this.gridX; ix++) {
                var a = ix + gridX1 * iy;
                var b = ix + gridX1 * (iy + 1);
                var c = (ix + 1) + gridX1 * (iy + 1);
                var d = (ix + 1) + gridX1 * iy;

                this.indices[offset] = a;
                this.indices[offset + 1] = b;
                this.indices[offset + 2] = d;

                this.indices[offset + 3] = b;
                this.indices[offset + 4] = c;
                this.indices[offset + 5] = d;

                offset += 6;
            }
        }
    }
}
