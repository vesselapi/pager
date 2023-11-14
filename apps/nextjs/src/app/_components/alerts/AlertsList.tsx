import { MdFilterList } from 'react-icons/md';
import { VscSettings } from 'react-icons/vsc';

import AlertsListItem from './AlertListItem';

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

  return (
    <div className="flex flex-col px-10 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex">
          <input
            className="w-[300px] rounded border border-gray-300 px-2 py-1"
            type="text"
            placeholder="Search"
          />
          <div className="flex items-center rounded bg-gray-200 px-2 py-1">
            <MdFilterList className="mr-1" />
            Filter
          </div>
        </div>
        <div>
          <div className="flex items-center rounded bg-gray-200 px-2 py-1">
            <VscSettings className="mr-1" />
            Display
          </div>
        </div>
      </div>
      <div className="h-screen overflow-y-auto">
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
  );
};

export default AlertsList;
