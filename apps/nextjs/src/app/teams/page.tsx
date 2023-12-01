'use client';
import { useState } from 'react';
import { TbPlus } from 'react-icons/tb';
import Search from '../_components/Search';

const TeamsPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="pt-4 px-10 flex items-center justify-between">
        <Search search={search} setSearch={setSearch} />
        <button
          className={
            'mr-1.5 flex items-center rounded bg-gray-200 px-2 py-1 text-zinc-600'
          }
        >
          <TbPlus className="mr-1.5" />
          Add team
        </button>
      </div>
      {/* Headers for teams list */}
      <div className="mt-4 flex justify-between border-b-[1px] border-t-[1px] border-zinc-200 px-10 py-3 text-slate-400">
        <div>Name</div>
        <div>Members</div>
      </div>
      {/* Teams list goes here */}
      <div className="px-10 mt-2">
        <div className="py-3 flex justify-between cursor-pointer hover:bg-zinc-200">
          <div className="text-slate-900">Team 1</div>
          <div className="flex">
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
          </div>
        </div>
        <div className="py-3 flex justify-between cursor-pointer hover:bg-zinc-200">
          <div className="text-slate-900">Team 2</div>
          <div className="flex">
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
            <div className="h-[20px] w-[20px] bg-gray-300 rounded-full ring ring-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
