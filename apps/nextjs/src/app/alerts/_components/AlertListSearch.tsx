import { TbSearch } from 'react-icons/tb';

const AlertListSearch = ({
  search,
  setSearch,
}: {
  search?: string;
  setSearch: (s: string) => void;
}) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 font-bold text-zinc-400">
        <TbSearch />
      </div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value as string)}
        className="text-smr w-[350px] rounded bg-gray-200 py-1.5 pl-8  pr-2 outline-none"
        placeholder="Search..."
      />
    </div>
  );
};

export default AlertListSearch;
