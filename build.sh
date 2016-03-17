#!/bin/sh

# 先 cd 到项目的根目录
cd ~/江苏云媒阅读平台/Retech\ Apps/图表/SurfaceChart

# 执行编译
webpack --display-error-details
webpack --config webpack.config.js
