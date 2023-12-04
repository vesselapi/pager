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
        'flex h-[20px] w-[20px] items-center justify-center rounded-full ring-2 ring-white bg-slate-500 text-xxs text-slate-200',
      )}
    >
      <div>{createInitials(firstName, lastName)}</div>
    </div>
  );
};

export default UserIcon;
