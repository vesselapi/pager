import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { GrStatusGood } from 'react-icons/gr';
import { MdOutlineClose } from 'react-icons/md';
import { RxAvatar } from 'react-icons/rx';
import { TbClock, TbLetterCase, TbMinus, TbPlus } from 'react-icons/tb';

import { api } from '~/utils/api';
import { useUser } from '../../hooks/useUser';
import Loader from '../_components/Loader';
import Search from '../_components/Search';
import AlertsListItem from './AlertListItem';
import AlertListDisplayDropdown from './_components/AlertListDisplayDropdown';
import AlertListFilterDropdown, {
  AlertListFilterPill,
} from './_components/AlertListFilterDropdown';
import AlertListSortDropdown, {
  AlertListSortPill,
} from './_components/AlertListSortDropdown';
import { useSearch } from './_hooks/useSearch';
import type {
  Alert,
  DisplaySettings,
  FilterSetting,
  SortSetting,
} from './alerts.types';

// -------------------------------
// Filter Configs
const StatusFilterConfig = {
  property: 'status' as const,
  label: 'Status',
  valueOptions: [
    {
      label: 'Acked',
      value: 'ACKED',
      Icon: <div className="h-[12px] w-[12px] rounded-full bg-blue-300" />,
    },
    {
      label: 'Open',
      value: 'OPEN',
      Icon: <div className="h-[12px] w-[12px] rounded-full bg-red-300" />,
    },
    {
      label: 'Closed',
      value: 'CLOSED',
      Icon: <div className="h-[12px] w-[12px] rounded-full bg-green-300" />,
    },
  ],
  conditionOptions: [
    { label: 'Is', value: 'IS', Icon: <TbPlus /> },
    { label: 'Is not', value: 'IS_NOT', Icon: <TbMinus /> },
  ],
  Icon: <GrStatusGood />,
};
const AssignedToFilterConfig = <T extends { email: string | null; id: string }>(
  users: T[] = [],
) => ({
  property: 'assignedToId' as const,
  label: 'Assigned To',
  valueOptions:
    users?.map((u) => ({
      label: u.email ?? u.id,
      value: u.id,
      Icon: <></>,
    })) ?? [],
  conditionOptions: [
    { label: 'Is', value: 'IS', Icon: <TbPlus /> },
    { label: 'Is not', value: 'IS_NOT', Icon: <TbMinus /> },
  ],
  Icon: <RxAvatar />,
});

const AlertsList = () => {
  const [display, setDisplay] = useState<DisplaySettings>({
    cardType: 'condensed',
  });
  const [sorts, setSorts] = useState<SortSetting[]>([]);
  const [search, setSearch] = useSearch();

  const { conditionOptions, valueOptions } = StatusFilterConfig;
  const [filters, setFilters] = useState<FilterSetting[]>([
    // By default, we sort out the closed alerts.
    {
      ...StatusFilterConfig,
      condition: conditionOptions.find((c) => c.value === 'IS_NOT')!,
      value: [valueOptions.find((v) => v.value === 'CLOSED')!],
    },
  ]);

  // TODO(@zkirby): Clean this up.
  const allFilters = useMemo(() => {
    const searchFilter = [
      { property: 'title', value: search, condition: 'CONTAINS' },
    ];
    const otherFilters = filters?.map((f) => ({
      property: f.property,
      value: f.value.map((v) => v.value),
      condition: f.condition.value,
    }));
    return [...(otherFilters ?? []), ...(search ? searchFilter : [])];
  }, [filters, search]);
  const allSorts = useMemo(
    () => sorts.map((s) => ({ property: s.property, order: s.order })),
    [sorts],
  );

  const configsAreApplied = useMemo(
    () => filters.length || sorts.length,
    [sorts, filters],
  );

  const alerts = api.alert.all.useQuery({
    sorts: allSorts,
    // @ts-expect-error The filters typing got quite hairy with all of the different filter options and sourly needs to be refactored.
    filters: allFilters,
  });
  const updateAlert = api.alert.update.useMutation();
  const users = api.user.list.useQuery();
  const currentUser = useUser();

  const update = useCallback(async (id: string, alert: Partial<Alert>) => {
    await updateAlert.mutateAsync({ id, alert });
    await alerts.refetch();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="pt-4">
        {/* Config Settings Bar */}
        <div className="flex items-center justify-between px-10">
          <Search search={search} setSearch={setSearch} />
          <div>
            <AlertListFilterDropdown
              filterOptions={[
                StatusFilterConfig,
                AssignedToFilterConfig(users.data?.users),
              ]}
              onFilter={(f: FilterSetting) => setFilters((pf) => [...pf, f])}
            />
            <AlertListSortDropdown
              sorts={[
                { label: 'Title', value: 'title', Icon: <TbLetterCase /> },
                {
                  label: 'Assigned To',
                  value: 'assignedToId',
                  Icon: <RxAvatar />,
                },
                { label: 'Status', value: 'status', Icon: <GrStatusGood /> },
                {
                  label: 'Created Time',
                  value: 'createdAt',
                  Icon: <TbClock />,
                },
              ]}
              onSort={(sort) => setSorts((s) => [...s, sort])}
            />
            <AlertListDisplayDropdown
              display={display}
              setDisplay={setDisplay}
            />
          </div>
        </div>

        {/* Config Sub-bar */}
        {configsAreApplied ? (
          <div className="mt-4 flex border-b-[1px] border-t-[1px] border-zinc-200 px-10 py-3">
            {sorts?.map((s) => (
              <div className="mr-2" key={s.property}>
                <AlertListSortPill
                  onFlipOrder={() =>
                    setSorts((srts) =>
                      [...srts].map((sort) =>
                        sort === s
                          ? {
                              ...sort,
                              order: sort.order === 'desc' ? 'asc' : 'desc',
                            }
                          : sort,
                      ),
                    )
                  }
                  onRemove={() =>
                    setSorts((srts) => [...srts].filter((sort) => sort !== s))
                  }
                  Icon={s.Icon}
                  label={s.label}
                  order={s.order}
                />
              </div>
            ))}
            {filters?.map((f, i) => (
              <div className="mr-2" key={i}>
                <AlertListFilterPill
                  label={f.label}
                  Icon={f.Icon}
                  condition={f.condition}
                  value={f.value}
                  conditionOptions={f.conditionOptions}
                  valueOptions={f.valueOptions}
                  onRemove={() =>
                    setFilters((flts) => [...flts].filter((rf) => rf !== f))
                  }
                  onChangeValue={(value) =>
                    setFilters((fts) =>
                      [...fts].map((filter) =>
                        filter === f ? { ...filter, value } : filter,
                      ),
                    )
                  }
                  onChangeCondition={(condition) =>
                    setFilters((fts) =>
                      [...fts].map((filter) =>
                        filter === f ? { ...filter, condition } : filter,
                      ),
                    )
                  }
                />
              </div>
            ))}
            <div className="flex items-center">
              <MdOutlineClose
                className="h-[15px] w-[15px] cursor-pointer rounded-full p-0.5 text-slate-400 ring-1 ring-slate-400 transition-colors hover:bg-slate-400 hover:text-white"
                onClick={() => {
                  setFilters([]);
                  setSorts([]);
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Alerts List */}
      <div className="h-screen overflow-y-auto">
        <div
          className={classNames({
            'px-10': display.cardType === 'expanded',
            'mt-4': !configsAreApplied,
            'border-t-[1px]':
              !configsAreApplied && display.cardType === 'condensed',
          })}
        >
          <Loader
            className="mt-5 px-10"
            status={{ loading: alerts.isFetching }}
          >
            {alerts.data?.map((a: Alert) => {
              const user = users.data?.users.find(
                (u) => u.id === a.assignedToId,
              );

              return (
                <AlertsListItem
                  key={a.id}
                  cardType={display.cardType}
                  alert={a}
                  user={user}
                  onAck={() => update(a.id, { status: 'ACKED' })}
                  onClose={() => update(a.id, { status: 'CLOSED' })}
                  onSelfAssign={() =>
                    update(a.id, { assignedToId: currentUser?.id })
                  }
                  onReopen={() => update(a.id, { status: 'OPEN' })}
                />
              );
            })}
          </Loader>
        </div>
      </div>
    </div>
  );
};

export default AlertsList;
