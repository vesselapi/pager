import classNames from 'classnames';
import { addDays, format, getDay } from 'date-fns';

const Styles = {
  rowHeight: 'h-[90px]',
  rowBg: 'bg-slate-200',
};

export const WeeklyEvent = ({
  cols,
  children,
}: {
  cols: number;
  children: React.ReactElement;
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
  children:
    | React.ReactElement<typeof WeeklyEvent>[]
    | React.ReactElement<typeof WeeklyEvent>;
}) => {
  const today = new Date();
  const days = Array.from({ length: totalDays }, (_, i) => {
    const date = addDays(today, i - daysBeforeToday);
    const day = getDay(date);
    const label = format(date, 'd/M EEEEEE');
    return { day, label };
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
          className={classNames(`h-[30px] flex items-center bg-slate-100`, {
            'border-r': i !== 0,
            'border-red-500': i === daysBeforeToday - 1,
          })}
        >
          <div className="text-smr text-gray-400 ml-1">{day.label}</div>
        </div>
      ))}
      {/* TODO(@zkirby): This could be improved with some creative use of col-start-x */}
      {/* <div
        className={classNames(
          `col-span-${daysBeforeToday} border-r border-red-500`,
          Styles.rowBg,
          Styles.rowHeight,
        )}
      ></div> */}
      {children}
    </div>
  );
};
