'use client';

import { SignOutButton } from '@clerk/nextjs';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { FaGithub, FaSlack } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { TbBell, TbBook2, TbCalendarFilled } from 'react-icons/tb';

import Dropdown from './Dropdown';
import UserIcon from './UserIcon';

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
      className={classNames(
        'mt-1 flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-200',
        { 'bg-gray-200': activeRoute === route },
      )}
    >
      <Icon className="mr-1.5 font-bold text-zinc-600" />
      <div className="text-smr">{title}</div>
    </Link>
  );
};

/**
 * Sidebar navigation
 */
const SideNav = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex text-sm">
      <div className="bg-light-grey relative left-0 top-0 flex h-screen w-[220px] flex-col justify-between border-r-[1px] border-zinc-200 px-3 text-black">
        <div>
          <div className="flex items-center justify-between px-2 py-3">
            <div className="text-smr flex">
              <Image
                src="/vessel-icon.svg"
                width={18}
                height={18}
                alt="My SVG"
                className="mr-1.5 rounded-[4px]"
              />
              Vessel
            </div>
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
              {/* @ts-expect-error Signout Button props are broken, it definitely accepts a className... */}
              <SignOutButton className={'w-full text-left text-red-400'} />
            </Dropdown>
          </div>
          <div className="mt-2">
            <NavItem
              route="/alerts"
              title="Alerts"
              Icon={TbBell}
              activeRoute={pathname}
            />
            <NavItem
              route="/schedule"
              title="Schedule"
              Icon={TbCalendarFilled}
              activeRoute={pathname}
            />
          </div>
        </div>
        <div className="text-smr m-3 grid grid-cols-2 opacity-40">
          <div className="flex cursor-pointer items-center">
            <FaSlack className="mr-1" />
            Slack
          </div>
          <div className="flex cursor-pointer items-center ">
            <HiOutlineMail className="mr-1" />
            Contact
          </div>
          <div className="mt-1 flex cursor-pointer items-center">
            <TbBook2 className="mr-1" />
            Docs
          </div>
          <div className="mt-1 flex cursor-pointer items-center">
            <FaGithub className="mr-1" />
            GitHub
          </div>
        </div>
      </div>
      <div
        className={classNames('h-screen w-screen transition-colors', {
          dark: false,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default SideNav;
