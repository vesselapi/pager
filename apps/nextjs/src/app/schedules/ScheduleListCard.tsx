import { WeeklyCalendar, WeeklyEvent } from '../_components/Calendar';

const ScheduleListCard = ({ name }: { name: string }) => {
  return (
    <div className="h-card-lg px-4 py-5 rounded border-[1px] border-zinc-200 mt-5">
      <div className="flex justify-between mb-5">
        <div className="text-zinc-600">{name}</div>
        <div className="flex">
          <div className="h-[20px] w-[20px] bg-zinc-500 rounded-full ring ring-yellow-300 scale-110 -ml-0.5">
            ZK
          </div>
          <div className="h-[20px] w-[20px] bg-zinc-500 rounded-full ring ring-white -ml-0.5">
            AY
          </div>
          <div className="h-[20px] w-[20px] bg-zinc-500 rounded-full ring ring-white -ml-0.5">
            ZK
          </div>
          <div className="h-[20px] w-[20px] bg-zinc-500 rounded-full ring ring-white -ml-0.5">
            ZK
          </div>
        </div>
      </div>

      <WeeklyCalendar totalDays={14} daysBeforeToday={3}>
        <WeeklyEvent days={3}>
          <div className="flex items-center h-full w-full">
            <div className="bg-green-100 rounded mr-1 p-2 text-center w-full">
              Zachary Kirby
            </div>
          </div>
        </WeeklyEvent>
        <WeeklyEvent days={7}>
          <div className="flex items-center h-full w-full">
            <div className="bg-red-100 rounded mr-1 p-2 text-center w-full">
              Zachary Kirby
            </div>
          </div>
        </WeeklyEvent>
        <WeeklyEvent days={4}>
          <div className="flex items-center h-full w-full">
            <div className="bg-blue-100 rounded mr-1 p-2 text-center w-full">
              Avery Yip
            </div>
          </div>
        </WeeklyEvent>
      </WeeklyCalendar>
    </div>
  );
};

export default ScheduleListCard;
