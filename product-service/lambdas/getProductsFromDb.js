import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { responses } from "./responses.js";

const dynamo= DynamoDBDocument.from(new DynamoDB());


export const getProductsFromDb= async(event)=>{
    console.log(event)
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

    if(products.length==0){
        return  responses._500(`There are no data in DB`)
    }
    else if(!productsScan) {
        return  responses._500(`There was an error fetching data from DB}`)
        }
    return responses._200(products)
}