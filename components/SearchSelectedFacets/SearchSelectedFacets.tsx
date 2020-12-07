import React from 'react';

import CTALink from '../CTALink';
import Icon from '../Icon';

import css from './SearchSelectedFacets.module.scss';

type Props = {
  facets?: {
    name: string;
    value: string;
    url: string;
  }[];
  className?: string;
};

const SearchSelectedFacets: React.FC<Props> = ({ facets = [], className }) => {
  return (
    <div className={[css.searchSelectedFacets, className || ''].join(' ')}>
      {facets.map((facet) => {
        return (
          <CTALink href={facet.url} className={css.facet} key={facet.value}>
            <span className={css.facetName}>{facet.name}</span>{' '}
            <Icon name="close" colour="white" size="sm" />
          </CTALink>
        );
      })}
    </div>
  );
};

export default SearchSelectedFacets;
