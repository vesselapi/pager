import type { RouterOutputs } from '@vessel/api';
import classNames from 'classnames';
import { useMemo } from 'react';
import { TbPhoneFilled } from 'react-icons/tb';
import { WeeklyCalendar, WeeklyEvent } from '../_components/Calendar';
import UserIcon from '../_components/UserIcon';

const TotalScheduleDays = 14;
const ScheduleDaysBeforeToday = 3;

const Rotation = ({ name, isOncall }: { name: string; isOncall: boolean }) => {
  return (
    <div className="flex items-center h-full w-full">
      <div
        className={classNames(
          `rounded mr-1 p-2 w-full bg-gray-300 text-gray-700 text-sm flex items-center justify-center`,
          {
            'opacity-60': !isOncall,
            'opacity-100 font-medium': isOncall,
          },
        )}
      >
        {isOncall && (
          <div className="text-red-400 text-base mr-2">
            <TbPhoneFilled />
          </div>
        )}
        {name}
      </div>
    </div>
  );
};

const ScheduleListCard = ({
  name,
  teamName,
  lengthInSeconds,
  startTime,
  users,
}: {
  name: string;
  teamName: string;
  lengthInSeconds: string;
  startTime: Date;
  users: RouterOutputs['schedule']['list']['schedules']['0']['users'];
}) => {
  const scheduleUsers = useMemo(() => {
    return users.sort((a, b) => a.order - b.order);
  }, [users]);

  /**
   * Since we know how many days before today and how many days total
   * we want to show on the rotation calendar, we can
   * calculate what events we should put.
   */
  const rotationLengthInDays = useMemo(() => {
    return Math.ceil(parseInt(lengthInSeconds) / 86400);
  }, [lengthInSeconds]);

  // TODO: Figure out how to calculate who is actually on-call
  const eventsBeforeToday = useMemo(() => {
    const lastUser = scheduleUsers[scheduleUsers.length - 1]!;

    return [
      {
        name: `${lastUser.firstName} ${lastUser.lastName}`,
        length: ScheduleDaysBeforeToday,
      },
    ];
  }, [scheduleUsers]);

  const eventAfterToday = useMemo(() => {
    const allocatedDays = TotalScheduleDays - ScheduleDaysBeforeToday;
    const numFullRotations = Math.ceil(rotationLengthInDays / allocatedDays);

    const rotations = [
      ...Array.from({ length: numFullRotations }, (_, i) => {
        const user = scheduleUsers[i % scheduleUsers.length]!;
        return {
          name: `${user.firstName} ${user.lastName}`,
          length: rotationLengthInDays,
          isOncall: i === 0,
        };
      }),
    ];

    const remainingDays =
      allocatedDays - numFullRotations * rotationLengthInDays;
    if (remainingDays > 0) {
      const nextUser = scheduleUsers[numFullRotations % scheduleUsers.length]!;
      rotations.push({
        name: `${nextUser.firstName} ${nextUser.lastName}`,
        length: remainingDays,
        isOncall: false,
      });
    }

    return rotations;
  }, [rotationLengthInDays, scheduleUsers]);

  return (
    <div className="h-card-lg px-4 py-4 rounded border-[1px] border-zinc-200 mt-5">
      <div className="flex items-center justify-between mb-5">
        <div className="text-zinc-600 text-sm">
          <div className="text-xs text-zinc-400">{teamName}</div>
          {name}
        </div>
        <div className="flex">
          {scheduleUsers.map((u) => (
            <UserIcon key={u.id} className={`-ml-0.5`} {...u} />
          ))}
        </div>
      </div>

      <WeeklyCalendar
        totalDays={TotalScheduleDays}
        daysBeforeToday={ScheduleDaysBeforeToday}
      >
        {/* Events before today */}
        {eventsBeforeToday.map((e) => (
          <WeeklyEvent key={e.name} days={e.length}>
            <Rotation name={e.name} />
          </WeeklyEvent>
        ))}

        {/* Events after today */}
        {eventAfterToday.map((e) => (
          <WeeklyEvent key={e.name} days={e.length}>
            <Rotation name={e.name} isOncall={e.isOncall} />
          </WeeklyEvent>
        ))}
      </WeeklyCalendar>
    </div>
  );
};

export default ScheduleListCard;
