import classNames from 'classnames';
import React from 'react';

interface Option {
  value: any;
  label: string;
  Icon: React.ReactElement;
}

const RadioSelect = ({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: any;
  onChange: (value: any) => void;
}) => {
  return (
    <div className='flex'>
      {options.map(({ value: optionValue, label, Icon }, index) => (
        <label key={optionValue} className={classNames('cursor-pointer flex items-center border px-2 py-1', { 'bg-gray-200': optionValue === value, 'rounded-l-lg': index === 0, 'rounded-r-lg': index === options.length - 1 })}>
          <input
            className='hidden peer'
            type="radio"
            value={optionValue}
            checked={value === optionValue}
            onChange={() => onChange(optionValue)}
          />
          {Icon ?? label}
        </label>
      ))}
    </div>
  );
};

export default RadioSelect;
