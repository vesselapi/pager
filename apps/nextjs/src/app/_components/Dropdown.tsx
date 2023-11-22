'use client';

import type { ReactElement, ReactNode } from 'react';
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

const Dropdown = ({
  children,
  OpenButton,
  position = 'left',
  size = 'md',
  noHighlight = false,
}: {
  children: ReactElement | ReactNode[];
  OpenButton: ReactElement;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  noHighlight?: boolean;
}) => {
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button>{OpenButton}</Menu.Button>

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
            'absolute z-10 mt-1.5 origin-top-right rounded-md bg-white text-smr text-zinc-600 shadow border-zinc-200 border-[1px] border-opacity-20 focus:outline-none',
          )}
        >
          {React.Children.map(children, (child) => (
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    !noHighlight && active
                      ? 'bg-gray-200'
                      : '',
                    'h-[28px] m-1 rounded flex items-center px-2',
                  )}
                >
                  {child}
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu >
  );
};

export default Dropdown;
