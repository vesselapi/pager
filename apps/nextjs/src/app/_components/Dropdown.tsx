import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import type { ReactElement } from 'react';
import React, { Fragment } from 'react';

const Dropdown = ({
  children,
  OpenButton,
  openButtonClass,
  position = 'left',
  size = 'md',
  noHighlight = false,
}: React.PropsWithChildren<{
  OpenButton: ReactElement;
  openButtonClass?: string;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  noHighlight?: boolean;
}>) => {
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button className={openButtonClass}>{OpenButton}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-25"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-25"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            {
              'right-0': position === 'left',
              'left-0': position === 'right',
              'w-[85px]': size === 'sm',
              'w-[170px]': size === 'md',
            },
            'text-xs absolute z-10 mt-1.5 origin-top-right rounded-md border-[1px] border-zinc-200 border-opacity-20 bg-white text-zinc-600 shadow focus:outline-none',
          )}
        >
          {React.Children.map(children, (child) => (
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    !noHighlight && active ? 'bg-gray-200' : '',
                    'm-1 flex h-[28px] items-center rounded px-2',
                  )}
                >
                  {child}
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
