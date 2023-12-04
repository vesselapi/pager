import classNames from 'classnames';

const createInitials = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const initials = (firstName?.charAt(0) ?? '') + (lastName?.charAt(0) ?? '');
  return initials.toUpperCase();
};

const UserIcon = ({
  size = 'sm',
  className,
  firstName,
  lastName,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  firstName?: string | null;
  lastName?: string | null;
}) => {
  if (!firstName && !lastName) {
    return (
      <div
        className={classNames(
          'h-[20px] w-[20px] rounded-full bg-slate-500 ring-2 ring-white',
          className,
        )}
      ></div>
    );
  }
  return (
    <div
      className={classNames(
        className,
        'flex items-center justify-center rounded-full ring-2 ring-white bg-slate-500 text-slate-200',
        {
          'h-[20px] w-[20px] text-xxs': size === 'sm',
          'h-[30px] w-[30px] text-xs': size === 'md',
          'h-[40px] w-[40px] text-sm': size === 'lg',
        },
      )}
    >
      <div>{createInitials(firstName, lastName)}</div>
    </div>
  );
};

export default UserIcon;
