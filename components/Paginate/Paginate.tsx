import React from 'react';
import ReactPaginate from 'react-paginate';

import css from './Paginate.module.scss';

type Props = {
  pageCount: number;
  initialPage: number;
  pageRangeDisplayed?: number;
  marginPagesDisplayed?: number;
  hrefBuilder?: Function;
  onPageChange?: Function;
  className?: string;
};

const Paginate: React.FC<Props> = ({
  pageCount,
  initialPage,
  pageRangeDisplayed = 2,
  marginPagesDisplayed = 1,
  hrefBuilder,
  onPageChange,
  className,
}: Props) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      initialPage={initialPage}
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      hrefBuilder={hrefBuilder}
      disableInitialCallback={true}
      onPageChange={onPageChange}
      containerClassName={[css.paginate, className || ''].join(' ')}
      pageClassName={[css.page].join(' ')}
      pageLinkClassName={[css.pageLink].join(' ')}
      previousClassName={[css.previous].join(' ')}
      previousLinkClassName={[css.previousLink].join(' ')}
      nextClassName={[css.next].join(' ')}
      nextLinkClassName={[css.nextLink].join(' ')}
      activeLinkClassName={[css.activeLink].join(' ')}
    />
  );
};

export default Paginate;
