import React from 'react';

interface Option {
  value: any;
  label: string;
}

const CheckboxSelect = ({
  options,
  value,
  onChange,
  preventDefault = false,
}: {
  options: Option[];
  value: any[];
  onChange: (value: any[]) => void;
  preventDefault?: boolean;
}) => {
  const handleChange = (optionValue: any) => {
    const updatedValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(updatedValue);
  };

  return (
    <div className='flex flex-col'>
      {options.map(({ value: optionValue, label }) => (
        <label key={optionValue}>
          <input
            type="checkbox"
            value={optionValue}
            checked={value.includes(optionValue)}
            onChange={(e) => {
              if (preventDefault) e.preventDefault();
              handleChange(optionValue);
              e.preventDefault();
            }}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

export default CheckboxSelect;
