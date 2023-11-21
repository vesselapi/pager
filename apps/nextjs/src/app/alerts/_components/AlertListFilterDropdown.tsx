import { useMemo, useState } from 'react';
import { MdFilterList, MdOutlineClose } from 'react-icons/md';

import Dropdown from '../../_components/Dropdown';
import Pill from '../../_components/Pill';
import RadioSelect from '../../_components/RadioSelect';
import CheckboxSelect from '../../_components/CheckboxSelect';

const AlertListFilterPill = ({
  property,
  condition,
  conditionOptions,
  value,
  valueOptions,
  onRemove,
  onChangeCondition,
  onChangeValue,
}: {
  property: string;
  condition: string;
  conditionOptions: { label: string; value: string }[];
  value: string | string[];
  valueOptions: { label: string; value: string }[];
  onRemove: () => void;
  onChangeCondition: (condition: string) => void;
  onChangeValue: (value: string | string[]) => void;
}) => {
  const arrayValue = Array.isArray(value) ? value : [value]

  return (
    <Pill>
      <div>{property}</div>
      <Dropdown OpenButton={<div>{condition}</div>}>
        <RadioSelect value={condition} options={conditionOptions} onChange={(e: string) => {
          onChangeCondition(e)
        }}
        />
      </Dropdown>
      <Dropdown OpenButton={<div>{arrayValue.join(', ')}</div>}>
        <CheckboxSelect value={arrayValue} options={valueOptions} onChange={values => onChangeValue(values)} preventDefault />
      </Dropdown>
      <button onClick={onRemove}>
        <MdOutlineClose />
      </button>
    </Pill>
  );
};

interface FilterOption {
  property: string;
  label: string;
  options: { label: string; value: string }[];
  conditions: string[];
}
interface SelectedFilter {
  property: string;
  value: string[];
  condition: string;
}

const AlertListFilterDropdown = ({
  filterOptions,
  onFilter,
}: {
  filterOptions: FilterOption[];
  onFilter: (filter: SelectedFilter) => void;
}) => {
  const [selectedFilter, setSelected] = useState<FilterOption | null>(null);

  const options = useMemo(() => {
    return selectedFilter
      ? selectedFilter.options
      : filterOptions.map((f) => ({ label: f.label, value: f.property }));
  }, [selectedFilter, filterOptions]);

  return (
    <Dropdown
      OpenButton={
        <div className="mr-1 flex items-center rounded bg-gray-200 px-2 py-1">
          <MdFilterList className="mr-1" />
          Filter
        </div>
      }
    >
      {options.map((o) => (
        <button
          key={o.value}
          className='w-full text-left'
          onClick={(e) => {
            if (selectedFilter) {
              onFilter({
                property: selectedFilter.property,
                value: [o.value],
                // We'll always apply the first condition for now.
                condition: selectedFilter.conditions[0]!,
                conditionOptions: selectedFilter.conditions.map(a => ({ label: a, value: a })),
                valueOptions: selectedFilter.options,
              });
              setSelected(null);
            } else {
              const filter = filterOptions.find((f) => f.property === o.value)!;
              setSelected(filter);
              e.preventDefault();
            }
          }}
        >
          {o.label}
        </button>
      ))}
    </Dropdown>
  );
};

export { AlertListFilterPill };
export default AlertListFilterDropdown;
