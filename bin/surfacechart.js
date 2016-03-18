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

	var _ChartCanvas = __webpack_require__(2);

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

	        if (this.width < 300 || this.height < 200) {
	            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
	        }
	        if (!dataArr || dataArr.length === 0) {
	            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
	        }

	        this.canvas = new _ChartCanvas.ChartCanvas(width, height);
	        this.domElement = this.canvas.renderer.view;

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

	    _createClass(SurfaceChart, [{
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
	            var colGap = (this.width - this.paddingLR * 2) / (this.colCount - 1);
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
	            this.dataScale = (this.height - this.paddingBottom - this.paddingTop) / Math.abs(this.scaleLabels[0] - this.scaleLabels[this.scaleLabels.length - 1]);
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
	 * Created by grenlight on 16/3/18.
	 */

	var ChartCanvas = exports.ChartCanvas = function () {
	    function ChartCanvas(width, height) {
	        _classCallCheck(this, ChartCanvas);

	        this.renderer = PIXI.autoDetectRenderer(width, height, {
	            transparent: true,
	            interactive: false,
	            resolution: window.devicePixelRatio
	        });
	        this.renderer.view.setAttribute('style', 'margin:0px; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); width:' + width + 'px; height: ' + height + 'px');
	        this.stage = new PIXI.Container();
	        this.graphics = new PIXI.Graphics();
	    }

	    _createClass(ChartCanvas, [{
	        key: 'drawBubbleView',
	        value: function drawBubbleView(graphics, color) {
	            graphics.clear();
	            graphics.beginFill(color);
	            graphics.drawRoundedRect(this.frame.x, this.frame.y, this.frame.width, this.frame.height, this.cornerRadius);

	            var anglePointY = void 0,
	                angleBottomY = void 0;
	            if (this.isUpDirection) {
	                anglePointY = this.angleFrame.y;
	                angleBottomY = this.angleFrame.getMaxY();
	            } else {
	                anglePointY = this.angleFrame.getMaxY();
	                angleBottomY = this.angleFrame.y;
	            }
	            graphics.moveTo(this.angleFrame.x, angleBottomY);
	            graphics.lineTo(this.angleFrame.center.x, anglePointY);
	            graphics.lineTo(this.angleFrame.getMaxX(), angleBottomY);
	            graphics.endFill();
	        }
	    }]);

	    return ChartCanvas;
	}();

/***/ }
/******/ ]);