'use strict';
const Responses= require('../product-service/lambdas/responses');
const Products=require('../product-service/productList');

module.exports.getProductsList= async (event) => {

  
  // if (!event){
  //   return Responses._400({message:'wrong adress'})
  // }

  
  if(Products){
    return Responses._200(Products)
  }
  
};