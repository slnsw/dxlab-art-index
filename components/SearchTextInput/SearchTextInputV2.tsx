import React from 'react';

import Icon from '../Icon';
import useDebounce from '../../lib/hooks/use-debounce';

import css from './SearchTextInput.module.scss';

type Props = {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  debounceTime?: number;
  onChange?: (value: string) => void;
};

/**
 * Search input box component with clear button and debounce feature
 * TODO: Test this v2 component out with Diary Files before switching it over
 */
const SearchTextInputV2: React.FC<Props> = React.memo(
  ({
    name,
    defaultValue,
    placeholder,
    className,
    debounceTime = 0,
    onChange,
    ...restProps
  }) => {
    const [inputValue, setInputValue] = React.useState(defaultValue);
    const debouncedInputValue = useDebounce(inputValue, debounceTime);

    React.useEffect(() => {
      if (typeof onChange === 'function') {
        onChange(debouncedInputValue);
      }
    }, [debouncedInputValue, onChange]);

    const handleInputChange = (event) => {
      const newValue = event?.target?.value;
      setInputValue(newValue);
    };

    const handleCloseClick = () => {
      setInputValue('');
    };

    return (
      <div className={[css.searchTextInput, className || ''].join(' ')}>
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          value={inputValue || ''}
          className={css.input}
          onChange={handleInputChange}
          {...restProps}
        />

        {inputValue && inputValue.length > 0 && (
          <button
            type="button"
            className={css.clearButton}
            aria-label="Clear text"
            onClick={handleCloseClick}
          >
            <Icon name="close" colour="white" size={'lg'} />
          </button>
        )}
      </div>
    );
  },
);

export default SearchTextInputV2;
