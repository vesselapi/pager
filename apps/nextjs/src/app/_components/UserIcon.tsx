import { currentUser } from '@clerk/nextjs';
import classnames from 'classnames';

const createInitials = (
  firstName: string | null,
  lastName: string | null,
): string => {
  const initials = (firstName?.charAt(0) ?? '') + (lastName?.charAt(0) ?? '');
  return initials.toUpperCase();
};

const UserIcon = async ({ size = 'small' }: { size?: 'small' | 'large' }) => {
  const user = await currentUser();

  if (!user) return <div>N/A</div>;

  //   return user.imageUrl ? (
  //     <Image
  //       src={user.imageUrl}
  //       width={width}
  //       height={height}
  //       alt="Profile Picture"
  //     />
  //   ) : (
  //     <div>{createInitials(user.firstName, user.lastName)}</div>
  //   );
  return (
    <div
      className={classnames(
        {
          'h-6 w-6': size === 'small',
        },
        'flex items-center justify-center rounded-full bg-white',
      )}
    >
      {createInitials(user.firstName, user.lastName)}
    </div>
  );
};

export default UserIcon;
