const { Lambda } = require('aws-sdk')
import {SNSService} from './SNSService.js'
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {responses} from './responses.js';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';

export const catalogBatchProcess=async (event)=>{
  console.log('body',event.Records[0].body)

  const products=event.Records.map((record) => JSON.parse(record.body))
  console.log('products',products)

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

  const added=[]

  for (i=0;i<products.length;i++){

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



      const result = schema.validate(products[i])
    const isValid=result.error

     if (isValid=== undefined || null){

       const inserted = await dynamo.put({TableName:TableName,Item:item})
       .then(dynamo.put({TableName:StockTable, Item: stock}))
       .then(()=>{return responses._200('Data succesfully added to DB')})
       .then(()=>added.push(item.title))
       .catch(err=>{
           console.log(err)
           return(err, `Failed to insert data to DB`)
       })
       if(!inserted) return responses._400(`Failed to insert data to databases ${TableName} and ${StockTable}`)
     }


     if(i==(products.length-1)){

       const message=`Added ${added.length} products: ${added}`
       console.log(message)
       SNSService(message)
     }
    }


  }
    // try {
    //     products.map(async(product)=>{
    //         console.log(product)
    //         let res = await new Lambda().invoke({
    //           FunctionName: 'product-service2-dev-createProduct',
    //           Payload: JSON.stringify(product),
    //           InvocationType: 'Event'
    //         }).promise()
    //         console.log('res',res)
    //     }
    //    )
    // }
    //     catch (err) {
    //     console.log(`invoke ERROR: ${err}`)
    //   }














