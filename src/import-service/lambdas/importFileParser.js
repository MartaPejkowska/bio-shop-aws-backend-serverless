import csv from 'csv-parser'
import { S3Client, GetObjectCommand} from "@aws-sdk/client-s3";
const results = [];


export const importFileParser= async (event)=>{

        const s3= new S3Client();

         const bucket=event.Records[0].s3.bucket.name
         const key=event.Records[0].s3.object.key

        const input={
              Bucket:bucket,
               Key:key
            }

        const command = new GetObjectCommand(input);
        const response =  await s3.send(command)

        if(response){
                response.Body.pipe(csv()).on("data", async(data) => {
                    console.log(data)
                    results.push(data);
                    }).on("end", () => {
                        return results;
                    });
                }
            else{
                const response ={
                    statusCOde:500,
                    message:"Error getting Object"}
                return response
                }
            }


