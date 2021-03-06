import { Component } from 'react';
import PropTypes from 'prop-types';

import Link from '../Link';

// import './Menu.module.css';

type Props = {
  id: string;
  className?: string;
  menuItemClassName?: string;
  labelledby: string;
  menuItems: {
    name: string;
    url: string;
    isActive: boolean;
    ariaLabel: string;
  }[];
  pathname: string;
  onMenuItemClick(event): void;
};

class Menu extends Component<Props> {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    menuItemClassName: PropTypes.string,
    labelledby: PropTypes.string,
    pathname: PropTypes.string,
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        url: PropTypes.string,
        isActive: PropTypes.bool,
        ariaLabel: PropTypes.string,
      }),
    ).isRequired,
    onMenuItemClick: PropTypes.func,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const {
      id,
      className,
      menuItemClassName,
      labelledby,
      menuItems,
      pathname,
      onMenuItemClick,
    } = this.props;

    return (
      <ul
        id={id}
        className={`menu ${className || ''}`}
        role="menu"
        aria-labelledby={labelledby}
      >
        {menuItems.map((item, i) => {
          return (
            <li
              key={`menu__item-${i}`}
              className={`menu__item ${menuItemClassName || ''}`}
              role="menuitem"
              onClick={onMenuItemClick}
            >
              <Link as={item.url} key={item.url}>
                <a
                  href={item.url}
                  className={
                    pathname === item.url || item.isActive
                      ? 'is-active'
                      : undefined
                  }
                  aria-label={item.ariaLabel}
                >
                  {item.name}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Menu;
