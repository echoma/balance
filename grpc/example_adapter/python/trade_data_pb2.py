# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: trade_data.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf.internal import enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='trade_data.proto',
  package='balance',
  syntax='proto3',
  serialized_pb=_b('\n\x10trade_data.proto\x12\x07\x62\x61lance\"\xfa\x05\n\x05Order\x12\x0f\n\x07\x61\x63\x63ount\x18\x01 \x01(\t\x12\x10\n\x08order_id\x18\x02 \x01(\t\x12\x17\n\x0f\x63lient_order_id\x18\x03 \x01(\t\x12#\n\x06market\x18\x04 \x01(\x0e\x32\x13.balance.EnumMarket\x12\x0e\n\x06symbol\x18\x05 \x01(\t\x12\x10\n\x08quantity\x18\x06 \x01(\t\x12\r\n\x05price\x18\x07 \x01(\t\x12\x12\n\nstop_price\x18\x08 \x01(\t\x12%\n\x04type\x18\t \x01(\x0e\x32\x17.balance.Order.EnumType\x12#\n\x03tif\x18\n \x01(\x0e\x32\x16.balance.Order.EnumTif\x12*\n\nlong_short\x18\x0b \x01(\x0e\x32\x16.balance.EnumLongShort\x12*\n\nopen_close\x18\x0c \x01(\x0e\x32\x16.balance.EnumOpenClose\x12\x0c\n\x04text\x18\r \x01(\t\x12)\n\x06status\x18\x0e \x01(\x0e\x32\x19.balance.Order.EnumStatus\x12\x17\n\x0f\x66illed_quantity\x18\x0f \x01(\t\x12\x15\n\rfilled_avg_px\x18\x10 \x01(\t\"o\n\x08\x45numType\x12\t\n\x05LIMIT\x10\x00\x12\n\n\x06MARKET\x10\x01\x12\x0e\n\nSTOP_LIMIT\x10\x02\x12\x0f\n\x0bSTOP_MARKET\x10\x03\x12\x14\n\x10TRAIL_STOP_LIMIT\x10\x04\x12\x15\n\x11TRAIL_STOP_MARKET\x10\x05\"2\n\x07\x45numTif\x12\x07\n\x03\x44\x41Y\x10\x00\x12\x07\n\x03IOC\x10\x01\x12\x07\n\x03\x46OK\x10\x02\x12\x0c\n\x08\x41T_CROSS\x10\x03\"\x98\x01\n\nEnumStatus\x12\x0c\n\x08\x41\x43\x43\x45PTED\x10\x00\x12\x0f\n\x0bPENDING_NEW\x10\x01\x12\x07\n\x03NEW\x10\x02\x12\x11\n\rPENDING_AMEND\x10\x03\x12\x0c\n\x08MATCHING\x10\x04\x12\x12\n\x0ePENDING_CANCEL\x10\x05\x12\r\n\tCANCELLED\x10\x06\x12\x12\n\x0ePARTIAL_FILLED\x10\x07\x12\n\n\x06\x46ILLED\x10\x08\"\xb7\x01\n\x0c\x43\x61shPosition\x12\x0f\n\x07\x61\x63\x63ount\x18\x01 \x01(\t\x12#\n\x06market\x18\x02 \x01(\x0e\x32\x13.balance.EnumMarket\x12\x10\n\x08\x63urrency\x18\x03 \x01(\t\x12*\n\nlong_short\x18\x04 \x01(\x0e\x32\x16.balance.EnumLongShort\x12\x0f\n\x07\x62\x61lance\x18\x05 \x01(\t\x12\x11\n\tavailable\x18\x06 \x01(\t\x12\x0f\n\x07settled\x18\x07 \x01(\t\"\xcc\x01\n\rStockPosition\x12\x0f\n\x07\x61\x63\x63ount\x18\x01 \x01(\t\x12#\n\x06market\x18\x02 \x01(\x0e\x32\x13.balance.EnumMarket\x12\x0e\n\x06symbol\x18\x03 \x01(\t\x12*\n\nlong_short\x18\x04 \x01(\x0e\x32\x16.balance.EnumLongShort\x12\x0f\n\x07\x62\x61lance\x18\x05 \x01(\t\x12\x11\n\tavailable\x18\x06 \x01(\t\x12\x0f\n\x07settled\x18\x07 \x01(\t\x12\x14\n\x0cmarket_value\x18\x08 \x01(\t\"\xa4\x01\n\x0c\x41\x63\x63ountAsset\x12#\n\x06market\x18\x01 \x01(\x0e\x32\x13.balance.EnumMarket\x12\x0f\n\x07\x61\x63\x63ount\x18\x02 \x01(\t\x12-\n\x0e\x63\x61sh_positions\x18\x03 \x03(\x0b\x32\x15.balance.CashPosition\x12/\n\x0fstock_positions\x18\x04 \x03(\x0b\x32\x16.balance.StockPosition\"l\n\x10\x41\x63\x63ountOrderList\x12#\n\x06market\x18\x01 \x01(\x0e\x32\x13.balance.EnumMarket\x12\x0f\n\x07\x61\x63\x63ount\x18\x02 \x01(\t\x12\"\n\norder_list\x18\x03 \x03(\x0b\x32\x0e.balance.Order*-\n\nEnumMarket\x12\x07\n\x03\x41NY\x10\x00\x12\x06\n\x02HK\x10\x01\x12\x06\n\x02US\x10\x02\x12\x06\n\x02\x46X\x10\x03*$\n\rEnumOpenClose\x12\x08\n\x04OPEN\x10\x00\x12\t\n\x05\x43LOSE\x10\x01*$\n\rEnumLongShort\x12\x08\n\x04LONG\x10\x00\x12\t\n\x05SHORT\x10\x01\x62\x06proto3')
)

_ENUMMARKET = _descriptor.EnumDescriptor(
  name='EnumMarket',
  full_name='balance.EnumMarket',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='ANY', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='HK', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='US', index=2, number=2,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FX', index=3, number=3,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=1464,
  serialized_end=1509,
)
_sym_db.RegisterEnumDescriptor(_ENUMMARKET)

EnumMarket = enum_type_wrapper.EnumTypeWrapper(_ENUMMARKET)
_ENUMOPENCLOSE = _descriptor.EnumDescriptor(
  name='EnumOpenClose',
  full_name='balance.EnumOpenClose',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='OPEN', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CLOSE', index=1, number=1,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=1511,
  serialized_end=1547,
)
_sym_db.RegisterEnumDescriptor(_ENUMOPENCLOSE)

EnumOpenClose = enum_type_wrapper.EnumTypeWrapper(_ENUMOPENCLOSE)
_ENUMLONGSHORT = _descriptor.EnumDescriptor(
  name='EnumLongShort',
  full_name='balance.EnumLongShort',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='LONG', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='SHORT', index=1, number=1,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=1549,
  serialized_end=1585,
)
_sym_db.RegisterEnumDescriptor(_ENUMLONGSHORT)

EnumLongShort = enum_type_wrapper.EnumTypeWrapper(_ENUMLONGSHORT)
ANY = 0
HK = 1
US = 2
FX = 3
OPEN = 0
CLOSE = 1
LONG = 0
SHORT = 1


_ORDER_ENUMTYPE = _descriptor.EnumDescriptor(
  name='EnumType',
  full_name='balance.Order.EnumType',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='LIMIT', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='MARKET', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='STOP_LIMIT', index=2, number=2,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='STOP_MARKET', index=3, number=3,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='TRAIL_STOP_LIMIT', index=4, number=4,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='TRAIL_STOP_MARKET', index=5, number=5,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=474,
  serialized_end=585,
)
_sym_db.RegisterEnumDescriptor(_ORDER_ENUMTYPE)

_ORDER_ENUMTIF = _descriptor.EnumDescriptor(
  name='EnumTif',
  full_name='balance.Order.EnumTif',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='DAY', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='IOC', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FOK', index=2, number=2,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='AT_CROSS', index=3, number=3,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=587,
  serialized_end=637,
)
_sym_db.RegisterEnumDescriptor(_ORDER_ENUMTIF)

_ORDER_ENUMSTATUS = _descriptor.EnumDescriptor(
  name='EnumStatus',
  full_name='balance.Order.EnumStatus',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='ACCEPTED', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='PENDING_NEW', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='NEW', index=2, number=2,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='PENDING_AMEND', index=3, number=3,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='MATCHING', index=4, number=4,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='PENDING_CANCEL', index=5, number=5,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CANCELLED', index=6, number=6,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='PARTIAL_FILLED', index=7, number=7,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FILLED', index=8, number=8,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=640,
  serialized_end=792,
)
_sym_db.RegisterEnumDescriptor(_ORDER_ENUMSTATUS)


_ORDER = _descriptor.Descriptor(
  name='Order',
  full_name='balance.Order',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='account', full_name='balance.Order.account', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='order_id', full_name='balance.Order.order_id', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='client_order_id', full_name='balance.Order.client_order_id', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='market', full_name='balance.Order.market', index=3,
      number=4, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='symbol', full_name='balance.Order.symbol', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='quantity', full_name='balance.Order.quantity', index=5,
      number=6, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='price', full_name='balance.Order.price', index=6,
      number=7, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='stop_price', full_name='balance.Order.stop_price', index=7,
      number=8, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='type', full_name='balance.Order.type', index=8,
      number=9, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='tif', full_name='balance.Order.tif', index=9,
      number=10, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='long_short', full_name='balance.Order.long_short', index=10,
      number=11, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='open_close', full_name='balance.Order.open_close', index=11,
      number=12, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='text', full_name='balance.Order.text', index=12,
      number=13, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='status', full_name='balance.Order.status', index=13,
      number=14, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='filled_quantity', full_name='balance.Order.filled_quantity', index=14,
      number=15, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='filled_avg_px', full_name='balance.Order.filled_avg_px', index=15,
      number=16, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
    _ORDER_ENUMTYPE,
    _ORDER_ENUMTIF,
    _ORDER_ENUMSTATUS,
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=30,
  serialized_end=792,
)


_CASHPOSITION = _descriptor.Descriptor(
  name='CashPosition',
  full_name='balance.CashPosition',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='account', full_name='balance.CashPosition.account', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='market', full_name='balance.CashPosition.market', index=1,
      number=2, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='currency', full_name='balance.CashPosition.currency', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='long_short', full_name='balance.CashPosition.long_short', index=3,
      number=4, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='balance', full_name='balance.CashPosition.balance', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='available', full_name='balance.CashPosition.available', index=5,
      number=6, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='settled', full_name='balance.CashPosition.settled', index=6,
      number=7, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=795,
  serialized_end=978,
)


_STOCKPOSITION = _descriptor.Descriptor(
  name='StockPosition',
  full_name='balance.StockPosition',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='account', full_name='balance.StockPosition.account', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='market', full_name='balance.StockPosition.market', index=1,
      number=2, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='symbol', full_name='balance.StockPosition.symbol', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='long_short', full_name='balance.StockPosition.long_short', index=3,
      number=4, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='balance', full_name='balance.StockPosition.balance', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='available', full_name='balance.StockPosition.available', index=5,
      number=6, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='settled', full_name='balance.StockPosition.settled', index=6,
      number=7, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='market_value', full_name='balance.StockPosition.market_value', index=7,
      number=8, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=981,
  serialized_end=1185,
)


_ACCOUNTASSET = _descriptor.Descriptor(
  name='AccountAsset',
  full_name='balance.AccountAsset',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='market', full_name='balance.AccountAsset.market', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='account', full_name='balance.AccountAsset.account', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='cash_positions', full_name='balance.AccountAsset.cash_positions', index=2,
      number=3, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='stock_positions', full_name='balance.AccountAsset.stock_positions', index=3,
      number=4, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1188,
  serialized_end=1352,
)


_ACCOUNTORDERLIST = _descriptor.Descriptor(
  name='AccountOrderList',
  full_name='balance.AccountOrderList',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='market', full_name='balance.AccountOrderList.market', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='account', full_name='balance.AccountOrderList.account', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='order_list', full_name='balance.AccountOrderList.order_list', index=2,
      number=3, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1354,
  serialized_end=1462,
)

_ORDER.fields_by_name['market'].enum_type = _ENUMMARKET
_ORDER.fields_by_name['type'].enum_type = _ORDER_ENUMTYPE
_ORDER.fields_by_name['tif'].enum_type = _ORDER_ENUMTIF
_ORDER.fields_by_name['long_short'].enum_type = _ENUMLONGSHORT
_ORDER.fields_by_name['open_close'].enum_type = _ENUMOPENCLOSE
_ORDER.fields_by_name['status'].enum_type = _ORDER_ENUMSTATUS
_ORDER_ENUMTYPE.containing_type = _ORDER
_ORDER_ENUMTIF.containing_type = _ORDER
_ORDER_ENUMSTATUS.containing_type = _ORDER
_CASHPOSITION.fields_by_name['market'].enum_type = _ENUMMARKET
_CASHPOSITION.fields_by_name['long_short'].enum_type = _ENUMLONGSHORT
_STOCKPOSITION.fields_by_name['market'].enum_type = _ENUMMARKET
_STOCKPOSITION.fields_by_name['long_short'].enum_type = _ENUMLONGSHORT
_ACCOUNTASSET.fields_by_name['market'].enum_type = _ENUMMARKET
_ACCOUNTASSET.fields_by_name['cash_positions'].message_type = _CASHPOSITION
_ACCOUNTASSET.fields_by_name['stock_positions'].message_type = _STOCKPOSITION
_ACCOUNTORDERLIST.fields_by_name['market'].enum_type = _ENUMMARKET
_ACCOUNTORDERLIST.fields_by_name['order_list'].message_type = _ORDER
DESCRIPTOR.message_types_by_name['Order'] = _ORDER
DESCRIPTOR.message_types_by_name['CashPosition'] = _CASHPOSITION
DESCRIPTOR.message_types_by_name['StockPosition'] = _STOCKPOSITION
DESCRIPTOR.message_types_by_name['AccountAsset'] = _ACCOUNTASSET
DESCRIPTOR.message_types_by_name['AccountOrderList'] = _ACCOUNTORDERLIST
DESCRIPTOR.enum_types_by_name['EnumMarket'] = _ENUMMARKET
DESCRIPTOR.enum_types_by_name['EnumOpenClose'] = _ENUMOPENCLOSE
DESCRIPTOR.enum_types_by_name['EnumLongShort'] = _ENUMLONGSHORT
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

Order = _reflection.GeneratedProtocolMessageType('Order', (_message.Message,), dict(
  DESCRIPTOR = _ORDER,
  __module__ = 'trade_data_pb2'
  # @@protoc_insertion_point(class_scope:balance.Order)
  ))
_sym_db.RegisterMessage(Order)

CashPosition = _reflection.GeneratedProtocolMessageType('CashPosition', (_message.Message,), dict(
  DESCRIPTOR = _CASHPOSITION,
  __module__ = 'trade_data_pb2'
  # @@protoc_insertion_point(class_scope:balance.CashPosition)
  ))
_sym_db.RegisterMessage(CashPosition)

StockPosition = _reflection.GeneratedProtocolMessageType('StockPosition', (_message.Message,), dict(
  DESCRIPTOR = _STOCKPOSITION,
  __module__ = 'trade_data_pb2'
  # @@protoc_insertion_point(class_scope:balance.StockPosition)
  ))
_sym_db.RegisterMessage(StockPosition)

AccountAsset = _reflection.GeneratedProtocolMessageType('AccountAsset', (_message.Message,), dict(
  DESCRIPTOR = _ACCOUNTASSET,
  __module__ = 'trade_data_pb2'
  # @@protoc_insertion_point(class_scope:balance.AccountAsset)
  ))
_sym_db.RegisterMessage(AccountAsset)

AccountOrderList = _reflection.GeneratedProtocolMessageType('AccountOrderList', (_message.Message,), dict(
  DESCRIPTOR = _ACCOUNTORDERLIST,
  __module__ = 'trade_data_pb2'
  # @@protoc_insertion_point(class_scope:balance.AccountOrderList)
  ))
_sym_db.RegisterMessage(AccountOrderList)


try:
  # THESE ELEMENTS WILL BE DEPRECATED.
  # Please use the generated *_pb2_grpc.py files instead.
  import grpc
  from grpc.beta import implementations as beta_implementations
  from grpc.beta import interfaces as beta_interfaces
  from grpc.framework.common import cardinality
  from grpc.framework.interfaces.face import utilities as face_utilities
except ImportError:
  pass
# @@protoc_insertion_point(module_scope)
