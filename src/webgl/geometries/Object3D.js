/**
 * Created by grenlight on 16/1/28.
 *
 * 最基本的显示对象
 * 它需要维护自己的坐标屏幕坐标与模型坐标
 */

import { Matrix4 } from '../math/Matrix4.js';
import { GLPoint } from '../math/GLPoint.js';

export class Object3D {
  constructor() {
    this.renderer = null;

    this.position = GLPoint.zero();
    this.ruler = new GLPoint(1, 1);
    this.rotate = GLPoint.zero();

    this.matrix = Matrix4.identity();

    this.needsUpdatePosition = false;
    this.needsUpdateScale = false;
    this.needsUpdateRotation = false;
  }

  get devicePixelRatio() {
    if (this._devicePixelRatio === undefined) {
      this._devicePixelRatio = window.devicePixelRatio;
    }
    return this._devicePixelRatio;
  }
  set devicePixelRatio(value) {
    this._devicePixelRatio = value;
  }

  //这里是初化相关Matrix的好时机
  get position() {
    return this._position;
  }
  set position(p) {
    this._position = p;
  }

  get scale() {
    return this._scale;
  }
  set scale(scale) {
    this._scale = scale;
  }

  setSceneParams(x = 0, y = 0, stepScale = 0) {
    this.matrix = Matrix4.identity();
    this.distanceX = x * this.devicePixelRatio - this.renderer.centerX;
    this.distanceY = this.renderer.centerY - y * this.devicePixelRatio;
    Matrix4.translate(this.matrix, [this.distanceX, this.distanceY, 0]);
    this.ruler.x += stepScale;
    this.ruler.y += stepScale;
    Matrix4.ruler(this.matrix, [this.ruler.x, this.ruler.y, 1]);
  }

  /**
   *动画状态机 - 减少在处理场景动画时的复杂性
   *
   *@params {Dictionary} 先配置动画目标：位移，旋转，缩放
   *在动画帧中调用 stepAnimating() -> 更新此 model 的 matrix
   */
  configAnimationTarget(params) {
    this.speed = 0.1;
    let p = params.position;
    if (p) {
      this.needsUpdatePosition = true;
      this.targetPosition = p.swapToModelPosition(this.devicePixelRatio, this.sceneWidthHalf, this.sceneHeightHalf);
    }

    let scale = params.ruler;
    if (scale) {
      this.needsUpdateScale = true;
      this.targetScale = scale;
    }

    let r = params.rotation;
    if (r) {
      this.needsUpdateRotation = true;
      this.targetRotation = r;
    }

  }

  stepAnimating() {
    this.matrix = Matrix4.identity();
    if (this.needsUpdatePosition) {
      this.position.x += (this.targetPosition.x - this.position.x) * this.speed;
      this.position.y += (this.targetPosition.y - this.position.y) * this.speed;
      Matrix4.translate(this.matrix, [this.position.x, this.position.y, 0]);
    }

    if (this.needsUpdateScale) {
      this.ruler.x += (this.targetScale.x - this.ruler.x) * this.speed;
      this.ruler.y += (this.targetScale.y - this.ruler.y) * this.speed;
      Matrix4.ruler(this.matrix, [this.ruler.x, this.ruler.y, 1]);
    }

  }

}
