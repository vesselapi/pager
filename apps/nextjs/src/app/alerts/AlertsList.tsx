'use client';

import { useMemo, useState } from 'react';

import { api } from '~/utils/api';
import type { RouterInputs } from '~/utils/api';
import { useDebounce } from '../../hooks/useDebounce';
import AlertListDisplayDropdown from './_components/AlertListDisplayDropdown';
import AlertListFilterDropdown, {
  AlertListFilterPill,
} from './_components/AlertListFilterDropdown';
import AlertListSortDropdown, {
  AlertListSortPill,
} from './_components/AlertListSortDropdown';
import AlertsListItem from './AlertListItem';
import { TbClock, TbLetterCase, TbMoodEmpty, TbMoodHappy, TbMoodSad, TbSearch } from 'react-icons/tb';
import { GrStatusGood } from 'react-icons/gr'
import { RxAvatar } from "react-icons/rx";
import Spinner from '../_components/Spinner';


interface DisplaySettings {
  // How the alerts should be styled
  style: 'condensed' | 'expanded';
}

type ExtractInnerType<T> = T extends (infer U)[] ? U : never;
type SortSettings = ExtractInnerType<RouterInputs['alert']['all']['sorts']> & {
  id: string;
  label: string;
};
type FilterSettings = ExtractInnerType<
  RouterInputs['alert']['all']['filters']
> & {
  id: string;
  conditionOptions?: string[];
  valueOptions?: string[];
};

const AlertsList = () => {
  const [display, setDisplay] = useState<DisplaySettings>({
    style: 'expanded',
  });
  const [sorts, setSorts] = useState<SortSettings[]>([]);
  const [filters, setFilters] = useState<FilterSettings[]>([]);
  const [search, setSearch] = useState<string>();
  const debouncedSearch = useDebounce<string | undefined>(search, 200);

  const allFilters = useMemo(() => {
    const searchFilter = [
      { property: 'title', value: debouncedSearch, condition: 'CONTAINS' },
    ];
    const otherFilters = filters?.map((f) => ({
      property: f.property,
      value: f.value,
      condition: f.condition,
    }));
    return [...(otherFilters ?? []), ...(debouncedSearch ? searchFilter : [])];
  }, [filters, debouncedSearch]);

  const allSorts = useMemo(() => {
    return sorts.map(s => ({ property: s.property, order: s.order }))
  }, [sorts])

  const alerts = api.alert.all.useQuery({
    sorts: allSorts,
    filters: allFilters,
  });
  const users = api.user.all.useQuery();

  return (
    <div className="flex flex-col">
      <div className="px-10 pt-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none font-bold text-zinc-400">
              <TbSearch />
            </div>
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-[350px] outline-none pl-8 pr-2 py-1.5 text-smr  bg-gray-200 rounded" placeholder="Search..." />
          </div>

          <div>
            <AlertListFilterDropdown
              filterOptions={[
                {
                  property: 'status',
                  label: 'Status',
                  options: [
                    { label: 'Acked', value: 'ACKED', Icon: <TbMoodEmpty className="text-yellow-600" /> },
                    { label: 'Open', value: 'OPEN', Icon: <TbMoodSad className="text-red-600" /> },
                    { label: 'Closed', value: 'CLOSED', Icon: <TbMoodHappy className="text-green-600" /> },
                  ],
                  conditions: ['IS', 'IS_NOT'],
                  Icon: <GrStatusGood />
                },
                {
                  property: 'assignedToId',
                  label: 'Assigned To',
                  options:
                    users.data?.map((u) => ({
                      label: u.email ?? u.id,
                      value: u.id,
                      Icon: <></>
                    })) ?? [],
                  conditions: ['IS', 'IS_NOT'],
                  Icon: <RxAvatar />
                },
              ]}
              onFilter={(f: {
                property: string;
                value: string[];
                condition: string;
              }) => setFilters((pf) => [...pf, f] as FilterSettings)}
            />
            <AlertListSortDropdown
              sorts={[
                { label: 'Title', value: 'title', Icon: <TbLetterCase /> },
                { label: 'Assigned To', value: 'assignedToId', Icon: <RxAvatar /> },
                { label: 'Status', value: 'status', Icon: <GrStatusGood /> },
                { label: 'Created Time', value: 'createdAt', Icon: <TbClock /> },
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
        <div className="flex mt-2">
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
                label={s.label}
                order={s.order}
              />
            </div>
          ))}
          {filters?.map((f) => (
            <div className="mr-2" key={f.property}>
              <AlertListFilterPill
                property={f.property}
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
        </div>
      </div>

      {/* TODO: Change out for virtualized scroll */}
      <div className="h-screen overflow-y-auto">
        <div className="px-10 pt-2">
          {alerts.isLoading ?
            <Spinner />
            : alerts.data?.map((a) => <AlertsListItem className="mt-5" key={a.id} style={display.style} title={a.title} status={a.status} />)
          }
          <div className="mt-52"></div>
        </div>
      </div>
    </div>
  );
};

export default AlertsList;
