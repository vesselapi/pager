import type { RouterOutputs } from '@vessel/api';
import classNames from 'classnames';
import { useMemo } from 'react';
import { WeeklyCalendar, WeeklyEvent } from '../_components/Calendar';
import UserIcon from '../_components/UserIcon';

const ColorRotation = [
  {
    bg: 'bg-red-100',
    txt: 'text-red-800',
  },
  {
    bg: 'bg-blue-100',
    txt: 'text-blue-800',
  },
  {
    bg: 'bg-green-100',
    txt: 'text-green-800',
  },
  {
    bg: 'bg-purple-100',
    txt: 'text-purple-800',
  },
];

const TotalScheduleDays = 14;
const ScheduleDaysBeforeToday = 3;

const Rotation = ({
  name,
  bgColor,
  txtColor,
  isOncall,
}: {
  name: string;
  bgColor: string;
  txtColor: string;
  isOncall: boolean;
}) => {
  return (
    <div className="flex items-center h-full w-full">
      <div
        className={classNames(
          `rounded mr-1 p-2 text-center w-full`,
          bgColor,
          txtColor,
        )}
      >
        {name}
      </div>
    </div>
  );
};

const ScheduleListCard = ({
  name,
  lengthInSeconds,
  users,
}: {
  name: string;
  lengthInSeconds: string;
  users: RouterOutputs['schedule']['list']['schedules']['0']['users'];
}) => {
  const scheduleUsers = useMemo(() => {
    return users
      .map((u, i) => ({
        ...u,
        color: ColorRotation[i % ColorRotation.length]!,
      }))
      .sort((a, b) => a.order - b.order);
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
        color: lastUser.color,
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
          color: user.color,
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
        color: nextUser.color,
        length: remainingDays,
        isOncall: false,
      });
    }

    return rotations;
  }, [rotationLengthInDays, scheduleUsers]);

  return (
    <div className="h-card-lg px-4 py-5 rounded border-[1px] border-zinc-200 mt-5">
      <div className="flex justify-between mb-5">
        <div className="text-zinc-600">{name}</div>
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
            <Rotation
              name={e.name}
              bgColor={e.color.bg}
              txtColor={e.color.txt}
            />
          </WeeklyEvent>
        ))}

        {/* Events after today */}
        {eventAfterToday.map((e) => (
          <WeeklyEvent key={e.name} days={e.length}>
            <Rotation
              name={e.name}
              bgColor={e.color.bg}
              txtColor={e.color.txt}
            />
          </WeeklyEvent>
        ))}
      </WeeklyCalendar>
    </div>
  );
};

export default ScheduleListCard;
