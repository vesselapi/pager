'use client';

import { useState } from 'react';

import { api } from '~/utils/api';
import type { RouterInputs } from '~/utils/api';
import AlertListDisplayDropdown from './_components/AlertListDisplayDropdown';
import AlertListFilterDropdown, {
  AlertListFilterPill,
} from './_components/AlertListFilterDropdown';
import AlertListSortDropdown, {
  AlertListSortPill,
} from './_components/AlertListSortDropdown';
import AlertsListItem from './AlertListItem';

interface DisplaySettings {
  // How the alerts should be styled
  style: 'condensed' | 'regular';
}
type SortSettings = RouterInputs['alert']['all']['sorts'];
type FilterSettings = RouterInputs['alert']['all']['filters'];

const AlertsList = () => {
  const [display, setDisplay] = useState<DisplaySettings>({
    style: 'regular',
  });
  const [sorts, setSorts] = useState<SortSettings>([]);
  const [filters, setFilters] = useState<FilterSettings>([]);
  const [search, setSearch] = useState<string | null>(null);
  const debouncedSearch = useDebounce<string>(search, 500)


  const alerts = api.alert.all.useQuery({
    sorts,
    filters: [...filters, ...(search ? [{ property: 'title', value: debouncedSearch, condition: "CONTAINS" }] : [])],
  });
  const users = api.user.all.useQuery();

  return (
    <div className="flex flex-col">
      <div className="px-10 pt-4">
        <div className="flex items-center justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value) }
            className="w-[300px] rounded border border-gray-300 px-2 py-1"
            type="text"
            placeholder="Search"
          />
          <div>
            <AlertListFilterDropdown
              filters={[
                {
                  property: 'Status',
                  options: [
                    { label: 'Acked', value: 'ACKED' },
                    { label: 'Open', value: 'OPEN' },
                    { label: 'Closed', value: 'CLOSED' },
                  ],
                  condition: 'IS',
                },
                {
                  property: 'AssignedTo',
                  options:
                    users.data?.map((u) => ({
                      label: u.email ?? u.id,
                      value: u.id,
                    })) ?? [],
                  condition: 'IS',
                },
              ]}
              onFilter={(f: {
                property: string;
                value: string[];
                condition: string;
              }) => {
                setFilters((pf) => [...pf!, f] as FilterSettings);
              }}
            />
            <AlertListSortDropdown
              sorts={[
                { label: 'Title', value: 'title' },
                { label: 'Assigned To', value: 'assignedToId' },
                { label: 'Status', value: 'status' },
                { label: 'Created Time', value: 'createdAt' },
              ]}
              onSort={(sort: string) =>
                setSorts((s) => [...s!, { property: sort }] as SortSettings)
              }
            />
            <AlertListDisplayDropdown
              display={display}
              setDisplay={setDisplay}
            />
          </div>
        </div>

        {/* The Sub-title bar is used to show the views active state like what the display is and what filters are applied */}
        <div className="mt-2 flex">
          {sorts?.map((s) => (
            <div className="mr-2" key={s.property}>
              <AlertListSortPill onFlipOrder={() =>
                setSorts(srts => {
                  return [...srts].map((sort) => {
                    if (sort === s) {
                      return { ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' };
                    }
                    return sort;
                  });
                })
              }
                onRemove={() => setSorts(srts => {
                  return [...srts].filter(sort => sort === s)
                })}
                title={s.property} order={s.order} />
            </div>
          ))}
          {filters?.map((f) => (
            <div className="mr-2" key={f.property}>
              <AlertListFilterPill
                property={f.property}
                condition={f.condition}
                value={f.value}
              />
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Change out for virtualized scroll */}
      <div className="h-screen overflow-y-auto">
        <div className="px-10 pt-4">
          {alerts.data?.map((a) => {
            return (
              <div className="mt-5" key={a.id}>
                <AlertsListItem style={display.style} alert={a} />
              </div>
            );
          })}
          <div className="mt-52"></div>
        </div>
      </div>
    </div>
  );
};

export default AlertsList;
