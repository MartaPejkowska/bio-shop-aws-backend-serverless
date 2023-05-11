'use strict';
const Responses= require('../product-service/lambdas/responses');
const Products=require('../product-service/productList');

module.exports.getProductsById= async (event) => {
  
  if (!event.pathParameters || !event.pathParameters.id){
    return Responses._400({message:'Product not found'})
  }
  let id=event.pathParameters.id;

  if(Products.id){
    return Responses._200(Products.id)
  }
  
};