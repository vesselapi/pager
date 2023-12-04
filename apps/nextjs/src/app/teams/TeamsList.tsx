import { useMemo, useState } from 'react';
import { TbCheck, TbPlus } from 'react-icons/tb';
import type { RouterOutputs } from '~/utils/api';
import { api } from '~/utils/api';
import { useUser } from '../../hooks/useUser';
import Button from '../_components/Button';
import Loader from '../_components/Loader';
import Modal from '../_components/Modal';
import Search from '../_components/Search';
import TeamListAddTeamForm from './TeamListAddTeamForm';

/**
 * TODO(@zkirby): When the teams return the list of users
 * implement the "joined" and the "Members" section.
 */
const TeamItem = ({
  team,
  user,
}: {
  team: RouterOutputs['team']['list']['teams']['0'];
  user: RouterOutputs['user']['me']['user'];
}) => {
  const userJoined = useMemo(() => {
    return team.users.some((u) => u.id === user.id);
  }, [team.users, user]);

  return (
    <div className="flex justify-between text-zinc-600 items-center border-b-[1px] border-zinc-200 px-10 py-3 hover:bg-zinc-200 cursor-pointer">
      <div className="flex items-center">
        <div>{team.name}</div>
        {userJoined ? (
          <div className="text-smr rounded ml-3 text-zinc-400 bg-gray-200 flex items-center px-1">
            <TbCheck />
            Joined
          </div>
        ) : null}
      </div>
      {/* Placeholder user profiles */}
      <div className="flex">
        {team.users.map((u) => {
          return (
            <div
              key={u.id}
              className="ring rounded-full text-center ring-white h-[20px] w-[20px] bg-zinc-600 text-white text-smr"
            >{`${u.firstName[0]}${u.lastName[0]}`}</div>
          );
        })}
      </div>
    </div>
  );
};

const TeamsList = () => {
  const listTeams = api.team.list.useQuery();
  const createTeam = api.team.create.useMutation();
  const user = useUser();

  // NOTE(@zkirby): We might want to consider making this an
  // API query param, but for now we'll assume there are few enough
  // teams that we can just fetch them all and search them client-side.
  // This is also why we're not using the debounced version of search
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const teams = useMemo(() => {
    if (!listTeams?.data?.teams) return [];

    return listTeams.data.teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [listTeams?.data?.teams, search]);

  // TODO: replace w/ implementation
  const onSubmit = async ({ name }: { name: string }) => {
    setIsOpen(false);
    await createTeam.mutateAsync({ team: { name } });
    await listTeams.refetch();
  };

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
      <Loader
        className={'px-10 mt-5'}
        status={{ loading: listTeams.isFetching || !user }}
      >
        {teams.map((team) => (
          <TeamItem key={team.id} team={team} user={user!} />
        ))}
      </Loader>
    </div>
  );
};

export default TeamsList;
