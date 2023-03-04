
import { products } from './productList.js';
import {responses} from './responses.js';

export const getProductsList = async () => {


    const result = await products;


    if(!result){
      return responses._400({message:'products not found'})
    }

    return responses._200(result)
  }

