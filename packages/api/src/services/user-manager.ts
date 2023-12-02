import { User } from '@vessel/db/schema/user';
import { UserId } from '@vessel/types';
import { omit } from 'radash';
import { makeBlobStore } from './blobStore';

const PROFILE_PIC_S3_PATH = (id: UserId) => `user/${id}/profile-pic`;

export const makeUserManager = () => {
  const blobStore = makeBlobStore();

  const makeProfilePic = () => {
    const getUrl = async (id: UserId) => {
      return blobStore.getSignedUrl({
        key: PROFILE_PIC_S3_PATH(id),
        expiresInMs: 1000 * 60 * 60 * 12, // 12 hours expiry
      });
    };
    const put = async ({ id, url }: { id: UserId; url: string }) => {
      const key = PROFILE_PIC_S3_PATH(id);
      const res = await fetch(url);
      await blobStore.put({ key, data: await res.blob() });
      return { key };
    };
    const addToUser = async (user: User) => {
      const imageUrl = await getUrl(user.id);
      return { ...omit(user, ['imageS3Key']), imageUrl };
    };
    return { getUrl, put, addToUser };
  };

  return { profilePic: makeProfilePic() };
};

export type UserManager = ReturnType<typeof makeUserManager>;
