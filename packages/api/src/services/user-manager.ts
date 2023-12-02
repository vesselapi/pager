import { UserId } from '@vessel/types';
import { makeBlobStore } from './blobStore';

const PROFILE_PIC_S3_PATH = (id: UserId) => `user/${id}/profile-pic`;

export const makeUserManager = () => {
  const blobStore = makeBlobStore();

  const profilePic = {
    getUrl: async (id: UserId) => {
      return blobStore.getSignedUrl({
        key: PROFILE_PIC_S3_PATH(id),
        expiresInMs: 1000 * 60 * 60 * 12, // 12 hours expiry
      });
    },
    put: async ({ id, url }: { id: UserId; url: string }) => {
      const key = PROFILE_PIC_S3_PATH(id);
      const res = await fetch(url);
      await blobStore.put({ key, data: await res.blob() });
      return { key };
    },
  };

  return { profilePic };
};

export type UserManager = ReturnType<typeof makeUserManager>;
