import classNames from "classnames";
import { TbCheck, TbHandStop, TbArrowUpRightCircle, TbThumbUpFilled } from "react-icons/tb";
import { format } from 'date-fns'

const Styles = {
  ButtonCondensed: 'h-[35px] w-[35px] rounded-full',
  ButtonExpanded: 'rounded mb-2 text-smr',
  ButtonShared: (color: string) => `border mr-2 text-${color}-500 border-${color}-500 text-lg hover:bg-${color}-500 hover:bg-opacity-40 flex items-center justify-between px-2 whitespace-nowrap`
}

const ActionButtons = ({ status, expanded = false }: { status: string; expanded?: boolean }) => {
  return status === 'ACKED' ? <>
    <button className={classNames(
      expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
      Styles.ButtonShared('green')
    )}>
      {expanded ? <div>Close</div> : null}
      <TbCheck />
    </button>
    <button className={classNames(
      expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
      Styles.ButtonShared('blue')
    )}>
      {expanded ? <div className="mr-1.5">Take up</div> : null}
      <TbHandStop />
    </button>
  </> : status === 'CLOSED' ? <>
    <button className={classNames(
      expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
      Styles.ButtonShared('red')
    )}>
      {expanded ? <div>Re-open</div> : null}
      <TbArrowUpRightCircle />
    </button>
    <button className={classNames(
      expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
      Styles.ButtonShared('blue')
    )}>
      {expanded ? <div className="mr-1.5">Take up</div> : null}
      <TbHandStop />
    </button> </> :
    <>
      <button className={classNames(
        expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
        Styles.ButtonShared('yellow')
      )}>
        {expanded ? <div>Ack</div> : null}
        <TbThumbUpFilled />
      </button>
      <button className={classNames(
        expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
        Styles.ButtonShared('green')
      )}>
        {expanded ? <div>Close</div> : null}
        <TbCheck />
      </button>
      <button className={classNames(
        expanded ? Styles.ButtonExpanded : Styles.ButtonCondensed,
        Styles.ButtonShared('blue')
      )}>
        {expanded ? <div className="mr-1.5">Take up</div> : null}
        <TbHandStop />
      </button>
    </>
}

const AlertToColor = {
  'ACKED': 'text-blue-800 bg-blue-200',
  'OPEN': 'text-red-800 bg-red-200',
  'CLOSED': 'text-green-800 bg-green-200'
}

const AlertsListItem = ({ className, status, title, createdAt, style, firstName, lastName }: { className?: string, status: string; title: string; createdAt: string; style: 'condensed' | 'expanded'; firstName: string; lastName: string; }) => {
  const condensedStyle = style === 'condensed';

  if (condensedStyle) {
    return (
      <div className={classNames(`grid grid-cols-[1fr_6fr_1fr_1fr] justify-between border-b-[1px] border-zinc-200 px-10 py-3 cursor-pointer hover:bg-zinc-200`, className)}>
        <div className="flex items-center">
          <div className={`${AlertToColor[status]} rounded px-3 py-0.5 font-bold text-smr`}>{status}</div>
        </div>

        <div className="flex items-center">
          <h2 className='font-bold text-base mr-1'>{title}</h2>
          <div className="text-zinc-600">Occaeacat sint aute nulla proident nulla proident nulla proident nulla proident....</div>
        </div>

        <div className="flex items-center">
          <div className="text-zinc-600 font-bold mr-2">{firstName?.slice(0, 1) + lastName?.slice(0, 1)}</div>
          <div className="mr-4 whitespace-nowrap">{format(new Date(createdAt), 'dd/MM p')}</div>
        </div>

        <div className="flex items-center justify-end">
          <ActionButtons status={status} />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(`rounded border-[1px] mt-3 border-zinc-200 cursor-pointer hover:bg-zinc-200 px-4 py-5`, className)}>
      <div className="flex items-start justify-between">
        <div className="w-2/4">
          <div className="flex items-center mr-4 text-lg mb-2">
            {status}
          </div>
          <div className={`font-bold mb-1`}>{title}</div>
          <div>{firstName} {lastName}</div>
        </div>
        <div className="text-zinc-600 text-smr px-4 ">Aliquip aliqua adipisicing sunt ea reprehenderit qui deserunt eiusmod id quis officia ut minim ad aliqua. Duis ullamco est proident eiusmod et mollit pariatur dolor aliqua nisi. Consectetur exercitation cupidatat sint consequat aute Lorem. Nostrud dolore eu labore ullamco ea in dolor commodo eiusmod. Ipsum enim id fugiat tempor cillum. Duis aliqua adipisicing excepteur labore nostrud laborum veniam sit irure incididunt minim quis id nulla. minim quis id nulla. minim quis id nulla. minim quis id nulla. minim quis id nulla. minim quis id nulla. minim quis id nulla</div>
        <div className="flex">
          <ul className="mr-8">
            Timeline
            <li className="whitespace-nowrap">{format(new Date(createdAt), 'dd/MM p')}</li>
          </ul>
          <div className="flex flex-col"><ActionButtons status={status} expanded /></div>
        </div>
      </div>
    </div >
  );
};

export default AlertsListItem;
