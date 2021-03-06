import React from 'react';

import css from './Button.module.scss';

type Props = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

type Methods = null;

// React.forwardRef added because of:
// Warning: Function components cannot be given refs. Attempts to access
// this ref will fail. Did you mean to use React.forwardRef()? Check the
// render method of `Link`.
// https://github.com/zeit/next.js/issues/7915
const Button = React.forwardRef<Methods, Props>(
  ({ disabled, children, className, onClick, ...restProps }, ref) => {
    return (
      <button
        disabled={disabled}
        className={[css.button, className || ''].join(' ')}
        onClick={onClick}
        {...restProps}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);

export default Button;
