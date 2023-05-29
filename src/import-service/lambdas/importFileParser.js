import csv from 'csv-parser'
import { S3Client, GetObjectCommand, CopyObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const results = [];

export const importFileParser= async (event)=>{

    const s3= new S3Client();
    const sqs = new SQSClient({ region: "eu-west-1" });

    const queueUrl="https://sqs.eu-west-1.amazonaws.com/839677929172/catalogItemsQueue"
    const bucket=event.Records[0].s3.bucket.name
    const key=event.Records[0].s3.object.key

    const input={
        Bucket:bucket,
        Key:key
        }
        //Getting Object
    const command = new GetObjectCommand(input);
    const response =  await s3.send(command)


      const csvFunction= response.Body.pipe(csv()).on("data", async(data) => {
            results.push(data);
            }).on("end", async() => {
                   try{
                    const copyInput={
                        Bucket: bucket,
                        CopySource: bucket + '/' + key,
                        Key: key.replace('uploaded', 'parsed')
                    }
                    const copyCommand = new CopyObjectCommand(copyInput);
                    const copyResponse = await s3.send(copyCommand)
                    .then(console.log('file copied to /parsed folder'))
                    .then(s3.send(new DeleteObjectCommand({Bucket:bucket,Key:key})))
                    .then(console.log('File deleted from /upload folder'))
                }
                catch{err=>console.log(err)}
                 });

          for await (const result of csvFunction) {
              const params = {
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify(result),
              };
              console.log('params',params)

            const response = await sqs.send(new SendMessageCommand(params))
            .then(function(result){
                console.log('result',result)
              })
            .catch(err=>console.log(err))
           }

          }
