import classNames from 'classnames';

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
}: {
  className?: string;
  firstName?: string | null;
  lastName?: string | null;
}) => {
  if (!firstName && !lastName) {
    return (
      <div
        className={classNames(
          'h-[20px] w-[20px] rounded-full bg-gray-500 ring-1 ring-gray-400',
          className,
        )}
      ></div>
    );
  }
  return (
    <div
      className={classNames(
        'flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-500 text-xxs text-slate-200',
        className,
      )}
    >
      <div>{createInitials(firstName, lastName)}</div>
    </div>
  );
};

export default UserIcon;
