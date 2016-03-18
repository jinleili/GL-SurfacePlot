#!/bin/sh

# 先 cd 到项目的根目录
cd ~/WebGL_Lib/图表/SurfaceChart

# 执行编译
webpack --display-error-details
webpack --config webpack.config.js
