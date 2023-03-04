import {products} from './productList.js';
import { responses } from './responses.js';


export const getProductsById = async (event) => {

  const {id}  = event?.pathParameters;
  const result = await products.find(product => product.id === id);

  if(!result){
    return responses._400({message:'Product not found'})

  }
   return responses._200(result)
}
