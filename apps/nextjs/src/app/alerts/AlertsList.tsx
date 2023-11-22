'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import classNames from 'classnames';
import { GrStatusGood } from 'react-icons/gr';
import { MdOutlineClose } from 'react-icons/md';
import { RxAvatar } from 'react-icons/rx';
import {
  TbClock,
  TbLetterCase,
  TbMinus,
  TbPlus,
  TbSearch,
} from 'react-icons/tb';

import { api } from '~/utils/api';
import type { RouterInputs } from '~/utils/api';
import Spinner from '../_components/Spinner';
import { useDebounce } from '../../hooks/useDebounce';
import AlertListDisplayDropdown from './_components/AlertListDisplayDropdown';
import type { SelectedFilter } from './_components/AlertListFilterDropdown';
import AlertListFilterDropdown, {
  AlertListFilterPill,
} from './_components/AlertListFilterDropdown';
import AlertListSortDropdown, {
  AlertListSortPill,
} from './_components/AlertListSortDropdown';
import AlertsListItem from './AlertListItem';
import type { ConfigOption } from './AlertListTypes';

interface DisplaySettings {
  // How the alerts should be styled
  style: 'condensed' | 'expanded';
}

type ExtractInnerType<T> = T extends (infer U)[] ? U : never;
type SortSettings = ExtractInnerType<RouterInputs['alert']['all']['sorts']> & {
  id: string;
  label: string;
  Icon: React.ReactElement;
};
interface FilterSettings {
  property: string;
  label: string;
  value: ConfigOption[];
  condition: ConfigOption;
  valueOptions: ConfigOption[];
  conditionOptions: ConfigOption[];
  Icon: React.ReactElement;
}

const AlertsList = () => {
  const [display, setDisplay] = useState<DisplaySettings>({
    style: 'condensed',
  });
  const [sorts, setSorts] = useState<SortSettings[]>([]);
  // TODO: Add filter for not closed by default.
  const [filters, setFilters] = useState<FilterSettings[]>([]);
  const [search, setSearch] = useState<string>();
  const debouncedSearch = useDebounce<string | undefined>(search, 200);

  const allFilters = useMemo(() => {
    const searchFilter = [
      { property: 'title', value: debouncedSearch, condition: 'CONTAINS' },
    ];
    const otherFilters = filters?.map((f) => ({
      property: f.property,
      value: f.value.map((v) => v.value),
      condition: f.condition.value,
    }));
    return [...(otherFilters ?? []), ...(debouncedSearch ? searchFilter : [])];
  }, [filters, debouncedSearch]);

  const allSorts = useMemo(() => {
    return sorts.map((s) => ({ property: s.property, order: s.order }));
  }, [sorts]);

  const configsAreApplied = useMemo(
    () => filters.length || sorts.length,
    [sorts, filters],
  );

  const alerts = api.alert.all.useQuery({
    sorts: allSorts,
    filters: allFilters,
  });

  const updateAlert = api.alert.update.useMutation();
  // const alerts = { data: [{ title: "Example alert", status: 'ACKED' }, { title: "Example alert", status: 'ACKED' }, { title: "Example alert", status: 'ACKED' }, { title: "Example alert", status: 'ACKED' }], isLoading: false }
  const users = api.user.all.useQuery();
  const currentUser = useAuth();
  // const users = { data: [] }

  const me = useMemo(() => {
    return users.data?.find((u) => u.id === currentUser.userId);
  }, [currentUser, users]);

  return (
    <div className="flex flex-col">
      <div className="pt-4">
        <div className="flex items-center justify-between px-10">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 font-bold text-zinc-400">
              <TbSearch />
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-smr w-[350px] rounded bg-gray-200 py-1.5 pl-8  pr-2 outline-none"
              placeholder="Search..."
            />
          </div>

          <div>
            <AlertListFilterDropdown
              filterOptions={[
                {
                  property: 'status',
                  label: 'Status',
                  valueOptions: [
                    {
                      label: 'Acked',
                      value: 'ACKED',
                      Icon: (
                        <div className="h-[12px] w-[12px] rounded-full bg-blue-400" />
                      ),
                    },
                    {
                      label: 'Open',
                      value: 'OPEN',
                      Icon: (
                        <div className="h-[12px] w-[12px] rounded-full bg-red-400" />
                      ),
                    },
                    {
                      label: 'Closed',
                      value: 'CLOSED',
                      Icon: (
                        <div className="h-[12px] w-[12px] rounded-full bg-green-400" />
                      ),
                    },
                  ],
                  conditionOptions: [
                    { label: 'Is', value: 'IS', Icon: <TbPlus /> },
                    { label: 'Is not', value: 'IS_NOT', Icon: <TbMinus /> },
                  ],
                  Icon: <GrStatusGood />,
                },
                {
                  property: 'assignedToId',
                  label: 'Assigned To',
                  valueOptions:
                    users.data?.map((u) => ({
                      label: u.email ?? u.id,
                      value: u.id,
                      Icon: <></>,
                    })) ?? [],
                  conditionOptions: [
                    { label: 'Is', value: 'IS', Icon: <TbPlus /> },
                    { label: 'Is not', value: 'IS_NOT', Icon: <TbMinus /> },
                  ],
                  Icon: <RxAvatar />,
                },
              ]}
              onFilter={(f: SelectedFilter) =>
                setFilters((pf) => [...pf, f] as FilterSettings)
              }
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
              onSort={(sort: { property: string; label: string }) =>
                setSorts((s) => [...s, sort] as SortSettings)
              }
            />
            <AlertListDisplayDropdown
              display={display}
              setDisplay={setDisplay}
            />
          </div>
        </div>

        {/* The Sub-title bar is used to show the views active state like what the display is and what filters are applied */}
        {configsAreApplied ? (
          <div className="mt-4 flex border-b-[1px] border-t-[1px] border-zinc-200 px-10 py-3">
            {sorts?.map((s) => (
              <div className="mr-2" key={s.property}>
                <AlertListSortPill
                  onFlipOrder={() =>
                    setSorts((srts) => {
                      return [...srts].map((sort) => {
                        if (sort === s) {
                          return {
                            ...sort,
                            order: sort.order === 'desc' ? 'asc' : 'desc',
                          };
                        }
                        return sort;
                      });
                    })
                  }
                  onRemove={() =>
                    setSorts((srts) => {
                      return [...srts].filter((sort) => sort !== s);
                    })
                  }
                  Icon={s.Icon}
                  label={s.label}
                  order={s.order}
                />
              </div>
            ))}
            {filters?.map((f) => (
              <div className="mr-2" key={f.property}>
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
              {/* TODO(@zkirby): Add 'Add filter' button from pills list */}
              {/* <MdOutlineAdd  onClick={} className="text-slate-600 w-[18px] h-[18px] mr-1 ml-1" /> */}
              <MdOutlineClose
                onClick={() => {
                  setFilters([]);
                  setSorts([]);
                }}
                className="h-[15px] w-[15px] cursor-pointer rounded-full p-0.5 text-slate-400 ring-1 ring-slate-400 transition-colors hover:bg-slate-400 hover:text-white"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* TODO(@zkirby): Change out for virtualized scroll */}
      <div className="h-screen overflow-y-auto">
        <div
          className={classNames({
            'px-10': display.style === 'expanded',
            'mt-4': !configsAreApplied,
            'border-t-[1px]':
              !configsAreApplied && display.style === 'condensed',
          })}
        >
          {alerts.isLoading ? (
            <div className="px-10">
              <Spinner />
            </div>
          ) : (
            alerts.data?.map((a) => {
              const user =
                users.data?.find((u) => u.id === a.assignedToId) ?? {};
              return (
                <AlertsListItem
                  key={a.id}
                  style={display.style}
                  createdAt={a.createdAt}
                  title={a.title}
                  status={a.status}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  onAck={() =>
                    updateAlert({ id: a.id, alert: { status: 'ACKED' } })
                  }
                  onClose={() =>
                    updateAlert({ id: a.id, alert: { status: 'CLOSED' } })
                  }
                  onSelfAssign={() =>
                    updateAlert({ id: a.id, alert: { assignedToId: me.id } })
                  }
                  onReopen={() =>
                    updateAlert({ id: a.id, alert: { status: 'OPEN' } })
                  }
                />
              );
            })
          )}
          <div className="mt-52"></div>
        </div>
      </div>
    </div>
  );
};

export default AlertsList;
