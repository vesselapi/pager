import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

const createInitials = (
  firstName: string | null,
  lastName: string | null,
): string => {
  const initials = (firstName?.charAt(0) ?? '') + (lastName?.charAt(0) ?? '');
  return initials.toUpperCase();
};

const UserIcon = () => {
  const auth = useUser();
  if (!auth?.user)
    return (
      <div className="h-[18px] w-[18px]  rounded-full bg-gray-500 ring-1 ring-gray-400"></div>
    );
  return auth.user.hasImage ? (
    <Image
      className="h-[18px] w-[18px] rounded-full object-cover ring-1 ring-gray-400"
      src={auth.user.imageUrl}
      width={20}
      height={20}
      alt="Profile Picture"
    />
  ) : (
    <div
      className={
        'flex h-[18px] w-[18px]  items-center justify-center  rounded-full bg-gray-500 ring-2 ring-gray-400'
      }
    >
      {createInitials(auth.user.firstName, auth.user.lastName)}
    </div>
  );
};

export default UserIcon;