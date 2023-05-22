import csv from 'csv-parser'
import { S3Client, GetObjectCommand, CopyObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
const results = [];


export const importFileParser= async (event)=>{

    const s3= new S3Client();

    const bucket=event.Records[0].s3.bucket.name
    const key=event.Records[0].s3.object.key

    const input={
        Bucket:bucket,
        Key:key
        }
        //Getting Object
    const command = new GetObjectCommand(input);
    const response =  await s3.send(command)
        //consol every record and after finish move file to parsed folder
    if(response){
        response.Body.pipe(csv()).on("data", async(data) => {
            console.log(data)
            results.push(data);
            }).on("end", () => {
                try{
                    const copyInput={
                        Bucket: bucket,
                        CopySource: bucket + '/' + key,
                        Key: key.replace('uploaded', 'parsed')
                    }
                    const copyCommand = new CopyObjectCommand(copyInput);
                    const copyResponse =  s3.send(copyCommand)
                    console.log('file copied to /parsed folder')
                    s3.send(new DeleteObjectCommand({Bucket:bucket,Key:key}));
                    console.log('File deleted from /upload folder')
                }
                catch{err=>console.log(err)}
            return results;
            });
             }
    else{
        const response ={
            statusCode:500,
            message:"Error getting Object"}
        return response
            }

            }


