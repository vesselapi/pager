const AlertsListItem = ({ alert, style }) => {
  const condensedStyle = style === 'condensed';

  if (condensedStyle) {
    return (
      <div className={`flex border-[1px] border-zinc-100 p-2`}>
        <h2 className={`mb-2 font-bold`}>{alert.title}</h2>
        <li>Severity: {alert.status}</li>
        <li>Timestamp: 2022-01-01 12:00:00</li>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border-[2px] border-zinc-100 p-4`}>
      <h2 className={`mb-2 text-xl font-bold`}>{alert.title}</h2>
      <p className="mb-2">Alert details:</p>
      <ul className="mb-4 ml-6 list-disc">
        <li>Severity: {alert.status}</li>
        <li>Timestamp: 2022-01-01 12:00:00</li>
      </ul>
    </div>
  );
};

export default AlertsListItem;
