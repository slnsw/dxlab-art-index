import React from 'react';
import { useLockBodyScroll } from '../../lib/hooks/use-lock-body-scroll';

import Overlay from '../Overlay';

import css from './Sidebar.module.scss';

type Props = {
  isOpen?: boolean;
  direction?: 'left' | 'right';
  className?: string;
  insideClassName?: string;
  children?: React.ReactNode;
  onCloseClick?: Function;
};

/**
 * Mobile responsive sidebar, hidden for smaller devices and visible for
 * larger devices.
 */
const Sidebar = ({
  isOpen,
  direction = 'left',
  className,
  insideClassName,
  children,
  onCloseClick,
}: Props) => {
  useLockBodyScroll(isOpen);

  return (
    <div className={[css.sidebar, className || ''].join(' ')}>
      <div
        className={[
          css.inside,
          direction === 'left' ? css.directionLeft : '',
          direction === 'right' ? css.directionRight : '',
          insideClassName || '',
          isOpen ? css.isOpen : '',
        ].join(' ')}
      >
        {children}
      </div>

      <Overlay
        isActive={isOpen}
        className={css.overlay}
        onClick={onCloseClick}
      />
    </div>
  );
};

export default Sidebar;
