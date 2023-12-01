import classNames from 'classnames';
import { addDays, format, getDay } from 'date-fns';

const Styles = {
    rowHeight: "h-[65px]"
}

export const WeeklyEvent = ({ cols, children }: { cols: number, children: React.ReactElement }) => {
    return <div className={classNames(`col-span-${cols}`, Styles.rowHeight)}>{children}</div>
}

/**
 * totalDays
 * daysBefore (w/ default)
 */
export const WeeklyCalendar = ({
    totalDays,
    daysBeforeToday = 0,
    children
}: {
    totalDays: 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
    daysBeforeToday?: number;
    children: (React.ReactElement<typeof WeeklyEvent>)[] | React.ReactElement<typeof WeeklyEvent>;
}) => {
    const today = new Date();
    const days = Array.from({ length: totalDays }, (_, i) => {
        const date = addDays(today, i - daysBeforeToday);
        const day = getDay(date);
        const label = format(date, 'd/M EEEEEE');
        return { day, label };
    });

    return (
        <div className={`grid grid-cols-${totalDays} bg-gray-200`}>
            {days.map((day) => (
                <div key={day.day} className='bg-gray-200'>
                    <div className="text-smr text-gray-500">{day.label}</div>
                </div>
            ))}
            {/* TODO(@zkirby): This could be improved with some creative use of col-start-x */}
            <div className={classNames(`col-span-${daysBeforeToday}`, Styles.rowHeight)}>x</div>
            {children}
        </div>
    );
};

