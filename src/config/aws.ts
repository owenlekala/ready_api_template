import { S3Client } from '@aws-sdk/client-s3';
import env from './env';
import logger from './logger';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

logger.info({ region: env.AWS_REGION, bucket: env.AWS_S3_BUCKET }, 'AWS S3 client initialized');

export { s3Client };
export { env as awsConfig };

