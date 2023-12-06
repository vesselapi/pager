import { BsSortDown, BsSortUp } from 'react-icons/bs';
import { MdOutlineClose, MdSort } from 'react-icons/md';

import Dropdown from '../../_components/Dropdown';
import Pill from '../../_components/Pill';
import type { SortSetting } from '../alerts.types';

type TOnSort = (s: {
  property: SortSetting['property'];
  label: string;
  Icon: React.ReactElement;
}) => void;

const SortItem = ({
  label,
  value,
  onSort,
  Icon,
}: {
  label: string;
  value: SortSetting['property'];
  onSort: TOnSort;
  Icon: React.ReactElement;
}) => {
  return (
    <button
      onClick={(_) => onSort({ property: value, label, Icon })}
      className="w-full cursor-pointer text-left"
    >
      <div className="flex items-center justify-between">
        {label}
        {Icon}
      </div>
    </button>
  );
};

const AlertListSortPill = ({
  label,
  order,
  Icon,
  onFlipOrder,
  onRemove,
}: {
  label: string;
  Icon: React.ReactElement;
  order?: 'asc' | 'desc';
  onFlipOrder: () => void;
  onRemove: () => void;
}) => {
  return (
    <Pill>
      <div className="flex items-center justify-between font-semibold">
        <div className="mr-1">{Icon}</div>
        {label}
      </div>
      <button onClick={onFlipOrder}>
        {order === 'desc' ? <BsSortDown /> : <BsSortUp />}
      </button>
      <button onClick={onRemove}>
        <MdOutlineClose className="text-lg text-slate-500" />
      </button>
    </Pill>
  );
};

const AlertListSortDropdown = ({
  sorts,
  onSort,
}: {
  sorts: {
    label: string;
    value: SortSetting['property'];
    Icon: React.ReactElement;
  }[];
  onSort: TOnSort;
}) => {
  return (
    <Dropdown
      OpenButton={
        <div className="mr-1.5 flex items-center rounded bg-gray-200 px-2 py-1 text-zinc-600 text-sm">
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
