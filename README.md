# balance

命令行下的证券交易前端。文本交互界面基于[blessed](https://github.com/chjj/blessed)技术。

目前本项目仍然在开发中。前端界面已可以工作，针对几种常见API的适配器还在规划中。

![order_act.png](https://media.githubusercontent.com/media/echoma/lfs/master/balance/img/order_act.png)

以上截图对应的窗口布局文件：![order_act.dat](https://raw.githubusercontent.com/echoma/lfs/master/balance/img/order_act.dat)

## balance的目标用户

balance的目标用户是使用linux的交易系统开发者、算法交易者。这些用户通常有以下需求：
  - 需要基于命令行的、交互界面友好的交易前端。
  - 需要命令行工具实时查看交易数据。

## balance的特性

  - 支持鼠标操作（但有些bug）。当然也可以只使用键盘完成所有操作。
  - 支持布局保存和加载。程序启动时可以加载指定的窗口布局文件。
  - 纯前端，与后端逻辑解耦。使用者可以通过适配器适配各种各样的交易API。

## balance如何跟多种多样的交易API或交易后台配合工作呢？

下图是一个典型的使用balance组建的交易环境，分为3层：
  - 第1层：就是balance，它是前端界面。balance通过RPC与适配器层进行通信。
  - 第2层：适配器层是位于balance和交易API之间的中间层。适配器通过交易API（或其他通信方式）访问其他交易平台。可由第三方提供或使用着自己编写。
  - 第3层：各交易平台或券商提供的交易API。

```txt
   +-------------+
   |             |               第 1层 ，前 端
   |   BALANCE   |
   |             |              就 是 balance程 序
   +------+------+
          |
          |RPC                    +-------+
          |
          |
+---------v----------+
|                    |           第 2层 ，适 配 器
|      适 配 器         |
|                    |          第 三 方 提 供 ，或
+---------+----------+          使 用 者 自 己 编 写
          |
          |
          |API调 用                 +-------+
          |
          |
+---------v----------+
|                    |           第 3层 ，后 端
| 各 种 交 易 API 或 平 台  |
|                    |        提 供 了 交 易 API的 平 台
+--------------------+

```

## 如何编写自己的适配器

balance使用了google的[gRPC](https://grpc.io/)。在RPC调用中，balance作为客户端，适配器作为服务端。

编写自己的适配器，其实就是使用[gRPC](https://grpc.io/)编写代码对请求进行响应。

balance使用的grpc服务的定义位于[src/grpc](./src/grpc)中的`*.proto`文件中。

在[src/grpc/example_adapter](./src/grpc/example_adapter)中有几种语言编写的适配器例子。

## 命令行参数

-h: 打印帮助信息。

-l: 加载布局文件。如果没有指定，则启用预定义的布局(只打开一个全局管理器窗口)。

-d: 输出调试日志到指定文件。如果没有指定，则不输出任何日志。

-s: RPC服务端的地址，默认是`localhost:9527`.

## 快捷键

Esc: 关闭当前窗口

Tab/Up/Down: 遍历表单中的各个输入组件、按钮。

Ctrl+g: 显示`全局管理对话框(Global Management Dialog)`。该对话框有很多全局功能入口。

Ctrl+f: 弹出一个询问框，用户输入窗口编号后，该编号对应的对话框将成为最顶层窗口。

**Ctrl+r**: 在某个窗口上使用此快捷键，将弹出该对话框的配置设置界面。例如窗口的位置、尺寸、查看的账户、数据刷新频率等，因此这个快捷键**非常重要**。

## 拟支持的交易API

balance计划对以下交易API自带一个可用的适配器：
  - [上期综合交易平台-CTP](http://www.sfit.com.cn/5_2_DocumentDown.htm)
  - [易盛API](http://www.esunny.com.cn/index.php?m=content&c=index&a=lists&catid=71)，[FAQ](https://www.gitbook.com/book/esunnyapi/esunnyapi_faq/details)
  - [forex嘉盛API](http://fxcodebase.com/wiki/index.php/Main_Page)

这些API的适配器将来会使用另一个github repo来承载。