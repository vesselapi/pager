import type { ReactNode } from 'react';
import React from 'react';

const Pill = ({ children }: { children: ReactNode }) => {
  const childArray = React.Children.toArray(children);
  const tLength = childArray.length - 1;

  return (
    <div className="flex text-smr">
      {childArray.map((child, index: number) => (
        <div
          key={index}
          className={`flex items-center border bg-zinc-200 border-white text-zinc-600 px-2 ${index === 0 ? 'rounded-l' : ''
            } ${index === tLength ? 'rounded-r' : ''} ${index !== tLength ? 'border-r-0' : ''
            }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default Pill;
