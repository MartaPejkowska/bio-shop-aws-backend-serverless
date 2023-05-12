import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {responses} from './responses.js';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';

const dynamo= DynamoDBDocument.from(new DynamoDB());
const TableName=process.env.TableName
const StockTable=process.env.StockTableName

const schema=Joi.object({
    title:Joi.string().min(3).required(),
    description:Joi.string(),
    price:Joi.number().required(),
    image:Joi.string(),
    packSize:Joi.string(),
    id:Joi.string().guid()
})

export const createProduct= async event=>{

    console.log(event)
    const product= JSON.parse(event.body)
    let id=uuidv4();
    product.id=id

    const stock={
    product_id:id,
    count:Math.floor(Math.random()*100)
}

    const result = schema.validate(product)
    const isValid=result.error
    const finalProduct=Object.assign(product, product.count=stock.count)
    const succesMessage=['Product added to Product and Stock database  ', finalProduct]

    if (isValid=== undefined || null) {
     const newProduct = await dynamo.put({TableName:TableName, Item:product})
    .catch(err=> console.log(err))
    .then(dynamo.put({TableName:StockTable, Item: stock}))
    .catch(err=> console.log(err))
    // return responses._200(Object.assign(product, product.count=stock.count))
    return responses._200(succesMessage)
    }
    else
    {const failMessage='Invalid data   '+ result.error.details.map(detail =>  detail.message)
    // return responses._400(result.error.details.map(detail =>  detail.message))
    return responses._400(failMessage)
}

}