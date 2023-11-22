import { BsSortDown, BsSortUp } from 'react-icons/bs';
import { MdOutlineClose, MdSort } from 'react-icons/md';

import Dropdown from '../../_components/Dropdown';
import Pill from '../../_components/Pill';

type TOnSort = (s: { property: string, label: string }) => void;

const SortItem = ({
  label,
  value,
  onSort,
  Icon,
}: {
  label: string;
  value: string;
  onSort: TOnSort;
  Icon: React.ReactElement
}) => {
  return (
    <button
      onClick={(_) => onSort({ property: value, label })}
      className="w-full cursor-pointer text-left"
    >
      <div className="flex justify-between items-center">
        {label}
        {Icon}
      </div>
    </button>
  );
};

const AlertListSortPill = ({
  label,
  order,
  onFlipOrder,
  onRemove,
}: {
  label: string;
  order?: 'asc' | 'desc';
  onFlipOrder: () => void;
  onRemove: () => void;
}) => {
  return (
    <Pill>
      <div className='text-bold'>{label}</div>
      <button onClick={onFlipOrder}>
        {order === 'desc' ? <BsSortDown /> : <BsSortUp />}
      </button>
      <button onClick={onRemove}>
        <MdOutlineClose className="text-lg" />
      </button>
    </Pill>
  );
};

const AlertListSortDropdown = ({
  sorts,
  onSort,
}: {
  sorts: { label: string; value: string; Icon: React.ReactElement }[];
  onSort: TOnSort;
}) => {
  return (
    <Dropdown
      OpenButton={
        <div className="mr-1.5 flex items-center rounded bg-gray-200 px-2 py-1 text-zinc-600">
          <MdSort className="mr-1.5" />
          Sort
        </div>
      }
    >
      {sorts.map((s) => (
        <SortItem
          key={s.label}
          onSort={onSort}
          label={s.label}
          value={s.value}
          Icon={s.Icon}
        />
      ))}
    </Dropdown>
  );
};

export { AlertListSortPill };
export default AlertListSortDropdown;
