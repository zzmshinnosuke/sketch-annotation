# SketchLabel

草图标注工具，将绘制好的矢量草图按物体实例对笔画进行分类，并标注每个物体对应图片中的boundingbox，以及每个物体对应的评估项。



## Environments

* ThinkPhp 5.0

* PHP + Js

* [XAMPP](https://www.apachefriends.org/index.html)



## Acknowledgement for ThirdParty libraries

* [jQuery](https://jquery.com/)

* [jQuery UI](https://jqueryui.com/)

* [jquery.ui.rotatable](https://github.com/godswearhats/jquery-ui-rotatable)

* [jQuery Simulate](https://github.com/jquery/jquery-simulate)

* [p5.js](https://p5js.org/)

* [md5](https://github.com/blueimp/JavaScript-MD5)

* [sketch_rnn](https://magenta.tensorflow.org/sketch-rnn-demo)



## Run

1. linux系统安装xampp

2. 将系统目录整个拷贝到/htdocs目录下





# Log



## 20200627

1.添加了一个笔画是否选中的复选框

2.添加了框选功能，可以更快的选中笔画



## 20200628

image显示不用canvas渲染了，不然每次刷新都都要渲染一次，或许能减少运算量

修改了一个bug，添加了是否删除笔画复选框后，没有初始化一些参数，导致鼠标移到笔画上没有反应



## 20200806

image又改回了canvas渲染，因为要在上面画boundingbox

添加了direnction和quality标注项



## 20200813

界面做了一定的调整，对界面功能进一步进行了分类。

boundingbox可以添加新的框，还可以修改框的大小。

修改了一些画框过程中的bug



## 20201008

项目加载了第三批数据，并上传服务器

并将删除物体，修改了，每次删除后指向前一个。



## 20201017

修改了layout.js 中submit() 和 Index.php 中save()，保存时上传字符串长度，进行判断，防止上传过程中信息的丢失。



```

window.onload = function (){

    var userName=”xiaoming”;

    alert(userName);

}

```

上述代码再整个页面加载完执行，而以下代码则不能正常执行，提示random()函数不存在

```

$(document).ready(function (){

    var userName=”xiaoming”;

    alert(userName);

});

```



## 20201124

添加了一个计算md5值的js引用包，可以计算上传字符串的md5值，改进了原来通过上传字符串长度验证的方式，这样能更好的保证上传的准确性。



## 20201224

添加了一个审核功能，分为审核和标注两种模式，在前后端传递参数review。审核模式下参数review为任务号，标注模式下review为-1。审核模式，保存后如果有修改，同时保证到result2和result3中，如果没有修改保存到result2中。同时修改了load，在审核模式下，自动把标注后的加载进来，如果是标注模式，就不加载。php后台load函数中，如果是审核模式，就优先加载result2中的；如果时标注模式，就加载result1中的。



## 20201227

md5值在php接收端是按整形接收的，部分任务上传的时候会出现上传的MD5值改变的情况，导致保存不成功。将md5的接收方式改为了字符串型，就可以了。
