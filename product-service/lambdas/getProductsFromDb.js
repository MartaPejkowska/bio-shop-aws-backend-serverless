import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { responses } from "./responses.js";

const dynamo= DynamoDBDocument.from(new DynamoDB());


export const getProductsFromDb= async(event)=>{
    const productsScan= await dynamo.scan({
            TableName:process.env.TableName,
        })
    const stocksScan= await dynamo.scan({
            TableName:process.env.StockTableName
    })

    const products=productsScan.Items
    const stocks=stocksScan.Items


    products.map((product) => {stocks.map(stock=>{
    if(product.id===stock.product_id)
     {Object.assign(product,product.count=stock.count)
    }
})})

    if(!products) {
        return  responses._400(`There was an error fetching data from ${TableName}`)
        }
    return responses._200(products)
}