import { FactoryProvider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

export const S3_SERVICE : FactoryProvider<S3>  = {
    provide:'S3',
    useFactory:(configservice:ConfigService)=>{
        const config = {
            credentials:{
                secretAccessKey:configservice.get('AWS_SECRET_KEY'),
                accessKeyId:configservice.get('AWS_ACCESS_KEY')
            },
        };
        if(process.env['mode']=='dev'){
            config['s3ForcePathStyle']=true;
        }
        const s3 = new S3(config)
        return  s3
    },
    inject:[ConfigService]
} 
