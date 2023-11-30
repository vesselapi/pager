import classNames from 'classnames';
import { format } from 'date-fns';
import { capitalize } from 'radash';
import {
  TbArrowUpRightCircle,
  TbCheck,
  TbHandStop,
  TbThumbUpFilled,
} from 'react-icons/tb';
import type { Alert, User } from './alerts.types';

const Styles = {
  ButtonCondensed: 'h-[35px] w-[35px] rounded-full',
  ButtonExpanded: 'rounded mb-2 text-smr',
  ButtonShared: (colors: string) =>
    `${colors} border mr-2 text-lg hover:bg-opacity-40 flex items-center justify-between px-2 whitespace-nowrap`,
};

const StatusToColor = {
  ACKED: 'text-blue-800 bg-blue-200',
  OPEN: 'text-red-800 bg-red-200',
  CLOSED: 'text-green-800 bg-green-200',
};

interface TActionButtons {
  onAck: () => void;
  onClose: () => void;
  onSelfAssign: () => void;
  onReopen: () => void;
}

const ActionButtons = ({
  status,
  expanded = false,
  onAck,
  onClose,
  onSelfAssign,
  onReopen,
}: { status: string; expanded?: boolean } & TActionButtons) => {
  return status === 'ACKED' ? (
    <>
      <button
        onClick={onClose}
        className={classNames(
          expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
          Styles.ButtonShared(
            'border-green-500 text-green-500 hover:bg-green-500',
          ),
        )}
      >
        {expanded ? <div>Close</div> : null}
        <TbCheck />
      </button>
      <button
        onClick={onSelfAssign}
        className={classNames(
          expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
          Styles.ButtonShared(
            'border-zinc-500 text-zinc-500 hover:bg-zinc-500',
          ),
        )}
      >
        {expanded ? <div className="mr-1.5">Take up</div> : null}
        <TbHandStop />
      </button>
    </>
  ) : status === 'CLOSED' ? (
    <>
      <button
        onClick={onReopen}
        className={classNames(
          expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
          Styles.ButtonShared('border-red-500 text-red-500 hover:bg-red-500'),
        )}
      >
        {expanded ? <div>Re-open</div> : null}
        <TbArrowUpRightCircle />
      </button>
      <button
        onClick={onSelfAssign}
        className={classNames(
          expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
          Styles.ButtonShared(
            'border-zinc-500 text-zinc-500 hover:bg-zinc-500',
          ),
        )}
      >
        {expanded ? <div className="mr-1.5">Take up</div> : null}
        <TbHandStop />
      </button>{' '}
    </>
  ) : (
    <>
      <button
        onClick={onAck}
        className={classNames(
          expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
          Styles.ButtonShared(
            'border-blue-400 text-blue-400 hover:bg-blue-500',
          ),
        )}
      >
        {expanded ? <div>Ack</div> : null}
        <TbThumbUpFilled />
      </button>
      <button
        onClick={onClose}
        className={classNames(
          expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
          Styles.ButtonShared(
            'border-green-500 text-green-500 hover:bg-green-500',
          ),
        )}
      >
        {expanded ? <div>Close</div> : null}
        <TbCheck />
      </button>
      <button
        onClick={onSelfAssign}
        className={classNames(
          expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
          Styles.ButtonShared(
            'border-zinc-500 text-zinc-500 hover:bg-zinc-500',
          ),
        )}
      >
        {expanded ? <div className="mr-1.5">Take up</div> : null}
        <TbHandStop />
      </button>
    </>
  );
};

const AlertsListItem = ({
  className,
  cardType,
  alert,
  user,
  onAck,
  onClose,
  onSelfAssign,
  onReopen,
}: {
  className?: string;
  cardType: 'condensed' | 'expanded';
  alert: Alert,
  user?: User,
} & TActionButtons) => {
  const { status, title, createdAt, summary } = alert;

  if (cardType === 'condensed') {
    return (
      <div
        className={classNames(
          `grid cursor-pointer grid-cols-[1fr_10fr_2fr_2fr] justify-between border-b-[1px] border-zinc-200 px-10 py-3 hover:bg-zinc-200`,
          className,
        )}
      >
        <div className="text-smr flex items-center">
          <div
            className={classNames(
              StatusToColor[status as keyof typeof StatusToColor],
              'text-smr rounded bg-opacity-80 px-2 font-medium',
            )}
          >
            {capitalize(status)}
          </div>
        </div>

        <div className="flex items-center whitespace-nowrap">
          <h2 className="mr-1.5 text-base">{title}</h2>
          <div className="text-zinc-500">
            {(summary)}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="mr-2 font-bold text-zinc-600">
            {(user?.firstName?.slice(0, 1) ?? '') + (user?.lastName?.slice(0, 1) ?? '')}
          </div>
          <div className="mr-4 whitespace-nowrap">
            {format(createdAt, 'dd/MM p')}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <ActionButtons
            status={status}
            onAck={onAck}
            onClose={onClose}
            onReopen={onReopen}
            onSelfAssign={onSelfAssign}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        `mt-3 cursor-pointer rounded border-[1px] border-zinc-200 px-4 py-5 hover:bg-zinc-200`,
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="mx-2 flex h-[130px] w-full items-center justify-center rounded bg-zinc-600 p-5 text-zinc-200">
          <i>Work In Progress</i>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <ActionButtons
              status={status}
              onAck={onAck}
              onClose={onClose}
              onReopen={onReopen}
              onSelfAssign={onSelfAssign}
              expanded
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsListItem;
