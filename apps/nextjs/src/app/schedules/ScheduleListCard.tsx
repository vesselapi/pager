import type { RouterOutputs } from '@vessel/api';
import classNames from 'classnames';
import { differenceInDays } from 'date-fns';
import { useMemo } from 'react';
import { TbPhoneFilled } from 'react-icons/tb';
import { WeeklyCalendar, WeeklyEvent } from '../_components/Calendar';
import UserIcon from '../_components/UserIcon';

const TOTAL_SCHEDULE_DAYS = 14;
const SCHEDULE_DAYS_BEFORE_TODAY = 3;

const Rotation = ({ name, isOnCall }: { name: string; isOnCall?: boolean }) => {
  return (
    <div className="flex items-center h-full w-full">
      <div
        className={classNames(
          `rounded mr-1 p-2 w-full bg-gray-300 text-gray-700 text-sm flex items-center justify-center`,
          {
            'opacity-60': !isOnCall,
            'opacity-100 font-medium': isOnCall,
          },
        )}
      >
        {isOnCall && (
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
  lengthInSeconds: number;
  startTime: Date;
  users: RouterOutputs['schedule']['list']['schedules']['0']['users'];
}) => {
  /**
   * Re-order the users such that the oncall user is first.
   * This makes creating the schedules view significantly easier.
   */
  const orderedScheduleUsers = useMemo(() => {
    const sorted = users.sort((a, b) => a.order - b.order);
    const onCallIdx = sorted.findIndex((u) => u.isOnCall);

    // Move all the users before the oncall to the end
    // effectively making the list resorted with the oncall first.
    return [...sorted.slice(onCallIdx), ...sorted.slice(0, onCallIdx)];
  }, [users]);

  /**
   * Create the events
   *
   * NOTE: We round everything to the nearest day or else
   * the calender becomes very unruly.
   */
  const rotationLengthInDays = useMemo(() => {
    return Math.floor(lengthInSeconds / (60 * 60 * 24));
  }, [lengthInSeconds]);

  const eventsBeforeToday = useMemo(() => {
    // Reverse the list since we're going backwards in time
    const reversed = [...orderedScheduleUsers].reverse();

    const events = Array.from({
      // The total rotations that happened in the 'ScheduleDaysBeforeToday' days.
      length: Math.ceil(SCHEDULE_DAYS_BEFORE_TODAY / rotationLengthInDays),
    }).map((_, i) => {
      const nextUser = reversed[i + 1]!;
      const daysLeft = SCHEDULE_DAYS_BEFORE_TODAY - i * rotationLengthInDays;
      return {
        name: `${nextUser.firstName} ${nextUser.lastName}`,
        length: Math.min(daysLeft, rotationLengthInDays),
        isOnCall: false,
      };
    });

    // Re-reverse since we're showing the events in chronological order.
    return events.reverse();
  }, [orderedScheduleUsers, rotationLengthInDays]);

  const eventsAfterToday = useMemo(() => {
    // The days we visually get on the calendar to show the user.
    const allocatedDays = TOTAL_SCHEDULE_DAYS - SCHEDULE_DAYS_BEFORE_TODAY;

    // Calculate how many days in the rotation the oncall has left
    const daysSinceStart = differenceInDays(new Date(), startTime);
    const daysLeftOnCall =
      rotationLengthInDays - (daysSinceStart % rotationLengthInDays);
    const onCall = orderedScheduleUsers[0]!;
    const rotations = [
      {
        name: `${onCall.firstName} ${onCall.lastName}`,
        // Edge case where a rotation is more days than we have left on the calendar.
        length: Math.min(daysLeftOnCall, allocatedDays),
        isOnCall: true,
      },
    ];

    const remainingDays = allocatedDays - daysLeftOnCall;
    Array.from({
      length: Math.ceil(remainingDays / rotationLengthInDays),
    }).forEach((_, i) => {
      const nextUserIndex = (i + 1) % orderedScheduleUsers.length;
      const nextUser = orderedScheduleUsers[nextUserIndex]!;

      const daysLeft = remainingDays - i * rotationLengthInDays;

      rotations.push({
        name: `${nextUser.firstName} ${nextUser.lastName}`,
        length: Math.min(daysLeft, rotationLengthInDays),
        isOnCall: false,
      });
    });

    return rotations;
  }, [rotationLengthInDays, orderedScheduleUsers, startTime]);

  return (
    <div className="h-card-lg px-4 py-4 rounded border-[1px] border-zinc-200 mt-5">
      <div className="flex items-center justify-between mb-5">
        <div className="text-zinc-600 text-sm">
          <div className="text-xs text-zinc-400">{teamName}</div>
          {name}
        </div>
        <div className="flex">
          {orderedScheduleUsers.map((u) => (
            <UserIcon key={u.id} className={`-ml-0.5`} {...u} />
          ))}
        </div>
      </div>

      <WeeklyCalendar
        totalDays={TOTAL_SCHEDULE_DAYS}
        daysBeforeToday={SCHEDULE_DAYS_BEFORE_TODAY}
      >
        {/* Events before today */}
        {eventsBeforeToday.map((e) => (
          <WeeklyEvent key={e.name} days={e.length}>
            <Rotation name={e.name} />
          </WeeklyEvent>
        ))}

        {/* Events after today */}
        {eventsAfterToday.map((e) => (
          <WeeklyEvent key={e.name} days={e.length}>
            <Rotation name={e.name} isOnCall={e.isOnCall} />
          </WeeklyEvent>
        ))}
      </WeeklyCalendar>
    </div>
  );
};

export default ScheduleListCard;
