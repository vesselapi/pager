import { api } from '../../utils/api';
import Loader from '../_components/Loader';
import ScheduleListCard from './ScheduleListCard';

const ScheduleList = () => {
  const schedules = api.schedule.list.useQuery();

  return (
    <div className="px-10">
      <Loader className="mt-5" status={{ loading: schedules.isFetching }}>
        {schedules.data?.schedules?.map((schedule) => (
          <ScheduleListCard
            key={schedule.id}
            teamName={schedule.team.name}
            {...schedule}
          />
        ))}
      </Loader>
    </div>
  );
};

export default ScheduleList;
