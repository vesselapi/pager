import classNames from 'classnames';

type ButtonType = 'primary' | 'secondary' | 'tertiary';

const Styles: Record<ButtonType, string> = {
  primary: 'rounded bg-gray-200 px-2 py-1 text-zinc-600',
  secondary: '', // TODO: Create secondary styles
  tertiary: 'rounded text-zinc-600 px-2 py-1',
};

const Button = ({
  type = 'primary',
  className,
  onClick,
  disabled,
  children,
}: {
  type?: ButtonType;
  className?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  children: React.ReactNode | React.ReactNode[];
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={classNames(Styles[type], className)}
  >
    {children}
  </button>
);

export default Button;
