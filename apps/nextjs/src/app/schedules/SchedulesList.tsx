import { api } from '../../utils/api';
import Loader from '../_components/Loader';
import ScheduleListCard from './ScheduleListCard';

const ScheduleList = () => {
  const schedules = api.schedule.list.useQuery();

  return (
    <Loader className="h-full" status={{ loading: schedules.isLoading }}>
      <div className="px-10">
        {schedules.data?.schedules?.map((schedule) => (
          <ScheduleListCard key={schedule.id} {...schedule} />
        ))}
      </div>
    </Loader>
  );
};

export default ScheduleList;
