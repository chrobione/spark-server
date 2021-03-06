'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _dec2, _desc, _value, _class;

var _Controller2 = require('./Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

var _httpVerb = require('../decorators/httpVerb');

var _httpVerb2 = _interopRequireDefault(_httpVerb);

var _route = require('../decorators/route');

var _route2 = _interopRequireDefault(_route);

var _deviceToAPI = require('../lib/deviceToAPI');

var _deviceToAPI2 = _interopRequireDefault(_deviceToAPI);

var _HttpError = require('../lib/HttpError');

var _HttpError2 = _interopRequireDefault(_HttpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var ProvisioningController = (_dec = (0, _httpVerb2.default)('post'), _dec2 = (0, _route2.default)('/v1/provisioning/:coreID'), (_class = function (_Controller) {
  (0, _inherits3.default)(ProvisioningController, _Controller);

  function ProvisioningController(deviceManager) {
    (0, _classCallCheck3.default)(this, ProvisioningController);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ProvisioningController.__proto__ || (0, _getPrototypeOf2.default)(ProvisioningController)).call(this));

    _this._deviceManager = deviceManager;
    return _this;
  }

  (0, _createClass3.default)(ProvisioningController, [{
    key: 'provision',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(coreID, postBody) {
        var device;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (postBody.publicKey) {
                  _context.next = 2;
                  break;
                }

                throw new _HttpError2.default('No key provided');

              case 2:
                _context.next = 4;
                return this._deviceManager.provision(coreID, this.user.id, postBody.publicKey, postBody.algorithm);

              case 4:
                device = _context.sent;

                if (device) {
                  _context.next = 7;
                  break;
                }

                throw new _HttpError2.default('Provisioning error');

              case 7:
                return _context.abrupt('return', this.ok((0, _deviceToAPI2.default)(device)));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function provision(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return provision;
    }()
  }]);
  return ProvisioningController;
}(_Controller3.default), (_applyDecoratedDescriptor(_class.prototype, 'provision', [_dec, _dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'provision'), _class.prototype)), _class));
exports.default = ProvisioningController;