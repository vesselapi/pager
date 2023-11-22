import crypto from 'crypto';

import { db } from '@vessel/db';
import { IdGenerator, randomString } from '@vessel/db/id-generator';
import {
  ApiToken,
  ApiTokenId,
  AppId,
  OrgId,
  SecretId,
  SecretIntegrationId,
} from '@vessel/types';

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

export const makeSecretManager = () => {
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

  const put = async ({
    key,
    value,
    orgId,
  }: {
    key: string;
    value: Json;
    orgId: OrgId | null;
  }) => {
    const encrypted = encrypt(value);
    await db.secret.create({
      id: key,
      organizationId: orgId,
      ...encrypted,
    });
  };

  const get = async <T>(
    key: SecretId,
  ): Promise<{ orgId: OrgId | null; value: T } | null> => {
    const encrypted = await db.secret.find(key);
    if (!encrypted) {
      return null;
    }
    const value = decrypt(encrypted);
    return { orgId: encrypted.organizationId, value };
  };

  const makeApiToken = () => {
    const create = async (
      orgId: OrgId,
    ): Promise<{ apiTokenId: ApiTokenId; apiToken: ApiToken }> => {
      const apiToken: ApiToken = `v_apiToken_${randomString()}`;
      const apiTokenId = IdGenerator.apiToken(apiToken);
      await put({ key: apiTokenId, value: apiToken, orgId });
      return { apiTokenId, apiToken };
    };

    const find = async (apiToken: ApiToken) => {
      const apiTokenId = IdGenerator.apiToken(apiToken);
      const dbApiToken = await get<ApiToken>(apiTokenId);
      if (!dbApiToken) {
        return null;
      }
      return { orgId: dbApiToken.orgId, apiToken: dbApiToken.value };
    };
    return { create, find };
  };

  const makeIntegration = () => {
    const find = async <T>(id: SecretIntegrationId): Promise<T | null> => {
      const secret = await get<T>(id);
      if (!secret) {
        return null;
      }
      return secret.value;
    };

    const create = async <T extends Json>({
      orgId,
      appId,
      secret,
    }: {
      orgId: OrgId;
      appId: AppId;
      secret: T;
    }) => {
      await put({
        key: IdGenerator.secrets.integration({ orgId, appId }),
        value: secret,
        orgId,
      });
    };
    return { find, create };
  };

  return {
    apiToken: makeApiToken(),
    integration: makeIntegration(),
  };
};

export type SecretManager = ReturnType<typeof makeSecretManager>;