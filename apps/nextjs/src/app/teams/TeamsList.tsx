import { useMemo, useState } from 'react';
import { TbCheck, TbPlus } from 'react-icons/tb';
import type { RouterOutputs } from '~/utils/api';
import Button from '../_components/Button';
import Modal from '../_components/Modal';
import Search from '../_components/Search';
import Spinner from '../_components/Spinner';
import TeamListAddTeamForm from './TeamListAddTeamForm';

const TeamItem = ({
  team,
}: {
  team: RouterOutputs['team']['list']['teams']['0'];
}) => {
  return (
    <div className="flex justify-between text-zinc-600 items-center border-b-[1px] border-zinc-200 px-10 py-3 hover:bg-zinc-200 cursor-pointer">
      <div className="flex items-center">
        <div>{team.name}</div>
        <div className="text-smr rounded ml-3 text-zinc-400 bg-gray-200 flex items-center px-1">
          <TbCheck />
          Joined
        </div>
      </div>
      <div className="flex">
        <div className="ring rounded-full ring-white h-[20px] w-[20px] bg-zinc-600"></div>
        <div className="ring rounded-full ring-white h-[20px] w-[20px] bg-zinc-600"></div>
        <div className="ring rounded-full ring-white h-[20px] w-[20px] bg-zinc-600"></div>
        <div className="ring rounded-full ring-white h-[20px] w-[20px] bg-zinc-600"></div>
      </div>
    </div>
  );
};

const TeamsList = () => {
  const apiTeams = {
    isFetching: false,
    data: {
      teams: [
        {
          id: 'team-eng-be',
          name: 'Backend Eng',
        },
      ],
    },
  };

  // NOTE(@zkirby): We might want to consider making this an
  // API query param, but for now we'll assume there are few enough
  // teams that we can just fetch them all and search them client-side.
  // This is also why we're not using the debounced version of search
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const teams = useMemo(() => {
    if (!apiTeams?.data?.teams) return [];

    return apiTeams.data.teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [apiTeams?.data?.teams, search]);

  // TODO: replace w/ implementation
  const onSubmit = ({ name }: { name: string }) => console.log(name);

  return (
    <div>
      <Modal
        title="Create a team"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="mt-4">
          <TeamListAddTeamForm
            onClose={() => setIsOpen(false)}
            onSubmit={onSubmit}
          />
        </div>
      </Modal>

      {/* Controls */}
      <div className="pt-4 px-10 flex items-center justify-between">
        <Search search={search} setSearch={setSearch} />
        <Button
          onClick={() => setIsOpen(true)}
          className="mr-1.5 flex items-center"
        >
          <TbPlus className="mr-1.5" />
          Add team
        </Button>
      </div>

      {/* Headers */}
      <div className="mt-4 flex justify-between border-b-[1px] border-t-[1px] border-zinc-200 px-10 py-3 text-slate-400">
        <div>Name</div>
        <div>Members</div>
      </div>

      {/* Teams List */}
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
