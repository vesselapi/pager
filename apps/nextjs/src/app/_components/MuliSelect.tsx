import React from 'react';

interface Option {
    value: any;
    label: string;
}

const MultiSelect = ({
    options,
    value,
    onChange,
}: {
    options: Option[];
    value: any[];
    onChange: (value: any[]) => void;
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Convert the selected options to an array
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        onChange(selectedOptions);
    };

    return (
        <select multiple value={value} onChange={handleChange}>
            {options.map(({ value: optionValue, label }) => (
                <option key={optionValue} value={optionValue}>
                    {label}
                </option>
            ))}
        </select>
    );
};

export default MultiSelect;
