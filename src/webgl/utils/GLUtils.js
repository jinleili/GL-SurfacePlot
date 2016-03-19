/**
 * Created by grenlight on 16/3/18.
 */

export function makeProgram(vertexSource, fragmentSource) {
  let that = this;
  function compileSource(type, source) {
    var shader = that.createShader(type);
    that.shaderSource(shader, source);
    that.compileShader(shader);
    if (!that.getShaderParameter(shader, that.COMPILE_STATUS)) {
      throw new Error('compile error: ' + that.getShaderInfoLog(shader));
    }
    return shader;
  }

  var program = this.createProgram();
  this.attachShader(program, compileSource(this.VERTEX_SHADER, vertexSource));
  this.attachShader(program, compileSource(this.FRAGMENT_SHADER, fragmentSource));
  this.linkProgram(program);
  if (!this.getProgramParameter(program, this.LINK_STATUS)) {
    throw new Error('link error: ' + this.getProgramInfoLog(program));
  }
  this.useProgram(program);

  program.setAttribLocations = (attrList) => {
    for (var i = 0, max = attrList.length; i < max; i += 1) {
      program[attrList[i]] = this.getAttribLocation(program, attrList[i]);
    }
  };

  program.setUniformLocations = (uniformList) => {
    for (var i = 0, max = uniformList.length; i < max; i += 1) {
      program[uniformList[i]] = this.getUniformLocation(program, uniformList[i]);
    }
  };

  return program;
}

export function createArrayBufferWithData(vertices) {
  let vetexBuffer = this.createBuffer();
  this.bindBuffer(this.ARRAY_BUFFER, vetexBuffer);
  this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), this.STATIC_DRAW);
    //this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), this.DYNAMIC_DRAW);
    this.bindBuffer(this.ARRAY_BUFFER, null);

  return vetexBuffer;
}

export function createElementBufferWithData(indices) {
  let indexBuffer = this.createBuffer();
  this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, indexBuffer);
  this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.STATIC_DRAW);
  this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);

  return indexBuffer;
}

export function isPowerOf2(x) {
  return (x & (x - 1)) === 0;
}

export function createTextureWithData(image, repeating=false) {
  //使之与模型坐标保持一致
  this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);

  let texture = this.createTexture();
  this.bindTexture(this.TEXTURE_2D, texture);
  this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, image);

  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    this.generateMipmap(this.TEXTURE_2D);
      //可重复的贴图一定是长宽为2的n次幂的
      if (repeating) {
          this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.REPEAT);
          this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.REPEAT);
      }
  } else {
    this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
    this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
    this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR);
    this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
  }

  this.bindTexture(this.TEXTURE_2D, null);

  return texture;
}

export  function createImageByURL(url, callBack) {
  let image = new Image();
  image.onload = () => {
    if (callBack) {
      callBack(image);
    }
  };
  image.src = url;
}
