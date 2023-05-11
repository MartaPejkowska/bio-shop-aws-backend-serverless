import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {responses} from './responses.js'
import { v4 as uuidv4 } from 'uuid'
import {products} from './productList.js'

const dynamo= DynamoDBDocument.from(new DynamoDB(),{marshallOptions:{ removeUndefinedValues: true}});
const TableName=process.env.TableName
const StockTable=process.env.StockTableName
//działa
// export const insertProducts= async event=>{

// for (i=0;i<products.length;i++){
//     let id=uuidv4();
//     products[i].id=id

//     let item={
//         id:products[i].id,
//         title:products[i].title,
//         description:products[i].description,
//         price:products[i].price,
//         image:products[i].image,
//         packSize:products[i].packSize
//     }

//     let stock={
//         product_id:id,
//         count:Math.floor(Math.random()*100)
//     }

//     const inserted =await dynamo.put({TableName:TableName,Item:item}).catch(err=>{
//         console.log(err, item)
//         return(err, `Failed to insert data to ${TableName}`)
//     }).then(dynamo.put({TableName:StockTable, Item: stock})).catch(err=>{
//         console.log(err)
//         return(err, `Failed to insert data to ${StockTable}`)
//     })

//     if(!inserted) return responses._400(`Failed to insert data to databases ${TableName} and ${StockTable}`)

// }
//  return responses._200(`Products successfulyy added to the databases: ${TableName} and ${StockTable}`)
//         }

export const insertProducts= async event=>{

    for (i=0;i<products.length;i++){
        let productsScan= await dynamo.scan({
            TableName:TableName,
        })

        let productsInDb=productsScan.Items
        let id=uuidv4();
        products[i].id=id

        let item={
            id:products[i].id,
            title:products[i].title,
            description:products[i].description,
            price:products[i].price,
            image:products[i].image,
            packSize:products[i].packSize
        }

        let stock={
            product_id:id,
            count:Math.floor(Math.random()*100)
        }

      if(Array.prototype.some.call(productsInDb,(product)=>product.title===item.title)){
        console.log('This product is already in DB')
         return responses._400('This product is already in DB')

                    }

      else {
        const inserted = await dynamo.put({TableName:TableName,Item:item})
        .then(()=>{return responses._200('Data succesfully added to DB')})
        .then(dynamo.put({TableName:StockTable, Item: stock}))
        .then(()=>{return responses._200('Data succesfully added to DB')})
        .catch(err=>{
            console.log(err)
            return(err, `Failed to insert data to DB`)
        })
        if(!inserted) return responses._400(`Failed to insert data to databases ${TableName} and ${StockTable}`)

      }
    }
}











