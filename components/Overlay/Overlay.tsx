import React from 'react';

import css from './Overlay.module.scss';

type Props = {
  isActive?: boolean;
  className?: string;
  onClick?: Function;
};

const Overlay = ({ isActive, className, onClick }: Props) => {
  return (
    <div
      className={[
        css.overlay,
        isActive ? css.isActive : '',
        className || '',
      ].join(' ')}
      onClick={() => {
        if (typeof onClick === 'function') {
          onClick();
        }
      }}
    ></div>
  );
};

export default Overlay;
