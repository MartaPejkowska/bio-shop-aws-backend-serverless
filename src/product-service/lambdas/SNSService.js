import { SNSClient,PublishCommand } from "@aws-sdk/client-sns";
import * as dotenv from 'dotenv'


dotenv.config()

export const SNSService=async(message)=>{
const sns= new SNSClient()
// const Topic_Arn=process.env.Topic_Arn
// console.log(process.env.Topic_Arn)

  try{
      const response = await sns.send(new PublishCommand({
      Subject: 'Products added',
      Message: message,
      TopicArn: "arn:aws:sns:eu-west-1:839677929172:CreateProductTopic"
      }));
      }
  catch (err) {
    console.log("Error", err.stack)
  }
}
