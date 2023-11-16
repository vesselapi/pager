'use client';

import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

const Dropdown = ({
  children,
  position = 'left',
  items,
}: {
  children: ReactElement;
  position?: 'left' | 'right';
  items: { key: string; Component: () => any }[];
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>{children}</Menu.Button>
      </div>

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
            position === 'left' ? 'right-0' : 'left-0',
            'absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          )}
        >
          <div className="py-1">
            {items.map((item) => {
              return (
                <Menu.Item key={item.key}>
                  {({ active }) => (
                    <div
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      )}
                    >
                      {item.Component()}
                    </div>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
