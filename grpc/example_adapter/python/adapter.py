'''
example adapter in python
'''
from concurrent import futures
import time
import logging
import random

import grpc

import trade_data_pb2
import trade_service_pb2_grpc


class TradeService(trade_service_pb2_grpc.TradeServicer):
    '''
    Trade Service
    '''
    def orderNewSingle(self, request, context):
        '''
        Input a new order
        '''
        logging.info('on orderNewSingle('+str(request).strip()+')')
        if random.random() > 0.5:
            logging.info('\treturn success')
            request.order.status = trade_data_pb2.Order.EnumStatus.Value('NEW')
            request.order.order_id = str(random.randint(1, 999999))
            return request.order
        else:
            raise Exception('got error by random()')
    def orderAmendSingle(self, request, context):
        '''
        Amend an order
        '''
        logging.info('on orderAmendSingle('+str(request).strip()+')')
        if random.random() > 0.5:
            logging.info('\treturn success')
            request.order.status = trade_data_pb2.Order.EnumStatus.Value('MATCHING')
            request.order.order_id = str(random.randint(1, 999999))
            return request.order
        else:
            raise Exception('got error by random()')
    def orderCancelSingle(self, request, context):
        '''
        Cancel an order
        '''
        logging.info('on orderCancelSingle('+str(request).strip()+')')
        if random.random() > 0.5:
            logging.info('\treturn success')
            request.order.status = trade_data_pb2.Order.EnumStatus.Value('CANCELLED')
            request.order.order_id = str(random.randint(1, 999999))
            return request.order
        else:
            raise Exception('got error by random()')
    def accountAsset(self, request, context):
        '''
        Get cash and stock positions
        '''
        logging.info('on accountAsset('+str(request).strip()+')')
        asset = trade_data_pb2.AccountAsset(
            market=request.market,
            account=request.account
        )
        cash_data = [
            ['ANY', 'USD', 'LONG', '9284713.00', '9284713.00', '9284713.00'],
            ['US', 'USD', 'LONG', '84713.00', '84713.00', '84713.00'],
            ['HK', 'HKD', 'LONG', '84713.00', '84713.00', '84713.00'],
        ]
        for cash in cash_data:
            rand_change = random.randint(1, 1000)
            cash_pos = trade_data_pb2.CashPosition(
                account=asset.account,
                market=trade_data_pb2.EnumMarket.Value(cash[0]),
                currency=cash[1],
                long_short=trade_data_pb2.EnumLongShort.Value(cash[2]),
                balance=str(float(cash[3]) + rand_change),
                available=str(float(cash[4]) + rand_change),
                settled=str(float(cash[5]) + rand_change)
            )
            asset.cash_positions.extend([cash_pos])
        stock_data = [
            ['FX', 'USD/CNY', 'LONG', '2000', '2000', '2000', '13180'],
            ['US', 'RHT', 'LONG', '500', '500', '500', '53150'],
            ['US', 'MSFT', 'LONG', '200', '100', '200', '14882'],
            ['US', 'BABA', 'SHORT', '100', '100', '100', '17814'],
            ['HK', '700', 'LONG', '500', '500', '500', '173000'],
            ['HK', '3888', 'LONG', '100', '0', '100', '18300'],
            ['HK', '5', 'LONG', '1000', '0', '100', '76200'],
        ]
        for stock in stock_data:
            rand_change = random.randint(1, 1000)
            stock_pos = trade_data_pb2.StockPosition(
                account=asset.account,
                market=trade_data_pb2.EnumMarket.Value(stock[0]),
                symbol=stock[1],
                long_short=trade_data_pb2.EnumLongShort.Value(stock[2]),
                balance=stock[3],
                available=stock[4],
                settled=stock[5],
                market_value=str(float(stock[6])+rand_change)
            )
            asset.stock_positions.extend([stock_pos])
        return asset
    def accountOrderList(self, request, context):
        '''
        Get order list
        '''
        logging.info('on accountOrderList('+str(request).strip()+')')
        reply = trade_data_pb2.AccountOrderList(
            market=request.market,
            account=request.account
        )
        odr_data = [
            ['HK', '700', '300', '350', '', 'LIMIT', 'DAY', 'LONG', 'OPEN', 'NEW', '0', ''],
            ['US', 'BABA', '100', '150', '', 'LIMIT', 'DAY', 'SHORT', 'OPEN', 'NEW', '0', ''],
            ['US', 'MSFT', '100', '75.9', '75.9', 'STOP_LIMIT', 'DAY', 'LONG', 'CLOSE', 'PARTIAL_FILLED', '50', '76'],
            ['US', 'MSFT', '100', '', '-5', 'TRAIL_STOP_MARKET', 'AT_CROSS', 'LONG', 'CLOSE', 'CANCELLED', '0', '0'],
        ];
        for odr in odr_data:
            odr_item = trade_data_pb2.Order(
                account=reply.account if reply.account else '',
                order_id=str(len(reply.order_list)+1),
                client_order_id=str(len(reply.order_list)+1),
                market=odr[0],
                symbol=odr[1],
                quantity=odr[2],
                price=odr[3],
                stop_price=odr[4],
                type=odr[5],
                tif=odr[6],
                long_short=odr[7],
                open_close=odr[8],
                status=odr[9],
                filled_quantity=odr[10],
                filled_avg_px=odr[11],
            )
            reply.order_list.extend([odr_item])
        return reply

def serve():
    '''
    The main function
    '''
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    trade_service_pb2_grpc.add_TradeServicer_to_server(TradeService(), server)
    server.add_insecure_port('0.0.0.0:9527')
    server.start()
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    logging.basicConfig(format='%(message)s', level=logging.DEBUG)
    serve()