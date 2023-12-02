import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl as s3GetSignedUrl } from '@aws-sdk/s3-request-presigner';

import { env } from '../../env.mjs';

export const blobClient = (client: S3Client) => {
  const get = async (key: string) => {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      }),
    );
    return result.Body;
  };

  const getSignedUrl = async ({
    key,
    expiresInMs,
  }: {
    key: string;
    expiresInMs: number;
  }) =>
    await s3GetSignedUrl(
      client,
      new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }),
      { expiresIn: expiresInMs },
    );

  const put = async ({
    key,
    data,
  }: {
    key: string;
    data: ConstructorParameters<typeof PutObjectCommand>[0]['Body'];
  }) => {
    await client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: data,
      }),
    );
  };

  const deleteObject = async (key: string) => {
    await client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      }),
    );
  };

  return { get, getSignedUrl, put, delete: deleteObject };
};

export const makeBlobStore = () => {
  const client = new S3Client({
    endpoint: env.S3_URL,
    region: 'auto',
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });

  return blobClient(client);
};

export type BlobStore = ReturnType<typeof makeBlobStore>;
