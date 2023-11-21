import type { ReactNode } from 'react';
import React from 'react';

const Pill = ({ children }: { children: ReactNode }) => {
  const childArray = React.Children.toArray(children);
  const tLength = childArray.length - 1;

  return (
    <div className="flex">
      {childArray.map((child, index: number) => (
        <div
          key={index}
          className={`flex items-center border px-4 py-2 ${
            index === 0 ? 'rounded-l-lg' : ''
          } ${index === tLength ? 'rounded-r-lg' : ''} ${
            index !== tLength ? 'border-r-0' : ''
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default Pill;
