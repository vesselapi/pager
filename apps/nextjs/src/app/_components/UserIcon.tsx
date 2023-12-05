import classNames from 'classnames';
import Image from 'next/image';

const createInitials = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const initials = (firstName?.charAt(0) ?? '') + (lastName?.charAt(0) ?? '');
  return initials.toUpperCase();
};

const UserIcon = ({
  className,
  firstName,
  lastName,
  imageUrl,
}: {
  className?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}) => {
  if (!firstName && !lastName && !imageUrl) {
    return (
      <div
        className={classNames(
          'h-[20px] w-[20px] rounded-full bg-slate-500 ring-2 ring-white',
          className,
        )}
      ></div>
    );
  } else if (imageUrl) {
    return (
      <div>
        <Image
          className="rounded-full bg-slate-500 text-slate-200 h-[23px] w-[23px] text-xxs object-cover border-2 border-white"
          src={imageUrl}
          alt={'user profile picture'}
          width={25}
          height={25}
        />
      </div>
    );
  }
  return (
    <div
      className={classNames(
        className,
        'flex items-center justify-center rounded-full ring-2 ring-white bg-slate-500 text-slate-200 h-[20px] w-[20px] text-xxs',
      )}
    >
      <div>{createInitials(firstName, lastName)}</div>
    </div>
  );
};

export default UserIcon;
