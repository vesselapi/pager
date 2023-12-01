import { useMemo, useState } from 'react';
import { TbPlus } from 'react-icons/tb';
import type { RouterOutputs } from '~/utils/api';
import { api } from '~/utils/api';
import Modal from '../_components/Modal';
import Search from '../_components/Search';
import Spinner from '../_components/Spinner';

const TeamItem = ({
  team,
}: {
  team: RouterOutputs['team']['list']['teams']['0'];
}) => {
  return <div></div>;
};

const TeamsList = () => {
  // NOTE(@zkirby): We might want to consider making this an
  // API query param, but for now we'll assume there are few enough
  // teams that we can just fetch them all and search them client-side.
  // This is also why we're not using the debounced version of search
  const [search, setSearch] = useState('');
  const apiTeams = api.team.list.useQuery();

  const teams = useMemo(() => {
    if (!apiTeams?.data?.teams) return [];

    return apiTeams.data.teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [apiTeams?.data?.teams, search]);

  return (
    <div>
      <div className="pt-4 px-10 flex items-center justify-between">
        <Search search={search} setSearch={setSearch} />
        <Modal />
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
      <div>
        {apiTeams.isFetching ? (
          <Spinner className="mt-5 px-10" />
        ) : (
          teams.map((team) => <TeamItem key={team.id} team={team} />)
        )}
      </div>
    </div>
  );
};

export default TeamsList;
