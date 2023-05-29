/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "createProduct": () => (/* binding */ createProduct)
});

;// CONCATENATED MODULE: external "@aws-sdk/lib-dynamodb"
const lib_dynamodb_namespaceObject = require("@aws-sdk/lib-dynamodb");
;// CONCATENATED MODULE: external "@aws-sdk/client-dynamodb"
const client_dynamodb_namespaceObject = require("@aws-sdk/client-dynamodb");
;// CONCATENATED MODULE: ./lambdas/responses.js
const responses = {
  _200(data = {}) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: JSON.stringify(data)
    };
  },
  _400(data = {}) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 400,
      body: JSON.stringify(data)
    };
  },
  _500(data = {}) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 400,
      body: JSON.stringify(data)
    };
  }
};
;// CONCATENATED MODULE: external "uuid"
const external_uuid_namespaceObject = require("uuid");
;// CONCATENATED MODULE: external "joi"
const external_joi_namespaceObject = require("joi");
;// CONCATENATED MODULE: ./lambdas/createProduct.js





const dynamo = lib_dynamodb_namespaceObject.DynamoDBDocument.from(new client_dynamodb_namespaceObject.DynamoDB());
const TableName = process.env.TableName;
const StockTable = process.env.StockTableName;
const schema = external_joi_namespaceObject.object({
  title: external_joi_namespaceObject.string().min(3).required(),
  description: external_joi_namespaceObject.string(),
  price: external_joi_namespaceObject.number().required(),
  image: external_joi_namespaceObject.string(),
  packSize: external_joi_namespaceObject.string(),
  id: external_joi_namespaceObject.string().guid()
});
const createProduct = async event => {
  console.log(event);
  const product = event.body ? JSON.parse(event.body) : JSON.parse(event);
  console.log(product);
  let id = (0,external_uuid_namespaceObject.v4)();
  product.id = id;
  const stock = {
    product_id: id,
    count: Math.floor(Math.random() * 100)
  };
  const result = schema.validate(product);
  const isValid = result.error;
  if (isValid === undefined || null) {
    const newProduct = await dynamo.put({
      TableName: TableName,
      Item: product
    }).catch(err => console.log(err)).then(dynamo.put({
      TableName: StockTable,
      Item: stock
    })).catch(err => console.log(err));
    const finalProduct = Object.assign(product, product.count = stock.count);
    const succesMessage = ['Product added to Product and Stock database  ', finalProduct];
    // return responses._200(Object.assign(product, product.count=stock.count))
    console.log(succesMessage);
    return responses._200(succesMessage);
  } else {
    const failMessage = 'Invalid data   ' + result.error.details.map(detail => detail.message);
    console.log(failMessage);
    // return responses._400(result.error.details.map(detail =>  detail.message))
    return responses._400(failMessage);
  }
};
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=createProduct.js.map