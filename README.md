# SurfaceChart

基于 ES 6 (ECMAScript 2015)  的 3D 曲面图表组件.

### 开发工具:WebStorm

### 源码编译

> $ cd SurfaceChart

 安装编译工具
> $ npm install 

> 修改 build.sh 里项目的路径为自己机器上的实际路径

编译源码
> $ build.sh

### 调用方法

``` javascript

 var arr = [[1, 2, 3, 1, 2, 3], [1, 2, 3, 1, 2, 3], [1, 2, 3, 1, 2, 3], [1, 2, 3, 1, 2, 3]];
 var chartWidth = 600;
 var chartHeight = 500;
 
 // 生成图表实例
 var chart = new SurfaceChart(arr, chartWidth, chartHeight);
 
 // 将曲面图显示到网页
 var container = document.getElementById('surfaceChart_Container');
 container.appendChild(chart.domElement);
       
```