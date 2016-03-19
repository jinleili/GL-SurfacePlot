/**
 * Created by grenlight on 16/3/19.
 */

import { GLPoint } from './GLPoint.js';

export class GLRect {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.halfWidth = w / 2.0;
        this.halfHeight = h / 2.0;
        this._center = new GLPoint(x + this.halfWidth, y + this.halfHeight);
    }

    set center(value) {
        this._center = value;
        this._x = this._center.x - this.halfWidth;
        this._y = this._center.y - this.halfHeight;
    }
    get center() {
        return this._center;
    }

    set width(value) {
        this._width = value;
        this.halfWidth = value / 2.0;
        this._center.x = this._x + this.halfWidth;
    }
    get width() {
        return this._width;
    }

    set height(value) {
        this._height = value;
        this.halfHeight = value / 2.0;
        this._center.y = this._y + this.halfHeight;
    }
    get height() {
        return this._height;
    }

    set x(value) {
        this._x = value;
        this._center.x = this._x + this.halfWidth;
    }
    get x() {
        return this._x;
    }

    set y(value) {
        this._y = value;
        this._center.y = this._y + this.halfHeight;
    }
    get y() {
        return this._y;
    }

    setPosition(value) {
        this.x = value.x;
        this.y = value.y;
    }
    getPosition() {
        return new GLPoint(this.x, this.y);
    }

    getMaxX() {
        return this.x + this._width;
    }
    getMaxY() {
        return this.y + this._height;
    }

    //转换点的位置，p的参考系从 this.parent 转到 this
    converPoint(p) {
        return new GLPoint(p.x - this.x, p.y - this.y);
    }

    convertRect(rect) {
        return new GLRect(rect.x - this.x, rect.y - this.y, rect.width, rect.height);
    }

    isContaintPoint(p) {
        if (p.x >= this.x && p.x <= this.getMaxX() && p.y >= this.y && p.y <= this.getMaxY()) {
            return true;
        }
        return false;
    }
}
