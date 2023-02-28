// const Responses= require('./responses');
// const product = require('../productList');
import {products} from './productList.js';
import { responses } from './responses.js';

// module.exports.getProductsById = async (event) => {
  
//     const {id}  = event?.pathParameters;
//     const result = await product.find(product => product.id === id);
  
//     if(!result){
//       return Responses._400({message:'Product not found'})
  
//     }   
//      return Responses._200(result)
//   } 
  
 
export const getProductsById = async (event) => {
  
  const {id}  = event?.pathParameters;
  const result = await products.find(product => product.id === id);

  if(!result){
    return responses._400({message:'Product not found'})

  }   
   return responses._200(result)
} 
