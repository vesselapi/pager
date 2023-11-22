'use client'

import type { ReactNode } from 'react';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { TbBell, TbBook2, TbCalendarFilled } from 'react-icons/tb';
import { FaGithub, FaSlack } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'


import Dropdown from './Dropdown';
import UserIcon from './UserIcon';
import Image from 'next/image';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

const NavItem = ({
  title,
  activeRoute,
  route,
  Icon,
}: {
  title: string;
  activeRoute: string;
  route: string;
  Icon: typeof TbBell;
}) => {
  return (
    <Link
      href={route}
      className={classNames("mt-1 flex cursor-pointer items-center px-2 py-1 hover:bg-gray-200 rounded", { 'bg-gray-200': activeRoute === route })}
    >
      <Icon className="mr-1.5 font-bold text-zinc-600" />
      <div className='text-smr'>{title}</div>
    </Link>
  );
};

/**
 * Sidebar navigation
 */
const SideNav = ({ children }: { children: ReactNode }) => {
  // TODO(@zkirby): Enable darkmode
  // const [darkMode, setDarkMode] = useState(false)

  const pathname = usePathname();

  return (
    <div className="flex text-sm">
      <div className="relative left-0 top-0 flex h-screen w-[220px] flex-col justify-between bg-light-grey text-black px-3 border-r-[1px] border-zinc-200">
        <div>
          <div className="flex items-center justify-between px-2 py-3">
            <div className='flex text-smr'><Image src="/vessel-icon.svg" width={18} height={18} alt="My SVG" className='rounded-[4px] mr-1.5' />Vessel</div>
            <Dropdown position="right" OpenButton={<UserIcon />}>
              {/* TODO(@zkirby): Enable dark mode */}
              {/* <Switch
                checked={darkMode}
                onChange={setDarkMode}
                className={`${darkMode ? 'bg-black' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Dark Mode</span>
                <span
                  className={`${darkMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch> */}
              <SignOutButton className={"text-left w-full text-red-400"} />
            </Dropdown>
          </div>
          <div className='mt-2'>
            <NavItem route="/alerts" title="Alerts" Icon={TbBell} activeRoute={pathname} />
            <NavItem route="/schedule" title="Schedule" Icon={TbCalendarFilled} activeRoute={pathname} />
          </div>
        </div>
        <div className={`grid grid-cols-2 m-3 text-smr opacity-40`}>
          <div className='flex items-center cursor-pointer'><FaSlack className="mr-1" />Slack</div>
          <div className='flex items-center cursor-pointer '><HiOutlineMail className="mr-1" />Contact</div>
          <div className='flex items-center cursor-pointer mt-1'><TbBook2 className="mr-1" />Docs</div>
          <div className='flex items-center cursor-pointer mt-1'><FaGithub className="mr-1" />GitHub</div>
        </div>
      </div>
      <div className={classNames("h-screen w-screen transition-colors", { dark: false })}>{children}</div>
    </div>
  );
};

export default SideNav;
