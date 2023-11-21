import { useMemo, useState } from 'react';
import { MdFilterList, MdOutlineClose } from 'react-icons/md';

import Dropdown from '../../_components/Dropdown';
import Pill from '../../_components/Pill';

const AlertListFilterPill = ({
  property,
  condition,
  value,
}: {
  property: string;
  condition: string;
  value: string | string[];
}) => { 
  return (
    <Pill>   
      <div>{property}</div>
      <Dropdown>{condition}</Dropdown>
      <Dropdown>{value}</Dropdown>
      <button onClick={onRemove}>
        <MdOutlineClose />  
      </button>
    </Pill>
  );
};

interface FilterOption {
  property: string;
  options: { label: string; value: string }[];
  condition: string;
}
interface SelectedFilter {
  property: string;
  value: string[];
  condition: string;
}

const AlertListFilterDropdown = ({
  filters,
  onFilter,
}: {
  filters: FilterOption[];
  onFilter: (filter: SelectedFilter) => void;
}) => {
  const [selectedFilter, setSelected] = useState<FilterOption | null>(null);

  const options = useMemo(() => {
    return selectedFilter
      ? selectedFilter.options
      : filters.map((f) => ({ label: f.property, value: f.property }));
  }, [selectedFilter, filters]);

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
          onClick={(e) => {
            if (selectedFilter) {
              onFilter({
                property: selectedFilter.property,
                value: [o.value],
                condition: selectedFilter.condition,
              });
            } else {
              const filter = filters.find((f) => f.property === o.value)!;
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
