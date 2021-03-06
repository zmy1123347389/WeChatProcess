'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unflattenActionCreators = exports.flattenReducerMap = exports.flattenActionMap = exports.defaultNamespace = undefined;

var _camelCase = require('./camelCase.js');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _ownKeys = require('./ownKeys.js');

var _ownKeys2 = _interopRequireDefault(_ownKeys);

var _hasGeneratorInterface = require('./hasGeneratorInterface.js');

var _hasGeneratorInterface2 = _interopRequireDefault(_hasGeneratorInterface);

var _isPlainObject = require('./../../lodash/isPlainObject.js');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isMap = require('./../../lodash/isMap.js');

var _isMap2 = _interopRequireDefault(_isMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultNamespace = exports.defaultNamespace = '/';

function get(key, x) {
  return (0, _isMap2.default)(x) ? x.get(key) : x[key];
}

var flattenWhenNode = function flattenWhenNode(predicate) {
  return function flatten(map) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$namespace = _ref.namespace,
        namespace = _ref$namespace === undefined ? defaultNamespace : _ref$namespace,
        prefix = _ref.prefix;

    var partialFlatMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var partialFlatActionType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    function connectNamespace(type) {
      return partialFlatActionType ? '' + partialFlatActionType + namespace + type : type;
    }

    function connectPrefix(type) {
      if (partialFlatActionType || !prefix) {
        return type;
      }

      return '' + prefix + namespace + type;
    }

    (0, _ownKeys2.default)(map).forEach(function (type) {
      var nextNamespace = connectPrefix(connectNamespace(type));
      var mapValue = get(type, map);

      if (!predicate(mapValue)) {
        partialFlatMap[nextNamespace] = mapValue;
      } else {
        flatten(mapValue, { namespace: namespace, prefix: prefix }, partialFlatMap, nextNamespace);
      }
    });

    return partialFlatMap;
  };
};

var flattenActionMap = flattenWhenNode(_isPlainObject2.default);
var flattenReducerMap = flattenWhenNode(function (node) {
  return ((0, _isPlainObject2.default)(node) || (0, _isMap2.default)(node)) && !(0, _hasGeneratorInterface2.default)(node);
});

function unflattenActionCreators(flatActionCreators) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$namespace = _ref2.namespace,
      namespace = _ref2$namespace === undefined ? defaultNamespace : _ref2$namespace,
      prefix = _ref2.prefix;

  function unflatten(flatActionType) {
    var partialNestedActionCreators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var partialFlatActionTypePath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var nextNamespace = (0, _camelCase2.default)(partialFlatActionTypePath.shift());
    if (partialFlatActionTypePath.length) {
      if (!partialNestedActionCreators[nextNamespace]) {
        partialNestedActionCreators[nextNamespace] = {};
      }
      unflatten(flatActionType, partialNestedActionCreators[nextNamespace], partialFlatActionTypePath);
    } else {
      partialNestedActionCreators[nextNamespace] = flatActionCreators[flatActionType];
    }
  }

  var nestedActionCreators = {};
  Object.getOwnPropertyNames(flatActionCreators).forEach(function (type) {
    var unprefixedType = prefix ? type.replace('' + prefix + namespace, '') : type;
    return unflatten(type, nestedActionCreators, unprefixedType.split(namespace));
  });

  return nestedActionCreators;
}

exports.flattenActionMap = flattenActionMap;
exports.flattenReducerMap = flattenReducerMap;
exports.unflattenActionCreators = unflattenActionCreators;