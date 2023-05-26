import AWS from 'aws-sdk'

const documentClient= new AWS.DynamoDB.DocumentClient();

export const Dynamo={
    // async get(id, TableName){
    //     const params={
    //         TableName,
    //         Key:{
    //             id
    //         }
    //     }

    // const data= await documentClient
    // .get(params)
    // .promise()

    // if (!data || !data.Item){
    //     throw Error(`There was an error fetching data ${id} from table ${TableName}`)
    // }
    // console.log(data)
    // return data.Item
    // },


    async write(data,TableName){
        const params={
            TableName,
            Item: data
        }
        const res=await documentClient.put(params).promise()
        if(!res){
            throw Error(`There was an error inserting data in ${TableName}`)
        }
        return data
    }
}