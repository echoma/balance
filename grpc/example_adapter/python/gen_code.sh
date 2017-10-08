#!/bin/sh
python -m grpc_tools.protoc -I ../../ --python_out=. --grpc_python_out=. ../../trade_data.proto

python -m grpc_tools.protoc -I ../../ --python_out=. --grpc_python_out=. ../../trade_service.proto
