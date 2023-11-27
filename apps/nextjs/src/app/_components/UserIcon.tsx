'use client'

import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

const createInitials = (
  firstName: string | null,
  lastName: string | null,
): string => {
  const initials = (firstName?.charAt(0) ?? '') + (lastName?.charAt(0) ?? '');
  return initials.toUpperCase();
};

const UserIcon = () => {
  const [user, setUser] = useState()

  const createOrGetUser = api.user.me.useMutation({
    onSuccess: (result) => setUser(result?.user),
  })

  useEffect(() => {
    createOrGetUser.mutate({ id: 'hey ' });
  }, [])

  console.log(user)
  if (!user) {
    return (
      <div className="h-[18px] w-[18px]  rounded-full bg-gray-500 ring-1 ring-gray-400"></div>
    );
  }

  // TODO(@zkirby): Add support for profile image
  //   <Image
  //   className="h-[18px] w-[18px] rounded-full object-cover ring-1 ring-gray-400"
  //   src={user.imageUrl}
  //   width={20}
  //   height={20}
  //   alt="Profile Picture"
  // />

  return (<div
    className={
      'flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-500 text-slate-200 text-[9px]'
    }
  >
    <div>{createInitials(user.firstName, user.lastName)}</div>
  </div >)
};

export default UserIcon;
