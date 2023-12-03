import { api } from '../../utils/api';
import ScheduleListCard from './ScheduleListCard';

const ScheduleList = () => {
  const schedules = api.schedule.list.useQuery();

  return (
    <div className="px-10">
      <ScheduleListCard />
    </div>
  );
};

export default ScheduleList;
