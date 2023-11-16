import Link from 'next/link';
import { TbBell, TbCalendarFilled } from 'react-icons/tb';

import Dropdown from './Dropdown';
import UserIcon from './UserIcon';

const NavItem = ({
  title,
  route,
  Icon,
}: {
  title: string;
  route: string;
  Icon: typeof TbBell;
}) => {
  return (
    <Link
      href={route}
      className="ml-2 mt-2 flex cursor-pointer items-center px-2 py-1 hover:bg-gray-200"
    >
      <Icon className="mr-1" />
      {title}
    </Link>
  );
};

/**
 * Sidebar navigation
 *
 * TODO:
 *  - Make icon red if there are alerts
 *  - Add "my alerts", "all alerts" sub-nav
 *  - Add keyboard shortcuts
 */
const SideNav = ({ children }) => {
  return (
    <div className="flex text-sm">
      <div className="relative left-0 top-0 flex h-screen w-[220px] flex-col justify-between bg-gray-300 text-black">
        <div>
          <div className="flex items-center justify-between p-3">
            <div>Vessel</div>
            {/* <Dropdown position="right" items={[]}> */}
            <UserIcon />
            {/* </Dropdown> */}
          </div>
          <NavItem route="alerts" title="Alerts" Icon={TbBell} />
          <NavItem route="schedule" title="Schedule" Icon={TbCalendarFilled} />
        </div>
        <div className="flex w-full justify-between p-4 px-4">
          <div>Docs</div> | <div>Slack</div> | <div>Contact</div>
        </div>
      </div>
      <div className="h-screen w-screen">{children}</div>
    </div>
  );
};

export default SideNav;
