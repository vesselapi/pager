const AlertsListItem = ({ alert }) => {
  return (
    <div className="rounded bg-gray-200 p-4">
      <h2 className="mb-2 text-xl font-bold">{alert.title}</h2>
      <p className="mb-2">Alert details:</p>
      <ul className="mb-4 ml-6 list-disc">
        <li>Severity: {alert.status}</li>
        <li>Timestamp: 2022-01-01 12:00:00</li>
      </ul>
    </div>
  );
};

export default AlertsListItem;
