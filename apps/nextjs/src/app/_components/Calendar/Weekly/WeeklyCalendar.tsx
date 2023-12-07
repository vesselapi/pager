import classNames from 'classnames';
import { addDays, format, getDay, isToday } from 'date-fns';

const Styles = {
  rowBg: 'bg-zinc-100',
};

export const WeeklyEvent = ({
  days: cols,
  children,
}: React.PropsWithChildren<{
  days: number;
}>) => {
  return (
    <div className={classNames(`col-span-${cols} h-[90px]`, Styles.rowBg)}>
      {children}
    </div>
  );
};

/**
 * A horizontal calendar weekly view, i.e:
 * Mon | Tue | Wed | Thu | Fri | Sat | Sun
 * x   | x   | x   | x   | x   | x   | x
 */
export const WeeklyCalendar = ({
  totalDays,
  daysBeforeToday = 0,
  children,
}: React.PropsWithChildren<{
  /**
   * The total number of days to show in the calendar
   */
  totalDays: 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
  /**
   * Number of 'padding' days to show in the front
   * of the calendar before today, e.g., if this is 3
   * then the cal would be | today - 3 | today - 2 | today - 1 | today | today + 1 | ...
   */
  daysBeforeToday?: number;
}>) => {
  const today = new Date();
  const days = Array.from({ length: totalDays }, (_, i) => {
    const date = addDays(today, i - daysBeforeToday);
    const day = getDay(date);
    const label = format(date, 'd/M EEEEEE');
    return { day, label, isToday: isToday(date) };
  });

  return (
    <div
      className={classNames(
        `grid grid-cols-${totalDays} grid-rows-2 h-[60px]`,
        Styles.rowBg,
      )}
    >
      {/* Column headers */}
      {days.map((day, i) => (
        <div
          key={day.day}
          className={classNames(
            `h-[30px] flex items-center bg-zinc-100 border-b-[1px] border-zinc-300`,
            {
              'border-r-[1px]': i !== days.length - 1,
            },
          )}
        >
          <div
            className={classNames(`text-sm flex items-center ml-1.5`, {
              'text-gray-700 ': day.isToday,
              'text-gray-400': !day.isToday,
            })}
          >
            {day.label}
          </div>
        </div>
      ))}
      {children}
    </div>
  );
};
