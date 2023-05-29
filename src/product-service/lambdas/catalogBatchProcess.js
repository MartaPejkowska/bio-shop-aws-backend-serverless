const { Lambda } = require('aws-sdk')

export const catalogBatchProcess=async (event)=>{
  console.log('body',event.Records[0].body)


  const products= event.Records.map(({body})=>body)
  console.log('products',products)
  // for (product in products){
  //   console.log ('product',product)
  // }

    try {
        products.map(async(product)=>{
            console.log(product)
            let res = await new Lambda().invoke({
              FunctionName: 'product-service2-dev-createProduct',
              Payload: JSON.stringify(product),
              InvocationType: 'Event'
            }).promise()
            console.log('res',res)
        }
       )
    }
    catch (err) {
        console.log(`invoke ERROR: ${err}`)
      }




}