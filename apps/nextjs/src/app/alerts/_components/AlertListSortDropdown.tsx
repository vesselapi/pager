import { BsSortDown, BsSortUp } from 'react-icons/bs';
import { MdOutlineClose, MdSort } from 'react-icons/md';

import Dropdown from '../../_components/Dropdown';
import Pill from '../../_components/Pill';

type TOnSort = (s: string) => void;

const SortItem = ({
  label,
  value,
  onSort,
}: {
  label: string;
  value: string;
  onSort: TOnSort;
}) => {
  return (
    <button onClick={(_) => onSort(value)} className="cursor-pointer">
      {label}
    </button>
  );
};

const AlertListSortPill = ({
  title,
  order,
  onFlipOrder,
  onRemove,
}: {
  title: string;
  order?: 'asc' | 'desc';
  onFlipOrder: () => void;
  onRemove: () => void;
}) => {
  return (
    <Pill>
      <div>{title}</div>
      <button onClick={onFlipOrder}>{order === 'asc' ? <BsSortUp /> : <BsSortDown />}</button>
      <button onClick={onRemove}>
        <MdOutlineClose />
      </button>
    </Pill>
  );
};

const AlertListSortDropdown = ({
  sorts,
  onSort,
}: {
  sorts: { label: string; value: string }[];
  onSort: TOnSort;
}) => {
  return (
    <Dropdown
      OpenButton={
        <div className="mr-1 flex items-center rounded bg-gray-200 px-2 py-1">
          <MdSort className="mr-1" />
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
        />
      ))}
    </Dropdown>
  );
};

export { AlertListSortPill };
export default AlertListSortDropdown;
