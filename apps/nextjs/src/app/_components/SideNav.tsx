import { TbBell, TbCalendarFilled } from 'react-icons/tb';

const NavItem = ({ title, Icon }) => {
  return (
    <div className="ml-4 mt-2 flex cursor-pointer items-center">
      <Icon className="mr-1" />
      {title}
    </div>
  );
};

/**
 * Sidebar navigation
 *
 * TODO:
 *  - Make icon red if there are alerts
 *  - Add "my alerts", "all alerts" sub-nav
 */
const SideNav = ({ children }) => {
  return (
    <div className="flex">
      <div className="relative left-0 top-0 h-screen w-[220px] bg-gray-300 text-black">
        <div className="flex justify-between p-3">
          <div>Vessel</div>
          <div>zk</div>
        </div>
        <NavItem title="Alerts" Icon={TbBell} />
        <div className="ml-4 mt-4 flex cursor-pointer items-center">
          <TbCalendarFilled className="mr-1" />
          Schedule
        </div>
      </div>
      <div className="h-screen w-screen">{children}</div>
    </div>
  );
};

export default SideNav;
