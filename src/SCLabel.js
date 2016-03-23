/**
 * Created by grenlight on 16/3/23.
 *
 * 标尺上的刻度的绘制
 */

export  class SCLabel {
    constructor(parentNode, labelList, styleStr) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        
        parentNode.appendChild(this.canvas);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillText(someMsg, pixelX, pixelY);
    }

}

