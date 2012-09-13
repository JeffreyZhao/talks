1、使用npm安装express和esprima包：

    npm install express esprima

2、搞点错误出来，例如使用未声明变量或是访问`null`的属性。

3、将`this.error.stack;`外加上`Wind.rebuildStack`。

4、添加个抛出错误的方法并调用：

    var throwError = function () {
        throw new Error("Hello World");
    };


