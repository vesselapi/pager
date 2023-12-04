import classNames from 'classnames';
import { addDays, format, getDay, isToday } from 'date-fns';

const Styles = {
  rowHeight: 'h-[90px]',
  rowBg: 'bg-zinc-200',
};

export const WeeklyEvent = ({
  days: cols,
  children,
}: {
  days: number;
  children: React.ReactElement | React.ReactElement[];
}) => {
  return (
    <div
      className={classNames(`col-span-${cols}`, Styles.rowBg, Styles.rowHeight)}
    >
      {children}
    </div>
  );
};

/**
 * totalDays
 * daysBefore (w/ default)
 */
export const WeeklyCalendar = ({
  totalDays,
  daysBeforeToday = 0,
  children,
}: {
  totalDays: 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
  daysBeforeToday?: number;
  children: React.ReactElement[] | React.ReactElement;
}) => {
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
      {days.map((day) => (
        <div
          key={day.day}
          className={classNames(`h-[30px] flex items-center bg-zinc-100`)}
        >
          <div
            className={classNames(`text-sm text-gray-400 ml-1`, {
              'font-bold ': day.isToday,
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
