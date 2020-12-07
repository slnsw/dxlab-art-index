import React from 'react';

import css from './TextButton.module.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const TextButton: React.FC<Props> = ({ children, className, onClick }) => {
  return (
    <button
      className={[css.textButton, className || ''].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TextButton;
