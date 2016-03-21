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
  // 下边 "可选参数" 的意思是指: 如果不想指定这个字段的信息, 就在 params 里删除这个字段
  var params = {
        width: 600,  // 必设参数,  图表在屏幕上的宽度
        height: 500, // 必设参数,  一般高度要设置得比宽度小,图表会显得比较漂亮
        title: '3D 曲面图表 - 0', // 可选参数, 图表的名称, 默认为空
        fontColor: 0xfafafa, // 可选参数, 图表上文字的颜色, 默认为0xfafafa
        backgroundColor: 0x353535, // 可选参数, 图表背景颜色, 默认为 0x353535
        surfaceColors:  [0x215c91,  0x70af48, 0x3769bd, 0xfec536, 0xa5a5a5, 0xf27934, 0x6aa3d9] // 可选参数, 曲面顶点颜色,如果要指定, 数组长度至少为 7 位.
   };
 
 // 生成图表实例
 var chart = new SurfaceChart(arr, params);
 
 // 将曲面图显示到网页
 var container = document.getElementById('surfaceChart_Container');
 container.appendChild(chart.domElement);
       
```