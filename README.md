# balance

Command line security trading frontend. Text-UI is powered by [blessed](https://github.com/chjj/blessed).

Still under development.

命令行下的证券交易前端。文本界面基于[blessed库](https://github.com/chjj/blessed)。

仍然在开发中。

![order_act](https://media.githubusercontent.com/media/echoma/lfs/master/balance/img/order_act.png)

## How it works with a variety of trading APIs or backend platforms? 

The answer is in the following diagram.

```txt
   +-------------+
   |             |               tire-1, Fronend,
   |   BALANCE   |
   |             |              the balance project.
   +------+------+
          |
          |RPC                       +-------+
          |
          |
+---------v----------+
|                    |           tire-2, Adapter,
|   Adapter service  |
|                    |          written by 3rd party,
+---------+----------+           or by yourself.
          |
          |
          |API call                  +-------+
          |
          |
+---------v----------+
|                    |           tire-3, Backend,
|  Various platforms |
|                    |          platforms who provide
+--------------------+           the trading APIs.

```

RPC is defined by balance with [gRPC](https://grpc.io/). Balance is a client, and the adpater service is the RPC server.

## Cli parameters

-h: print help infomation.

-l: load this layout data file. Default layout will be used if not speicified.

-d: debug log file path name. Log nothing if not specified.

-s: RPC server host, default is `localhost:9527`.

## Text UI Shortcuts

Ctrl+g: bring the 'Global Management Dialog' to the front.

Ctrl+1 to 0: bring the dialog with an id of 1-10 to the front.
