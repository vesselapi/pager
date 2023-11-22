import classNames from "classnames";

const AlertsListItem = ({ className, status, title, style }: { className?: string, status?: string; title: string; style: 'condensed' | 'expanded' }) => {
  const condensedStyle = style === 'condensed';

  if (condensedStyle) {
    return (
      <div className={classNames(`flex border-[1px] border-zinc-100 p-2`, className)}>
        <h2 className={`mb-2 font-bold`}>{title}</h2>
        <li>Severity: {status}</li>
        <li>Timestamp: 2022-01-01 12:00:00</li>
      </div>
    );
  }

  return (
    <div className={classNames(`rounded-2xl border-[2px] border-zinc-100 p-4`, className)}>
      <h2 className={`mb-2 text-xl font-bold`}>{title}</h2>
      <p className="mb-2">Alert details:</p>
      <ul className="mb-4 ml-6 list-disc">
        <li>Severity: {status}</li>
        <li>Timestamp: 2022-01-01 12:00:00</li>
      </ul>
    </div>
  );
};

export default AlertsListItem;
