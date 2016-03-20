/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _SurfaceChart = __webpack_require__(1);

	window.SurfaceChart = _SurfaceChart.SurfaceChart; /**
	                                                   * Created by grenlight on 16/3/17.
	                                                   */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SurfaceChart = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by grenlight on 16/3/17.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _SCDataSource = __webpack_require__(2);

	var _SCSurface = __webpack_require__(3);

	var _shaders = __webpack_require__(4);

	var _WebGLRenderer = __webpack_require__(5);

	var _Matrix = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SurfaceChart = exports.SurfaceChart = function () {
	    function SurfaceChart(dataArr) {
	        var width = arguments.length <= 1 || arguments[1] === undefined ? 600 : arguments[1];
	        var height = arguments.length <= 2 || arguments[2] === undefined ? 500 : arguments[2];

	        _classCallCheck(this, SurfaceChart);

	        this.width = width;
	        this.height = height;
	        this.paddingLR = 50;
	        this.paddingTop = 50;
	        this.paddingBottom = 50;

	        if (width < 300 || height < 200) {
	            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
	        }
	        if (!dataArr || dataArr.length === 0) {
	            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
	        }
	        this.dataSource = new _SCDataSource.SCDataSource(dataArr, this.width - this.paddingLR * 2, this.height - this.paddingBottom - this.paddingTop);

	        this.renderer = new _WebGLRenderer.WebGLRenderer(null, this.width, this.height);
	        this.renderer.view.setAttribute('style', 'margin:0px; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); width:' + width + 'px; height: ' + height + 'px');
	        this.domElement = this.renderer.view;
	        //曲面绘制类
	        this.surface = new _SCSurface.SCSurface(this.dataSource);

	        this.initProgram();
	    }

	    _createClass(SurfaceChart, [{
	        key: 'initProgram',
	        value: function initProgram() {
	            this.prg = this.gl.makeProgram(_shaders.pixelVS, _shaders.pixelFS);
	            if (this.prg === null) {
	                console.log('着色器加载失败');
	            } else {
	                this.prg.setAttribLocations(['vertexPosition', 'vertexColor']);
	                this.prg.setUniformLocations(['pMatrix', 'mvMatrix']);
	                this.mvMatrix = _Matrix.Matrix4.identity();
	                //Matrix4.scale(this.mvMatrix, [this.renderer.canvasWidth, this.renderer.canvasHeight, 1]);
	                this.pMatrix = _Matrix.Matrix4.orthogonal(0, this.renderer.canvasWidth, this.renderer.canvasHeight, 0, -5000.0, 5000.0);
	                this.gl.uniformMatrix4fv(this.prg.mvMatrix, false, this.mvMatrix);
	                this.gl.uniformMatrix4fv(this.prg.pMatrix, false, this.pMatrix);
	            }
	        }
	    }]);

	    return SurfaceChart;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/19.
	 */

	var SCDataSource = exports.SCDataSource = function () {
	    function SCDataSource(dataArr, drawWidth, drawHeight) {
	        _classCallCheck(this, SCDataSource);

	        this.drawWidth = drawWidth;
	        this.drawHeight = drawHeight;
	        this.rowCount = dataArr.length;
	        this._validateRowAndCol(this.rowCount);
	        this.colCount = dataArr[0].length;
	        this._validateRowAndCol(this.colCount);

	        //参考线条数
	        this.referenceLineCount = 6;
	        //y 轴上的标尺数据集
	        this.scaleLabels = [];
	        // y 轴上的 数值<=>像素 缩放比
	        this.dataScale = 0;

	        //选第一个值做为起始参考值
	        this.minValue = this.maxValue = parseFloat(dataArr[0][0]);
	        this._validateDataType(this.minValue);
	        this._formatData(dataArr);
	    }

	    _createClass(SCDataSource, [{
	        key: '_validateRowAndCol',
	        value: function _validateRowAndCol(count) {
	            if (count < 2) {
	                throw new Error('SurfaceChart 至少需要两行两列数据 ');
	            }
	        }
	    }, {
	        key: '_validateDataType',
	        value: function _validateDataType(data) {
	            if (data === undefined) {
	                throw new Error('SurfaceChart 需要的数据项必须是整数或浮点数');
	            }
	        }

	        /**
	         * 格式化数据
	         *
	         * 获取最小最大值及  y 轴上的 数值<=>像素 缩放比
	         * @param dataArr
	         * @private
	         */

	    }, {
	        key: '_formatData',
	        value: function _formatData(dataArr) {
	            this.dataSource = [];

	            for (var i = 0; i < this.rowCount; i++) {
	                var rowArr = dataArr[i];
	                var newRowArr = [];

	                for (var j = 0; j < this.colCount; j++) {
	                    var value = parseFloat(rowArr[j]);
	                    this._validateDataType(value);
	                    if (value < this.minValue) {
	                        this.minValue = value;
	                    } else if (value > this.maxValue) {
	                        this.maxValue = value;
	                    }
	                    newRowArr.push(value);
	                }
	                this.dataSource.push(newRowArr);
	            }

	            //生成刻度集合
	            this._calculateScaleLabel();
	            //转换数据点为屏幕顶点坐标
	            this._generateVertices();
	        }

	        /**
	         * 转换数据点为屏幕顶点坐标
	         */

	    }, {
	        key: '_generateVertices',
	        value: function _generateVertices() {
	            this.vertices = [];
	            var colGap = this.drawWidth / (this.colCount - 1);
	            //初始值给负, 避免后面赋值时的条件判断
	            var z = -colGap;
	            for (var i = 0; i < this.rowCount; i++) {
	                z += colGap;

	                var x = -colGap;
	                var rowData = this.dataSource[i];
	                for (var j = 0; j < this.colCount; j++) {
	                    x += colGap;
	                    this.vertices.push(x, rowData[j] * this.dataScale, z);
	                }
	            }
	            console.log(this.vertices);
	        }
	        /**
	         * 生成刻度集合
	         * @private
	         */

	    }, {
	        key: '_calculateScaleLabel',
	        value: function _calculateScaleLabel() {
	            var distance = Math.abs(this.maxValue - this.minValue);
	            //为了图形美观,坐标上的刻度值应该做一定的舍入
	            var gap = distance / (this.referenceLineCount - 1).toFixed(2);
	            gap = this._calculateGap(gap, 1);

	            var currentLabel = 0;
	            if (this.maxValue > 0 && this.minValue < 0) {
	                while (currentLabel < this.maxValue) {
	                    currentLabel += gap;
	                    this.scaleLabels.unshift(currentLabel);
	                }
	                currentLabel = 0;
	            } else {
	                currentLabel = this.maxValue;
	            }
	            this.scaleLabels.push(currentLabel);
	            while (currentLabel > this.minValue) {
	                currentLabel -= gap;
	                this.scaleLabels.push(currentLabel);
	            }
	            this.dataScale = this.drawHeight / Math.abs(this.scaleLabels[0] - this.scaleLabels[this.scaleLabels.length - 1]);
	        }

	        /**
	         * 将 y 轴上的刻度值做舍入, 使数值看起来更漂亮
	         * @param gap
	         * @param limit
	         * @returns {*}
	         * @private
	         */

	    }, {
	        key: '_calculateGap',
	        value: function _calculateGap(gap, limit) {
	            if (gap < limit) {
	                return gap;
	            } else {
	                limit *= 10;
	                var newValue = (gap / limit).toFixed(1) * limit;
	                return this._calculateGap(newValue, limit);
	            }
	        }
	    }]);

	    return SCDataSource;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/20.
	 */

	var SCSurface = exports.SCSurface = function SCSurface(dataSource) {
	    _classCallCheck(this, SCSurface);

	    this.dataSource = dataSource;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by grenlight on 16/1/6.
	 */

	var pixelVS = exports.pixelVS = "\nattribute vec3 vertexPosition;\nattribute vec3 vertexColor;\n\nuniform mat4 mvMatrix;\nuniform mat4 pMatrix;\n\nvarying vec3 color;\n\nvoid main(void) {\n  color = vertexColor;\n  gl_Position = pMatrix * mvMatrix * vec4(vertexPosition, 1.0);\n}\n";

	var pixelFS = exports.pixelFS = "\nprecision highp float;\n\nvarying vec3 color;\n\nvoid main(void) {\n  gl_FragColor = color;\n}\n";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.WebGLRenderer = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by grenlight on 16/3/18.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _GLUtils = __webpack_require__(6);

	var GLUtils = _interopRequireWildcard(_GLUtils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WebGLRenderer = exports.WebGLRenderer = function () {
	    function WebGLRenderer() {
	        var elementId = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	        var width = arguments.length <= 1 || arguments[1] === undefined ? 400 : arguments[1];
	        var height = arguments.length <= 2 || arguments[2] === undefined ? 400 : arguments[2];

	        _classCallCheck(this, WebGLRenderer);

	        this.canvasWidth = 0;
	        this.canvasHeight = 0;
	        this.canvas = null;

	        if (elementId !== null) {
	            this.canvas = document.getElementById(elementId);
	        }

	        if (this.canvas === null) {
	            this.canvas = document.createElement('canvas');
	            this.canvas.setAttribute('id', elementId);
	            document.body.appendChild(this.canvas);
	        }
	        this.gl = this.getGLContext();
	        if (this.gl === null) {
	            this.isWebGLSuported = false;
	        } else {
	            this.isWebGLSuported = true;
	            this.gl.createArrayBufferWithData = GLUtils.createArrayBufferWithData;
	            this.gl.createElementBufferWithData = GLUtils.createElementBufferWithData;
	            this.gl.createTextureWithData = GLUtils.createTextureWithData;
	            this.gl.makeProgram = GLUtils.makeProgram;
	        }
	        this.setStyle(width, height);
	    }

	    _createClass(WebGLRenderer, [{
	        key: 'setStyle',
	        value: function setStyle() {
	            var width = arguments.length <= 0 || arguments[0] === undefined ? 400 : arguments[0];
	            var height = arguments.length <= 1 || arguments[1] === undefined ? 400 : arguments[1];
	            var otherStyleStr = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	            if (this.canvas == null) {
	                return;
	            }

	            this.canvas.width = width * window.devicePixelRatio;
	            this.canvas.height = height * window.devicePixelRatio;
	            this.canvasWidth = width * window.devicePixelRatio;
	            this.canvasHeight = height * window.devicePixelRatio;

	            if (otherStyleStr === null) {
	                this.canvas.style.width = width;
	                this.canvas.style.height = height;
	            } else {
	                this.canvas.setAttribute('style', 'width:' + width + 'px; height: ' + height + 'px; ' + otherStyleStr);
	            }
	            this.centerX = this.canvasWidth / 2.0;
	            this.centerY = this.canvasHeight / 2.0;
	        }
	    }, {
	        key: 'getGLContext',
	        value: function getGLContext() {
	            var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
	            var context = null;
	            for (var i = 0; i < names.length; ++i) {
	                context = this.canvas.getContext(names[i]);
	                if (context) {
	                    break;
	                }
	            }
	            return context;
	        }
	    }]);

	    return WebGLRenderer;
	}();

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makeProgram = makeProgram;
	exports.createArrayBufferWithData = createArrayBufferWithData;
	exports.createElementBufferWithData = createElementBufferWithData;
	exports.isPowerOf2 = isPowerOf2;
	exports.createTextureWithData = createTextureWithData;
	exports.createImageByURL = createImageByURL;
	/**
	 * Created by grenlight on 16/3/18.
	 */

	function makeProgram(vertexSource, fragmentSource) {
	  var _this = this;

	  var that = this;
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

	  program.setAttribLocations = function (attrList) {
	    for (var i = 0, max = attrList.length; i < max; i += 1) {
	      program[attrList[i]] = _this.getAttribLocation(program, attrList[i]);
	    }
	  };

	  program.setUniformLocations = function (uniformList) {
	    for (var i = 0, max = uniformList.length; i < max; i += 1) {
	      program[uniformList[i]] = _this.getUniformLocation(program, uniformList[i]);
	    }
	  };

	  return program;
	}

	function createArrayBufferWithData(vertices) {
	  var vetexBuffer = this.createBuffer();
	  this.bindBuffer(this.ARRAY_BUFFER, vetexBuffer);
	  this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), this.STATIC_DRAW);
	  //this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), this.DYNAMIC_DRAW);
	  this.bindBuffer(this.ARRAY_BUFFER, null);

	  return vetexBuffer;
	}

	function createElementBufferWithData(indices) {
	  var indexBuffer = this.createBuffer();
	  this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, indexBuffer);
	  this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.STATIC_DRAW);
	  this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);

	  return indexBuffer;
	}

	function isPowerOf2(x) {
	  return (x & x - 1) === 0;
	}

	function createTextureWithData(image) {
	  var repeating = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	  //使之与模型坐标保持一致
	  this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);

	  var texture = this.createTexture();
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

	function createImageByURL(url, callBack) {
	  var image = new Image();
	  image.onload = function () {
	    if (callBack) {
	      callBack(image);
	    }
	  };
	  image.src = url;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/1/28.
	 */

	var Matrix4 = exports.Matrix4 = function () {
	    function Matrix4() {
	        _classCallCheck(this, Matrix4);

	        this.identity = Matrix4.identity();
	    }

	    _createClass(Matrix4, null, [{
	        key: "identity",
	        value: function identity() {
	            return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	        }
	    }, {
	        key: "copy",
	        value: function copy(a) {
	            var out = Matrix4.identity();
	            out[0] = a[0];
	            out[1] = a[1];
	            out[2] = a[2];
	            out[3] = a[3];
	            out[4] = a[4];
	            out[5] = a[5];
	            out[6] = a[6];
	            out[7] = a[7];
	            out[8] = a[8];
	            out[9] = a[9];
	            out[10] = a[10];
	            out[11] = a[11];
	            out[12] = a[12];
	            out[13] = a[13];
	            out[14] = a[14];
	            out[15] = a[15];
	            return out;
	        }
	    }, {
	        key: "perspective",
	        value: function perspective(fovy, aspect, near, far) {
	            var f = 1.0 / Math.tan(fovy / 2),
	                nf = 1 / (near - far);
	            var out = Matrix4.identity();
	            out[0] = f / aspect;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 0;
	            out[4] = 0;
	            out[5] = f;
	            out[6] = 0;
	            out[7] = 0;
	            out[8] = 0;
	            out[9] = 0;
	            out[10] = (far + near) * nf;
	            out[11] = -1;
	            out[12] = 0;
	            out[13] = 0;
	            out[14] = 2 * far * near * nf;
	            out[15] = 0;
	            return out;
	        }
	    }, {
	        key: "orthogonal",
	        value: function orthogonal(left, right, bottom, top, near, far) {
	            var lr = 1 / (left - right),
	                bt = 1 / (bottom - top),
	                nf = 1 / (near - far);
	            var out = Matrix4.identity();
	            out[0] = -2 * lr;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 0;
	            out[4] = 0;
	            out[5] = -2 * bt;
	            out[6] = 0;
	            out[7] = 0;
	            out[8] = 0;
	            out[9] = 0;
	            out[10] = 2 * nf;
	            out[11] = 0;
	            out[12] = (left + right) * lr;
	            out[13] = (top + bottom) * bt;
	            out[14] = (far + near) * nf;
	            out[15] = 1;
	            return out;
	        }
	    }, {
	        key: "scale",
	        value: function scale(a, v) {
	            var x = v[0],
	                y = v[1],
	                z = v[2];

	            a[0] *= x;
	            a[1] *= x;
	            a[2] *= x;
	            a[3] *= x;
	            a[4] *= y;
	            a[5] *= y;
	            a[6] *= y;
	            a[7] *= y;
	            a[8] *= z;
	            a[9] *= z;
	            a[10] *= z;
	            a[11] *= z;
	        }
	    }, {
	        key: "translate",
	        value: function translate(a, v) {
	            var x = v[0],
	                y = v[1],
	                z = v[2];
	            a[12] += a[0] * x + a[4] * y + a[8] * z;
	            a[13] += a[1] * x + a[5] * y + a[9] * z;
	            a[14] += a[2] * x + a[6] * y + a[10] * z;
	            a[15] += a[3] * x + a[7] * y + a[11] * z;
	        }
	    }, {
	        key: "inverse",
	        value: function inverse(a) {
	            var a00 = a[0],
	                a01 = a[1],
	                a02 = a[2],
	                a03 = a[3],
	                a10 = a[4],
	                a11 = a[5],
	                a12 = a[6],
	                a13 = a[7],
	                a20 = a[8],
	                a21 = a[9],
	                a22 = a[10],
	                a23 = a[11],
	                a30 = a[12],
	                a31 = a[13],
	                a32 = a[14],
	                a33 = a[15],
	                b00 = a00 * a11 - a01 * a10,
	                b01 = a00 * a12 - a02 * a10,
	                b02 = a00 * a13 - a03 * a10,
	                b03 = a01 * a12 - a02 * a11,
	                b04 = a01 * a13 - a03 * a11,
	                b05 = a02 * a13 - a03 * a12,
	                b06 = a20 * a31 - a21 * a30,
	                b07 = a20 * a32 - a22 * a30,
	                b08 = a20 * a33 - a23 * a30,
	                b09 = a21 * a32 - a22 * a31,
	                b10 = a21 * a33 - a23 * a31,
	                b11 = a22 * a33 - a23 * a32,


	            // Calculate the determinant
	            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	            if (!det) {
	                return null;
	            }
	            det = 1.0 / det;
	            var out = Matrix4.identity();
	            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	            return out;
	        }
	    }]);

	    return Matrix4;
	}();

/***/ }
/******/ ]);