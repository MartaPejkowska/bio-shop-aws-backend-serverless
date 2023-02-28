// const products = require('../productList');
// const Responses= require('./responses')

// module.exports.getProductsList = async () => {
 
  
//     const result = await products;
    
  
//     if(!result){
//       return Responses._400({message:'products not found'}) 
//     }

//     return Responses._200(result)
//   } 
  
import { products } from './productList.js';
import {responses} from './responses.js';

export const getProductsList = async () => {
 
  
    const result = await products;
    
  
    if(!result){
      return responses._400({message:'products not found'}) 
    }

    return responses._200(result)
  } 
  
  