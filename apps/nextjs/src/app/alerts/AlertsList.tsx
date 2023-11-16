'use client';

import { useState } from 'react';
import { MdFilterList, MdOutlineClose } from 'react-icons/md';
import { VscSettings } from 'react-icons/vsc';

import Dropdown from '../_components/Dropdown';
import AlertsListItem from './AlertListItem';

const FilterPill = ({ title }: { title: string }) => {
  return (
    <div className="flex w-fit items-center">
      <h3 className="h-[34px] rounded-l-md border border-gray-300 p-2 text-xs text-gray-500 shadow">
        status
      </h3>
      <h3 className="h-[34px] border border-l-0 border-gray-300 p-2 text-xs text-gray-500 shadow">
        is not
      </h3>
      <h3 className="h-[34px] border border-l-0 border-gray-300 p-2 text-xs text-gray-500 shadow">
        {title}
      </h3>
      <div className="flex h-[34px] items-center justify-center rounded-r-md border border-l-0 border-gray-300 px-2 text-gray-500 shadow">
        <MdOutlineClose />
      </div>
    </div>
  );
};

const AlertsList = () => {
  // TODO: retrieve alerts and users
  const alerts = [
    {
      id: 1,
      title: 'alert 1',
      assignedToId: 3,
      status: 'open',
      createdAt: 'alert 2',
    },
    {
      id: 2,
      title: 'alert 2',
      assignedToId: 2,
      status: 'closed',
      createdAt: 'alert 3',
    },
    {
      id: 3,
      title: 'alert 3',
      assignedToId: 3,
      status: 'open',
      createdAt: 'alert 4',
    },
    {
      id: 4,
      title: 'alert 4',
      assignedToId: 2,
      status: 'acked',
      createdAt: 'alert 5',
    },
    {
      id: 5,
      title: 'alert 5',
      assignedToId: 3,
      status: 'closed',
      createdAt: 'alert 6',
    },
  ];

  const users = [
    {
      id: 3,
      initials: 'zk',
    },
    {
      id: 2,
      initials: 'ay',
    },
  ];

  const appliedFilters = [];

  const [options, setOptions] = useState([
    {
      name: 'status',
      comparitors: ['eq', 'dne'],
      options: [{ name: 'acked' }, { name: 'open' }],
    },
  ]);

  return (
    <div className="flex flex-col">
      <div className="px-10 pt-4">
        <div className="flex items-center justify-between">
          <input
            className="w-[300px] rounded border border-gray-300 px-2 py-1"
            type="text"
            placeholder="Search"
          />
          <div className="flex">
            <Dropdown
              items={options.map((f) => {
                return {
                  key: f.name,
                  Component: () => {
                    return (
                      <button
                        onClick={() => {
                          console.log('clicked!!');
                          setOptions(f.options);
                        }}
                      >
                        {f.name}
                      </button>
                    );
                  },
                };
              })}
            >
              <div className="mr-1 flex items-center rounded bg-gray-200 px-2 py-1">
                <MdFilterList className="mr-1" />
                Filter
              </div>
            </Dropdown>
            {/* <Dropdown items={['status']}> */}
            <div className="flex items-center rounded bg-gray-200 px-2 py-1">
              <VscSettings className="mr-1" />
              Display
            </div>
            {/* </Dropdown> */}
          </div>
        </div>

        {/* The Sub-title bar is used to show the views active state like what the display is and what filters are applied */}
        {appliedFilters.length ? (
          <div className="mt-2">
            <FilterPill title={'closed'} />
          </div>
        ) : null}
      </div>

      {/* TODO: Change out for virtualized scroll */}
      <div className="h-screen overflow-y-auto">
        <div className="px-10 pt-4">
          {alerts.map((a) => {
            return (
              <div className="mt-5" key={a.id}>
                <AlertsListItem alert={a} />
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
