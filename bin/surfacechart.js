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

	var _SCSurface = __webpack_require__(4);

	var _SCRuler = __webpack_require__(5);

	var _SCStyle = __webpack_require__(7);

	var _SCDomElement = __webpack_require__(8);

	var _shaders = __webpack_require__(10);

	var _WebGLRenderer = __webpack_require__(11);

	var _Matrix = __webpack_require__(13);

	var _Vector = __webpack_require__(14);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SurfaceChart = exports.SurfaceChart = function () {
	    function SurfaceChart(dataArr, params) {
	        _classCallCheck(this, SurfaceChart);

	        if (params.width < 300 || params.height < 200) {
	            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
	        }
	        if (!dataArr || dataArr.length === 0) {
	            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
	        }

	        this.style = new _SCStyle.SCStyle(params);

	        this.renderer = new _WebGLRenderer.WebGLRenderer();
	        this.renderer.setStyle(params.width, params.height, 'margin:0px; position:absolute; z-index:0;');
	        this.gl = this.renderer.gl;

	        this.style.canvasHeight = this.renderer.canvasHeight;
	        this.style.canvasWidth = this.renderer.canvasWidth;

	        this.domElementObj = new _SCDomElement.SCDomElement(this.style, params.title);
	        this.domElement = this.domElementObj.panel;
	        this.domElement.appendChild(this.renderer.canvas);

	        this.dataSource = new _SCDataSource.SCDataSource(dataArr, this.style);

	        this.mvMatrix = _Matrix.Matrix4.identity();
	        var offsetZ = -this.style.canvasHeight + this.dataSource.zFar * 2.5;
	        _Matrix.Matrix4.translate(this.mvMatrix, [30, 0.0, offsetZ]);
	        _Matrix.Matrix4.rotate(this.mvMatrix, this.mvMatrix, 0.35, [1, 0, 0]);
	        _Matrix.Matrix4.rotate(this.mvMatrix, this.mvMatrix, -30 / 180 * Math.PI, [0, 1, 0]);

	        //构建一个与图表坐标系一致的投影矩阵
	        // this.pMatrix = Matrix4.orthogonal(-this.renderer.centerX, this.renderer.centerX, -this.renderer.centerY, this.renderer.centerY, -5000.0, 5000.0);
	        this.pMatrix = _Matrix.Matrix4.perspective(45 / 180 * Math.PI, this.style.canvasWidth / this.style.canvasHeight, 0.1, 50000);

	        this.initProgram();

	        //曲面绘制类
	        this.surface = new _SCSurface.SCSurface(this.renderer.gl, this.prg, this.dataSource);
	        //标尺线
	        this.ruler = new _SCRuler.SCRuler(this.renderer.gl, this.prg, this.dataSource);
	        this.draw();

	        this.domElementObj.showLabels(this.ruler.labelList, this.mvMatrix);
	    }

	    /**
	     *  初始化着色器
	     */


	    _createClass(SurfaceChart, [{
	        key: 'initProgram',
	        value: function initProgram() {
	            this.prg = this.gl.makeProgram(_shaders.pixelVS, _shaders.pixelFS);
	            if (this.prg === null) {
	                console.log('着色器加载失败');
	            } else {
	                this.prg.setAttribLocations(['vertexPosition', 'vertexColor']);
	                this.prg.setUniformLocations(['pMatrix', 'mvMatrix']);

	                this.gl.uniformMatrix4fv(this.prg.mvMatrix, false, this.mvMatrix);
	                this.gl.uniformMatrix4fv(this.prg.pMatrix, false, this.pMatrix);
	            }
	        }

	        /**
	         * 绘制
	         */

	    }, {
	        key: 'draw',
	        value: function draw() {
	            this.gl.viewport(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight);
	            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	            var color = this.style.rgbBackgroundColor;
	            this.gl.clearColor(color[0], color[1], color[2], 1.0);

	            //透明度混合
	            this.gl.enable(this.gl.BLEND);
	            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

	            this.ruler.draw();
	            this.surface.draw();
	        }
	    }]);

	    return SurfaceChart;
	}();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SCDataSource = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by grenlight on 16/3/19.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _Color = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SCDataSource = exports.SCDataSource = function () {
	    function SCDataSource(dataArr, styleObj) {
	        _classCallCheck(this, SCDataSource);

	        var colors = [0x215c91, 0x70af48, 0x3769bd, 0xfec536, 0xa5a5a5, 0xf27934, 0x6aa3d9];
	        this.colorGroup = this._colors(colors);
	        this.style = styleObj;
	        this.drawWidth = styleObj.drawWidth;
	        this.drawHeight = styleObj.drawHeight;
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
	        key: '_colors',
	        value: function _colors(colors) {
	            var arr = [];
	            for (var i = 0; i < colors.length; i++) {
	                arr.push(_Color.Color.hex2rgb(colors[i]));
	            }
	            return arr;
	        }
	    }, {
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

	            this.colGap = this.drawWidth / (this.colCount - 1);

	            //生成刻度集合
	            this._calculateScaleLabel();
	            //转换数据点为屏幕顶点坐标
	            this._generateVertices();
	        }

	        /**
	         * 转换数据点为屏幕顶点坐标
	         * 顶点由内向外生成
	         */

	    }, {
	        key: '_generateVertices',
	        value: function _generateVertices() {
	            this.vertices = [];
	            this.colors = [];
	            //z 轴远端坐标
	            this.zFar = -(this.colGap * this.rowCount / 2);
	            //初始值给正, 避免后面赋值时的条件判断
	            var z = this.zFar - this.colGap;
	            for (var i = 0; i < this.rowCount; i++) {
	                z += this.colGap;

	                var x = -(this.drawWidth / 2.0) - this.colGap;
	                var rowData = this.dataSource[i];
	                for (var j = 0; j < this.colCount; j++) {
	                    x += this.colGap;
	                    var yValue = rowData[j];
	                    if (typeof yValue !== 'number') {
	                        console.log("invalid data: ", i, j, rowData);
	                    }
	                    this.vertices.push(x, (yValue - this.scaleCenterY) * this.dataScale, z);

	                    var color = this._calculateVertexColor(yValue);
	                    this.colors.push(color[0], color[1], color[2]);
	                }
	            }
	            this._generateIndices();
	            // console.log(this.minValue, this.maxValue);
	            // console.log(this.scaleLabels);
	        }
	    }, {
	        key: '_calculateVertexColor',
	        value: function _calculateVertexColor(yValue) {
	            var pre = this.scaleLabels[0];
	            for (var k = 1; k < this.scaleLabels.length; k++) {
	                var current = this.scaleLabels[k];
	                if (yValue <= pre && yValue >= current) {
	                    return this.colorGroup[k - 1];
	                }
	                pre = current;
	            }
	            return this.colorGroup[0];
	        }
	    }, {
	        key: '_generateIndices',
	        value: function _generateIndices() {
	            this.indices = [];
	            for (var i = 1; i < this.rowCount; i++) {
	                var rowTemp = i * this.colCount;
	                for (var j = 1; j < this.colCount; j++) {
	                    var current = rowTemp + j;
	                    var pre = current - 1;
	                    var preRow = current - this.colCount;
	                    var preRowPre = preRow - 1;
	                    this.indices.push(preRowPre, preRow, pre, preRow, current, pre);
	                }
	            }
	        }

	        /**
	         * 生成刻度集合 及 应对屏幕中心线的刻度 scaleCenterY
	         *
	         * @private
	         */

	    }, {
	        key: '_calculateScaleLabel',
	        value: function _calculateScaleLabel() {
	            var distance = Math.abs(this.maxValue - this.minValue);
	            //为了图形美观,坐标上的刻度值应该做一定的舍入
	            var scaleGap = distance / (this.referenceLineCount - 1).toFixed(2);
	            scaleGap = this._calculateGap(scaleGap, 1);

	            this.scaleCenterY = this.minValue + distance / 2.0;
	            //标尺 在 x 轴上的绘制起点
	            this.scaleStartX = this.colCount / 2 * -this.colGap;

	            var currentLabel = 0;
	            if (this.maxValue > 0 && this.minValue < 0) {
	                while (currentLabel < this.maxValue) {
	                    currentLabel += scaleGap;
	                    this.scaleLabels.unshift(currentLabel);
	                }
	                currentLabel = 0;
	            } else {
	                currentLabel = this.maxValue;
	            }
	            this.scaleLabels.push(currentLabel);
	            while (currentLabel > this.minValue) {
	                currentLabel -= scaleGap;
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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/18.
	 */

	var Color = exports.Color = function () {
	  function Color() {
	    _classCallCheck(this, Color);
	  }

	  _createClass(Color, null, [{
	    key: 'hex2rgb',
	    value: function hex2rgb(hex) {
	      if (typeof hex === 'string' && hex.substr(0, 1) === '#') {
	        hex = '0x' + hex.substr(1, hex.length - 1);
	      }
	      var out = [];
	      out[0] = (hex >> 16 & 0xFF) / 255;
	      out[1] = (hex >> 8 & 0xFF) / 255;
	      out[2] = (hex & 0xFF) / 255;

	      return out;
	    }
	  }]);

	  return Color;
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/20.
	 */

	var SCSurface = exports.SCSurface = function () {
	    function SCSurface(gl, prg, dataSource) {
	        _classCallCheck(this, SCSurface);

	        this.gl = gl;
	        this.prg = prg;
	        this.dataSource = dataSource;

	        this.vertices = dataSource.vertices;
	        this.colorList = dataSource.colors;
	        this.indices = dataSource.indices;
	        // console.log(this.vertices, this.colorList, this.indices);
	        // this.vertices = [-25,0.0, 0.0,  25, 0.0, 0.0,  25, 50, 0.0];
	        // this.indices = [0, 1, 2];
	        // this.colorList = [1.0, 0.0, 0.0,  1.0, 0.0, 0.0,   1.0, 0.0, 0.0];
	        this.vetexBuffer = gl.createArrayBufferWithData(this.vertices);
	        this.indexBuffer = gl.createElementBufferWithData(this.indices);
	        this.colorBuffer = gl.createArrayBufferWithData(this.colorList);

	        this.updateBufferData();
	    }

	    _createClass(SCSurface, [{
	        key: "updateBufferData",
	        value: function updateBufferData() {
	            // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vetexBuffer);
	            // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
	            //
	            // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
	            // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colorList), this.gl.STATIC_DRAW);

	            // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	            // this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
	        }
	    }, {
	        key: "draw",
	        value: function draw() {
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
	    }]);

	    return SCSurface;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SCRuler = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by grenlight on 16/3/21.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 管理图表上的标尺线及刻度
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _SCLabel = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SCRuler = exports.SCRuler = function () {
	    function SCRuler(gl, prg, dataSource) {
	        _classCallCheck(this, SCRuler);

	        this.gl = gl;
	        this.prg = prg;
	        this.dataSource = dataSource;
	        this.generateScale();

	        this.vetexBuffer = gl.createArrayBufferWithData(this.vertices);
	        this.indexBuffer = gl.createElementBufferWithData(this.indices);
	        this.colorBuffer = gl.createArrayBufferWithData(this.colors);
	    }

	    /**
	     * 计算标尺的顶点
	     * 
	     * 标尺默认的状态是个顺时针旋转了 90 度的 L:
	     * 一条标尺线由两条直线(四个三角形)组成
	     */


	    _createClass(SCRuler, [{
	        key: 'generateScale',
	        value: function generateScale() {
	            this.vertices = [];
	            this.indices = [];
	            this.colors = [];
	            this.labelList = [];
	            var halfLineWidth = 1.0;
	            var x = this.dataSource.scaleStartX;
	            var maxZ = this.dataSource.zFar;
	            var offset = 0;
	            var color = this.dataSource.style.rgbFontColor;
	            var y = void 0,
	                bottom = void 0,
	                top = void 0,
	                topRight = void 0;
	            for (var i = 0; i < this.dataSource.scaleLabels.length; i++) {
	                var label = this.dataSource.scaleLabels[i];
	                y = (label - this.dataSource.scaleCenterY) * this.dataSource.dataScale;
	                bottom = [x, y, -maxZ];
	                top = [x, y, maxZ];
	                topRight = [-x, y, maxZ];

	                this.labelList.push({ coord: bottom, label: label });
	                this.vertices.push(bottom[0], bottom[1] + halfLineWidth, bottom[2], bottom[0], bottom[1] - halfLineWidth, bottom[2], top[0], top[1] + halfLineWidth, top[2], top[0], top[1] - halfLineWidth, top[2], topRight[0], topRight[1] + halfLineWidth, topRight[2], topRight[0], topRight[1] - halfLineWidth, topRight[2]);
	                this.colors = this.colors.concat(color).concat(color).concat(color).concat(color).concat(color).concat(color);
	                offset = i * 6;
	                this.indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2, offset + 2, offset + 3, offset + 4, offset + 3, offset + 5, offset + 4);
	            }
	            //底部刻度
	            bottom = [-x, y, maxZ];
	            top = [-x, y, -maxZ];
	            topRight = [x, y, -maxZ];
	            this.vertices.push(bottom[0], bottom[1] + halfLineWidth, bottom[2], bottom[0], bottom[1] - halfLineWidth, bottom[2], top[0], top[1] + halfLineWidth, top[2], top[0], top[1] - halfLineWidth, top[2], topRight[0], topRight[1] + halfLineWidth, topRight[2], topRight[0], topRight[1] - halfLineWidth, topRight[2]);
	            this.colors = this.colors.concat(color).concat(color).concat(color).concat(color).concat(color).concat(color);
	            offset += 6;
	            this.indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2, offset + 2, offset + 3, offset + 4, offset + 3, offset + 5, offset + 4);
	        }
	    }, {
	        key: 'draw',
	        value: function draw() {
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
	    }, {
	        key: 'drawLabel',
	        value: function drawLabel() {}
	    }]);

	    return SCRuler;
	}();

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/23.
	 *
	 * 标尺上的刻度的绘制
	 */

	var SCLabel = exports.SCLabel = function () {
	    function SCLabel(parentNode, labelList, styleStr) {
	        _classCallCheck(this, SCLabel);

	        this.canvas = document.createElement("canvas");
	        this.ctx = this.canvas.getContext("2d");

	        parentNode.appendChild(this.canvas);
	    }

	    _createClass(SCLabel, [{
	        key: "draw",
	        value: function draw(ctx) {
	            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	            ctx.fillText(someMsg, pixelX, pixelY);
	        }
	    }]);

	    return SCLabel;
	}();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SCStyle = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by grenlight on 16/3/22.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _Color = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SCStyle = exports.SCStyle = function () {
	    function SCStyle(params) {
	        _classCallCheck(this, SCStyle);

	        this.width = params.width;
	        this.height = params.height;
	        this.fontColor = params.fontColor ? params.fontColor : 0xfafafa;
	        this.backgroundColor = params.backgroundColor ? params.backgroundColor : 0x353535;
	        this.rgbFontColor = _Color.Color.hex2rgb(this.fontColor);
	        this.rgbBackgroundColor = _Color.Color.hex2rgb(this.backgroundColor);

	        //这里的 padding 并不表示最终曲面与画板的实际内边距
	        this.paddingLR = 50;
	        this.paddingTop = 50;
	        this.paddingBottom = 50;

	        this._canvasWidth = 0;
	        this._canvasHeight = 0;
	        this.drawWidth = 0;
	        this.drawHeight = 0;
	    }

	    _createClass(SCStyle, [{
	        key: 'canvasWidth',
	        set: function set(newValue) {
	            this._canvasWidth = newValue;
	            this.drawWidth = this._canvasWidth - this.paddingLR * 2;
	        },
	        get: function get() {
	            return this._canvasWidth;
	        }
	    }, {
	        key: 'canvasHeight',
	        set: function set(newValue) {
	            this._canvasHeight = newValue;
	            this.drawHeight = this._canvasHeight - (this.paddingBottom + this.paddingTop);
	        },
	        get: function get() {
	            return this._canvasHeight;
	        }
	    }]);

	    return SCStyle;
	}();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SCDomElement = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by grenlight on 16/3/21.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _Vector = __webpack_require__(9);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SCDomElement = exports.SCDomElement = function () {
	    function SCDomElement(style) {
	        var title = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	        _classCallCheck(this, SCDomElement);

	        this.title = title;
	        this.style = style;
	        this.panel = this.createPanel(style);

	        if (this.title) {
	            this.createTitle(style);
	        }
	        this.leftLabels = [];
	        this.leftLabelsTN = [];
	        this.createLabels(style);
	    }

	    _createClass(SCDomElement, [{
	        key: 'createPanel',
	        value: function createPanel(style) {
	            var styleStr = 'position:relative;display:block; padding:0px; margin: 0px;  -webkit-tap-highlight-color:rgba(0, 0, 0, 0); -webkit-user-select: none; user-select: none; width:' + style.width + 'px; ' + 'height:' + style.height + 'px; color: ' + style.fontColor + '; background-color:' + style.backgroundColor;
	            return this.createElement('div', styleStr);
	        }
	    }, {
	        key: 'createLabels',
	        value: function createLabels() {
	            for (var i = 0; i < 7; i++) {
	                var div = this.createElement('div', 'position:absolute; text-align:right; font-size: 12px; display:None;' + ' width: 100px; height20px');
	                var textNode = document.createTextNode("");
	                div.appendChild(textNode);
	                this.panel.appendChild(div);
	                this.leftLabels.push(div);
	                this.leftLabelsTN.push(textNode);
	            }
	        }
	    }, {
	        key: 'showLabels',
	        value: function showLabels(arr, mvMatrix) {
	            for (var i = 0; i < arr.length; i++) {
	                var div = this.leftLabels[i];
	                var textNode = this.leftLabelsTN[i];
	                var coord = _Vector.Vector3.applyMatrix4(arr[i].coord, mvMatrix);
	                console.log('coord: ', coord);
	                div.style.display = 'block';
	                div.style.top = this.style.canvasHeight / 2 - coord[1] + 'px';
	                div.style.left = this.style.canvasWidth / 2 - 100 - 30 + coord[0] + 'px';
	                textNode.nodeValue = arr[i].label;
	            }
	        }
	    }, {
	        key: 'createTitle',
	        value: function createTitle(style) {
	            var styleStr = 'position:absolute; left:0px; top: 5px; font-size: 20px; font-style:bold;  width:' + style.width + 'px; ' + 'height:30px; text-align: center; z-index: 10';
	            var titleElement = this.createElement('h3', styleStr);
	            titleElement.innerHTML = this.title;
	            this.panel.appendChild(titleElement);
	        }
	    }, {
	        key: 'createElement',
	        value: function createElement(elementType, styleStr) {
	            var ele = document.createElement(elementType);
	            ele.setAttribute('style', styleStr);
	            return ele;
	        }
	    }]);

	    return SCDomElement;
	}();

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/23.
	 */

	var Vector3 = exports.Vector3 = function () {
	    function Vector3() {
	        _classCallCheck(this, Vector3);
	    }

	    _createClass(Vector3, null, [{
	        key: "applyMatrix4",
	        value: function applyMatrix4(vec, m) {
	            var x = vec[0];
	            var y = vec[1];
	            var z = vec[2];
	            var w = 0;

	            vec[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
	            vec[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
	            vec[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;

	            return vec;
	        }
	    }]);

	    return Vector3;
	}();

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by grenlight on 16/1/6.
	 */

	var pixelVS = exports.pixelVS = "\nattribute vec3 vertexPosition;\nattribute vec3 vertexColor;\n\nuniform mat4 mvMatrix;\nuniform mat4 pMatrix;\n\nvarying vec3 color;\n\nvoid main(void) {\n  color = vertexColor;\n  gl_Position = pMatrix * mvMatrix * vec4(vertexPosition, 1.0);\n}\n";

	var pixelFS = exports.pixelFS = "\nprecision mediump float;\n\nvarying vec3 color;\n\nvoid main(void) {\n  gl_FragColor = vec4(color, 0.6);\n  // gl_FragColor = vec4(1.0, 0.0, 0.0, 0.6);\n}\n";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.WebGLRenderer = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by grenlight on 16/3/18.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _GLUtils = __webpack_require__(12);

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
	            // this.canvas.setAttribute('id', elementId);
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

	            this.canvasWidth = width * window.devicePixelRatio;
	            this.canvasHeight = height * window.devicePixelRatio;
	            this.canvas.width = this.canvasWidth;
	            this.canvas.height = this.canvasHeight;

	            if (otherStyleStr === null) {
	                this.canvas.style.width = width + 'px';
	                this.canvas.style.height = height + 'px';
	            } else {
	                this.canvas.setAttribute('style', 'width:' + width + 'px; height: ' + height + 'px; ' + otherStyleStr + ';');
	            }
	            this.canvas.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';

	            this.centerX = this.canvasWidth / 2.0;
	            this.centerY = this.canvasHeight / 2.0;
	        }
	    }, {
	        key: 'getGLContext',
	        value: function getGLContext() {
	            var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
	            var context = null;
	            for (var i = 0; i < names.length; ++i) {
	                context = this.canvas.getContext(names[i], {
	                    // premultipliedAlpha: false  // Ask for non-premultiplied alpha
	                });
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
/* 12 */
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
/* 13 */
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
	        value: function translate(out, v) {
	            var x = v[0],
	                y = v[1],
	                z = v[2];
	            out[12] += out[0] * x + out[4] * y + out[8] * z;
	            out[13] += out[1] * x + out[5] * y + out[9] * z;
	            out[14] += out[2] * x + out[6] * y + out[10] * z;
	            out[15] += out[3] * x + out[7] * y + out[11] * z;
	            return out;
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

	        /**
	         * Rotates a mat4 by the given angle around the given axis
	         *
	         * @param {mat4} out the receiving matrix
	         * @param {mat4} a the matrix to rotate
	         * @param {Number} rad the angle to rotate the matrix by
	         * @param {array} axis the axis to rotate around
	         * @returns {mat4} out
	         */

	    }, {
	        key: "rotate",
	        value: function rotate(out, a, rad, axis) {
	            var x = axis[0],
	                y = axis[1],
	                z = axis[2],
	                len = Math.sqrt(x * x + y * y + z * z),
	                s,
	                c,
	                t,
	                a00,
	                a01,
	                a02,
	                a03,
	                a10,
	                a11,
	                a12,
	                a13,
	                a20,
	                a21,
	                a22,
	                a23,
	                b00,
	                b01,
	                b02,
	                b10,
	                b11,
	                b12,
	                b20,
	                b21,
	                b22;

	            len = 1 / len;
	            x *= len;
	            y *= len;
	            z *= len;

	            s = Math.sin(rad);
	            c = Math.cos(rad);
	            t = 1 - c;

	            a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
	            a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
	            a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

	            // Construct the elements of the rotation matrix
	            b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
	            b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
	            b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;

	            // Perform rotation-specific matrix multiplication
	            out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	            out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	            out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	            out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	            out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	            out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	            out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	            out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	            out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	            out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	            out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	            out[11] = a03 * b20 + a13 * b21 + a23 * b22;

	            if (a !== out) {
	                // If the source and destination differ, copy the unchanged last row
	                out[12] = a[12];
	                out[13] = a[13];
	                out[14] = a[14];
	                out[15] = a[15];
	            }
	            return out;
	        }
	    }]);

	    return Matrix4;
	}();

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/22.
	 */

	var Vector4 = exports.Vector4 = function () {
	    function Vector4() {
	        _classCallCheck(this, Vector4);
	    }

	    _createClass(Vector4, null, [{
	        key: "applyMatrix4",
	        value: function applyMatrix4(vec, m) {
	            var x = vec[0];
	            var y = vec[1];
	            var z = vec[2];
	            var w = vec[3];

	            var e = m;

	            vec[0] = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
	            vec[1] = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
	            vec[2] = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
	            vec[3] = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

	            return vec;
	        }
	    }]);

	    return Vector4;
	}();

/***/ }
/******/ ]);