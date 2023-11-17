import crypto from 'crypto';

import { db, eq } from '@vessel/db';
import { secret } from '@vessel/db/schema/secret';

import { env } from '../../env.mjs';

export type Json =
  | string
  | number
  | boolean
  | { [Key in string]?: Json }
  | Json[]
  | null;

const ALGORITHM = 'aes-256-cbc';

type Encrypted = {
  iv: string;
  encryptedData: string;
};

export const makeSecret = () => {
  const encrypt = (json: Json) => {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(env.DATABASE_SECRET_STORE_KEY),
      iv,
    );
    let encrypted = cipher.update(JSON.stringify(json));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  };

  const decrypt = (encrypted: Encrypted) => {
    let iv = Buffer.from(encrypted.iv, 'hex');
    let encryptedText = Buffer.from(encrypted.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(env.DATABASE_SECRET_STORE_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  };

  const put = async ({ key, value }: { key: string; value: Json }) => {
    const encrypted = encrypt(value);
    await db.insert(secret).values({
      id: key,
      ...encrypted,
    });
  };

  const get = async <T>(key: string): Promise<T> => {
    const encrypted = await db.query.secret.findFirst({
      where: eq(secret.id, key),
    });
    if (!encrypted) {
      throw new Error('Secret not found');
    }
    return decrypt(encrypted);
  };
};

export type Secret = ReturnType<typeof makeSecret>;
