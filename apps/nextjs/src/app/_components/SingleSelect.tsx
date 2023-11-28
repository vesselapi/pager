interface Option {
  value: any;
  label: string;
}

const SingleSelect = ({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <select value={value} onChange={onChange}>
      {options.map(({ value: optionValue, label }) => (
        <option key={label} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default SingleSelect;
