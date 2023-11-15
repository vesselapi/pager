import Link from 'next/link';
import { TbBell, TbCalendarFilled } from 'react-icons/tb';

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
      className="ml-2 mt-2 flex cursor-pointer items-center px-2 hover:bg-gray-200"
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
      <div className="relative left-0 top-0 h-screen w-[220px] bg-gray-300 text-black">
        <div className="flex items-center justify-between p-3">
          <div>Vessel</div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            ZK
          </div>
        </div>
        <NavItem route="alerts" title="Alerts" Icon={TbBell} />
        <NavItem route="schedule" title="Schedule" Icon={TbCalendarFilled} />
      </div>
      <div className="h-screen w-screen">{children}</div>
    </div>
  );
};

export default SideNav;
