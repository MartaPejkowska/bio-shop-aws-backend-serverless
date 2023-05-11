import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {responses} from './responses.js'
import { v4 as uuidv4 } from 'uuid'

const dynamo= DynamoDBDocument.from(new DynamoDB());
const TableName=process.env.TableName
const StockTable=process.env.StockTableName

export const createProduct= async event=>{

    const product= JSON.parse(event.body)
    let id=uuidv4();
    product.id=id

    const stock={
    product_id:id,
    count:Math.floor(Math.random()*100)
}

const newProduct= await dynamo.put({TableName:TableName, Item:product}).catch(err=>{
    console.log(err)
}).then(dynamo.put({TableName:StockTable, Item: stock}))

if(!newProduct) return responses._400('Failed')

return responses._200(Object.assign(product, product.count=stock.count))

}