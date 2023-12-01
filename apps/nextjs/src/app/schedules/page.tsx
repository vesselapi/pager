'use client';
import {
  WeeklyCalendar,
  WeeklyEvent,
} from '../_components/Calendar';

const SchedulePage = () => {
  // const schedules = await

  return (
    <div className="px-10">
      <div className="h-card-lg px-4 py-5 rounded border-[1px] border-zinc-200 mt-5">
        <div className="flex justify-between mb-5">
          <div>Backend Primary Rotation</div>
          <div className='flex'>
            <div className='h-[20px] w-[20px] bg-slate-500 rounded-full'></div>
            <div className='h-[20px] w-[20px] bg-slate-500 rounded-full'></div>
            <div className='h-[20px] w-[20px] bg-slate-500 rounded-full'></div>
            <div className='h-[20px] w-[20px] bg-slate-500 rounded-full'></div>
          </div>
        </div>

        <WeeklyCalendar totalDays={14} daysBeforeToday={3}>
          <WeeklyEvent cols={7}>
            <div className='bg-red-500 rounded'>hello</div>
          </WeeklyEvent>
          <WeeklyEvent cols={4}>
            <div className='bg-red-500 rounded'>hello</div>
          </WeeklyEvent>
        </WeeklyCalendar>
      </div>
    </div>
  );
};

export default SchedulePage;
