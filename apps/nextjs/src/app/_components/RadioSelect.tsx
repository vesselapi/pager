import React from 'react';

interface Option {
    value: any;
    label: string;
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
        <div>
            {options.map(({ value: optionValue, label }) => (
                <label key={optionValue}>
                    <input
                        type="radio"
                        value={optionValue}
                        checked={value === optionValue}
                        onChange={() => onChange(optionValue)}
                    />
                    {label}
                </label>
            ))}
        </div>
    );
};

export default RadioSelect;
