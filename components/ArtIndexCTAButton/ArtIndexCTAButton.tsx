import React from 'react';
import CTAButton from '../CTAButton';

import css from './ArtIndexCTAButton.module.scss';

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick: Function;
};

const ArtIndexCTAButton: React.FC<Props> = ({
  className,
  children,
  onClick,
}) => {
  return (
    <CTAButton
      className={[css.artIndexCtaButton, className || ''].join(' ')}
      variant="secondary"
      onClick={onClick}
    >
      <span>{children}</span>
    </CTAButton>
  );
};

export default ArtIndexCTAButton;
