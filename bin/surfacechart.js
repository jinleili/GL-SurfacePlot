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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by grenlight on 16/3/17.
	 */

	var SurfaceChart = exports.SurfaceChart = function () {
	    function SurfaceChart(container, dataArr) {
	        var rowCount = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	        var colCount = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

	        _classCallCheck(this, SurfaceChart);

	        this.parentElement = container;
	        this.width = this.parentElement.style.width;
	        this.height = this.parentElement.style.height;
	        //参考线条数
	        this.referenceLineCount = 6;

	        if (this.width < 300 || this.height < 200) {
	            throw new Error('SurfaceChart 绘制区域的宽不能小于 300, 高不能小于 200');
	        }
	        if (!dataArr || dataArr.length === 0) {
	            throw new Error('SurfaceChart 需要有效数组做为初始化参数');
	        }
	        if (rowCount < 2 || colCount < 2) {
	            throw new Error('SurfaceChart 至少需要两行两列数据 ');
	        }
	        //选第一个值做为起始参考值
	        this.minValue = this.maxValue = parseFloat(dataArr[0]);
	        this._validateDataType(this.minValue);
	        this._formatData(dataArr);
	    }

	    _createClass(SurfaceChart, [{
	        key: '_validateDataType',
	        value: function _validateDataType(data) {
	            if (data === undefined) {
	                //console.log(data);
	                throw new Error('SurfaceChart 需要的数据项必须是整数或浮点数');
	            }
	        }

	        /**
	         * 格式化数据
	         *
	         * 获取最小最大值及 x, y 轴上的 数值<=>像素 缩放比
	         * @param dataArr
	         * @private
	         */

	    }, {
	        key: '_formatData',
	        value: function _formatData(dataArr) {
	            this.dataSource = [];

	            for (var i = 1; i < dataArr.length; i++) {
	                var value = parseFloat(dataArr[i]);
	                this._validateDataType(value);
	                if (value < this.minValue) {
	                    this.minValue = value;
	                } else if (value > this.maxValue) {
	                    this.maxValue = value;
	                }
	                this.dataSource.push(value);
	            }
	            //this.minValue = Math.floor(this.minValue);
	            //this.maxValue = Math.ceil(this.maxValue);
	            var distance = Math.abs(this.maxValue - this.minValue);
	            //为了图形美观,坐标上的刻度值应该做一定的舍入
	            var gap = distance / (this.referenceLineCount - 1).toFixed(1);
	            gap = this._calculateGap(gap, 1);
	            console.log('gap: ', gap);

	            this.minValue -= extensionValue;
	            this.maxValue += extensionValue;
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

/***/ }
/******/ ]);