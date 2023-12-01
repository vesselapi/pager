import React from 'react';

const Button = ({
  children,
  onClick,
  disabled,
}: {
  children?: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
}) => (
  <button disabled={disabled} onClick={onClick}>
    {children}
  </button>
);

export default Button;
