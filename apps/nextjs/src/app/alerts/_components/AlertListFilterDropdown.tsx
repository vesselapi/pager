import React, { useMemo, useState } from 'react';
import { MdFilterList, MdOutlineClose } from 'react-icons/md';

import CheckboxSelect from '../../_components/CheckboxSelect';
import Dropdown from '../../_components/Dropdown';
import Pill from '../../_components/Pill';
import classNames from 'classnames';
import type { ConfigOption } from '../AlertListTypes';

const AlertListFilterPill = ({
  label,
  Icon,
  condition,
  conditionOptions,
  value,
  valueOptions,
  onRemove,
  onChangeCondition,
  onChangeValue,
}: {
  label: string;
  Icon: React.ReactElement;
  condition: ConfigOption;
  conditionOptions: ConfigOption[];
  value: ConfigOption[];
  valueOptions: ConfigOption[];
  onRemove: () => void;
  onChangeCondition: (condition: ConfigOption) => void;
  onChangeValue: (value: ConfigOption[]) => void;
}) => {
  return (
    <Pill>
      <div className="flex font-semibold justify-between items-center">
        <div className="mr-1">{Icon}</div>
        {label}
      </div>
      <Dropdown size="sm" position="right" OpenButton={<div>{condition.label}</div>}>
        {conditionOptions.map(c =>
          <button key={c.value} onClick={() => onChangeCondition(c)} className={classNames('flex items-center w-full rounded')}>
            <div className='mr-1'>{c.Icon}</div>
            {c.label}
          </button>
        )}
      </Dropdown>
      <Dropdown position="right" OpenButton={
        <div className='flex items-center h-full'>{value.map((a, index) =>
          <div key={a.label} className="mr-0.5 flex font-semibold justify-between items-center">
            <div className="mr-0.5">{a.Icon}</div>
            {a.label}
            {value.length > 1 && index !== value.length - 1 ? ',' : ''}
          </div>
        )}</div>
      }>
        {valueOptions.map(v =>
          <button onClick={e => {
            const updatedValue = value.includes(v)
              ? value.filter((vf) => vf !== v)
              : [...value, v];
            onChangeValue(updatedValue);
            e.preventDefault();
          }} className='flex items-center w-full' key={v.value}>
            <input type="checkbox" className='mr-2' checked={value.includes(v)} />
            <div className='mr-1'>{v.Icon}</div>
            <div>{v.label}</div>
          </button>
        )}
      </Dropdown>
      <MdOutlineClose onClick={onRemove} />
    </Pill>
  );
};

interface FilterOption {
  property: string;
  label: string;
  Icon: React.ReactElement;
  valueOptions: ConfigOption[];
  conditionOptions: ConfigOption[];
}
export interface SelectedFilter {
  property: string;
  label: string;
  value: ConfigOption[];
  condition: ConfigOption;
  valueOptions: ConfigOption[];
  conditionOptions: ConfigOption[];
  Icon: React.ReactElement;
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
      ? selectedFilter.valueOptions
      : filterOptions.map((f) => ({ label: f.label, value: f.property, Icon: f.Icon }));
  }, [selectedFilter, filterOptions]);

  return (
    <Dropdown
      OpenButton={
        <div className="mr-1.5 flex items-center rounded bg-gray-200 px-2 py-1 text-zinc-600">
          <MdFilterList className="mr-1.5" />
          Filter
        </div>
      }
    >
      {options.map((o) => (
        <button
          key={o.label}
          className="w-full text-left"
          onClick={(e) => {
            if (selectedFilter) {
              onFilter({
                property: selectedFilter.property,
                value: [o],
                // We'll always apply the first condition for now.
                condition: selectedFilter.conditionOptions[0]!,
                conditionOptions: selectedFilter.conditionOptions,
                label: selectedFilter.label,
                Icon: selectedFilter.Icon,
                valueOptions: selectedFilter.valueOptions,
              });
              setSelected(null);
            } else {
              const filter = filterOptions.find((f) => f.label === o.label)!;
              setSelected(filter);
              e.preventDefault();
            }
          }}
        >
          <div className="flex justify-between items-center">
            {o.label}
            {o.Icon}
          </div>
        </button>
      ))}
    </Dropdown>
  );
};

export { AlertListFilterPill };
export default AlertListFilterDropdown;
