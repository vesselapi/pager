import React, { useState } from 'react';
import classNames from 'classnames';
import { MdFilterList, MdOutlineClose } from 'react-icons/md';

import Dropdown from '../../_components/Dropdown';
import Pill from '../../_components/Pill';
import type { ConfigOption, FilterSetting } from '../AlertListTypes';

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
      <div className="flex items-center justify-between font-semibold">
        <div className="mr-1">{Icon}</div>
        {label}
      </div>
      <Dropdown
        size="sm"
        position="right"
        OpenButton={<div>{condition.label}</div>}
      >
        {conditionOptions.map((c) => (
          <button
            key={c.value}
            onClick={() => onChangeCondition(c)}
            className={classNames('flex w-full items-center rounded')}
          >
            <div className="mr-1">{c.Icon}</div>
            {c.label}
          </button>
        ))}
      </Dropdown>
      <Dropdown
        position="right"
        OpenButton={
          <div className="flex h-full items-center">
            {value.map((a, index) => (
              <div
                key={a.label}
                className="mr-0.5 flex items-center justify-between font-semibold"
              >
                <div className="mr-1">{a.Icon}</div>
                {a.label}
                {value.length > 1 && index !== value.length - 1 ? ',' : ''}
              </div>
            ))}
          </div>
        }
      >
        {valueOptions.map((v) => (
          <button
            onClick={(e) => {
              const updatedValue = value.includes(v)
                ? value.filter((vf) => vf !== v)
                : [...value, v];
              onChangeValue(updatedValue);
              e.preventDefault();
            }}
            className="flex w-full items-center"
            key={v.value}
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={value.includes(v)}
            />
            <div className="mr-1">{v.Icon}</div>
            <div>{v.label}</div>
          </button>
        ))}
      </Dropdown>
      <MdOutlineClose onClick={onRemove} />
    </Pill>
  );
};

type FilterOption = Omit<FilterSetting, 'value' | 'condition'>;

/**
 * Alert list filter works by first setting the dropdown
 * to display all the passed in filter options (the possible filters
 * the user can pick), then by setting the dropdown options to be
 * the possible values that the filter can have.
 */
const AlertListFilterDropdown = ({
  filterOptions,
  onFilter,
}: {
  filterOptions: FilterOption[];
  onFilter: (filter: FilterSetting) => void;
}) => {
  const [selectedFilter, setSelected] = useState<FilterOption | null>(null);

  return (
    <Dropdown
      OpenButton={
        <div className="mr-1.5 flex items-center rounded bg-gray-200 px-2 py-1 text-zinc-600">
          <MdFilterList className="mr-1.5" />
          Filter
        </div>
      }
    >
      {selectedFilter ? (
        selectedFilter.valueOptions.map((o) => (
          <button
            key={o.label}
            className="w-full text-left"
            onClick={() => {
              onFilter({
                ...selectedFilter,
                value: [o],
                // NOTE(@zkirby): We'll always apply the first condition
                condition: selectedFilter.conditionOptions[0]!,
              });
              setSelected(null);
            }}
          >
            <div className="flex items-center justify-between">
              {o.label}
              {o.Icon}
            </div>
          </button>
        ))
      ) : (
        filterOptions.map((o) => (
          <button
            key={o.label}
            className="w-full text-left"
            onClick={(e) => {
              setSelected(o);
              e.preventDefault();
            }}
          >
            <div className="flex items-center justify-between">
              {o.label}
              {o.Icon}
            </div>
          </button>
        ))
      )}
    </Dropdown>
  );
};

export { AlertListFilterPill };
export default AlertListFilterDropdown;
