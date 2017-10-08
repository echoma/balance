# 适配器的例子

用不同语言写的适配器。逻辑都是一样的。

## node

nodejs做的简单适配层。

运行前，需要在`node`目录使用`npm install`命令将自动根据package.json安装好依赖。

安装好依赖后，在`node`目录执行`node ./`即可启动该适配器。

## python

python做的简单适配层。（python2\3都可以）

运行前，需要安装`grpcio`这个模块。（可使用命令`pip install grpcio`进行安装）

安装好依赖模块后，在`python`目录执行`python ./adapater.py`即可启动该适配器。

注：`*_pb2*.py`是由`gen_code.sh`调用grpc工具自动生成的。（`pip install grpcio-tools`）

注：应该也能在python3下运行，但是没试过。