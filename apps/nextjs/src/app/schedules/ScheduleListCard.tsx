import { useMemo } from 'react';
import { WeeklyCalendar, WeeklyEvent } from '../_components/Calendar';

const ColorRotation = ['red'];

const TotalScheduleDays = 14;
const ScheduleDaysBeforeToday = 3;

const ScheduleListCard = ({
  name,
  lengthInSeconds,
  users,
}: {
  name: string;
  lengthInSeconds: number;
  users: any[];
}) => {
  const scheduleUsers = useMemo(() => {
    return users
      .map((u, i) => ({
        ...u,
        color: ColorRotation[i % ColorRotation.length],
      }))
      .sort((a, b) => a.order - b.order);
  }, [users]);

  /**
   * Since we know how many days before today and how many days total
   * we want to show on the rotation calendar, we can
   * calculate what events we should put.
   */
  const rotationLengthInDays = useMemo(() => {
    return Math.ceil(lengthInSeconds / 86400);
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
        };
      }),
    ];

    const remainingDays =
      rotationLengthInDays - numFullRotations * rotationLengthInDays;
    if (remainingDays > 0) {
      const nextUser = scheduleUsers[numFullRotations % scheduleUsers.length]!;
      rotations.push({
        name: `${nextUser.firstName} ${nextUser.lastName}`,
        color: nextUser.color,
        length: remainingDays,
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
            <div
              key={u.id}
              className={`h-[20px] w-[20px] bg-red-500 rounded-full ring ring-white text-smr text-center -ml-0.5`}
            >
              {`${u.firstName[0]}${u.lastName[0]}`}
            </div>
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
            <div className="flex items-center h-full w-full">
              <div className={`bg-red-100 rounded mr-1 p-2 text-center w-full`}>
                {e.name}
              </div>
            </div>
          </WeeklyEvent>
        ))}

        {/* Events after today */}
        {eventAfterToday.map((e) => (
          <WeeklyEvent key={e.name} days={e.length}>
            <div className="flex items-center h-full w-full">
              <div className={`bg-red-100 rounded mr-1 p-2 text-center w-full`}>
                {e.name}
              </div>
            </div>
          </WeeklyEvent>
        ))}
      </WeeklyCalendar>
    </div>
  );
};

export default ScheduleListCard;
