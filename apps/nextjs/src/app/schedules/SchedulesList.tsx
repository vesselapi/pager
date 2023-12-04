import { useMemo } from 'react';
import { api } from '../../utils/api';
import Loader from '../_components/Loader';
import ScheduleListCard from './ScheduleListCard';

const ScheduleList = () => {
  const schedules = api.schedule.list.useQuery();
  // TODO(@zkirby): This is done for demo purposes only,
  // when the BE relations are cleaned up, this information should be
  // on the schedules themselves, and there should be no need
  // for the FE to combine this.
  const scheduleUsers = api.scheduleUser.list.useQuery();
  const users = api.user.list.useQuery();

  const schedulesWithUsers = useMemo(
    () =>
      schedules.data?.schedules?.map((schedule) => {
        const fullUsers = scheduleUsers.data?.users
          ?.filter((su) => su.scheduleId === schedule.id)
          .map((su) => ({
            ...su,
            ...users.data?.find((u) => u.id === su.userId),
          }));

        console.log(fullUsers);

        return { ...schedule, users: fullUsers };
      }),
    [schedules.data, scheduleUsers.data, users.data],
  );

  return (
    <div className="px-10">
      <Loader
        className="mt-5"
        status={{
          loading:
            schedules.isFetching ||
            users.isFetching ||
            scheduleUsers.isFetching,
        }}
      >
        {schedulesWithUsers?.map((schedule) => (
          <ScheduleListCard key={schedule.id} {...schedule} />
        ))}
      </Loader>
    </div>
  );
};

export default ScheduleList;
