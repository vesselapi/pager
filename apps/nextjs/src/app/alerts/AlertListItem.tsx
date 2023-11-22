import classNames from "classnames";
import { StatusToIcon } from "./AlertsList";
import { TbCheck, TbHandStop, TbArrowUpRightCircle, TbThumbUpFilled } from "react-icons/tb";
import { format } from 'date-fns'




const ActionButtons = ({ status, expanded = false }: { status: string; expanded?: boolean }) => {
  return status === 'ACKED' ? <>
    <button className={classNames(
      expanded ? 'rounded mb-2' : 'h-[30px] w-[30px] rounded-full',
      "border mr-2 border-green-400 text-green-300 text-lg hover:bg-green-300 hover:text-white"
    )}>
      <div className="flex items-center justify-between px-2">
        <TbCheck />
        {expanded ? <div>Close</div> : null}
      </div>
    </button>
    <button className="border border-blue-400 text-blue-300 text-lg hover:bg-blue-300 hover:text-white">
      <TbHandStop className="m-auto " />
      Assign to me
    </button>
  </> : status === 'CLOSED' ? <>
    <button className="border mr-2 border-red-400 text-red-300 text-lg hover:bg-red-300 hover:text-white">
      <TbArrowUpRightCircle className="m-auto " />
      Re-open
    </button>
    <button className="border border-blue-400 text-blue-300 text-lg hover:bg-blue-300 hover:text-white">
      <TbHandStop className="m-auto " />
      Assign to me
    </button></> :
    <>
      <button className="border mr-2 border-yellow-400 text-yellow-300 text-lg hover:bg-yellow-300 hover:text-white">
        <TbThumbUpFilled className="m-auto " />
        Ack
      </button>
      <button className="border mr-2 border-green-400 text-green-300 text-lg hover:bg-green-300 hover:text-white">
        <TbCheck className="m-auto " />
        Close
      </button>
      <button className="border border-blue-400 text-blue-300 text-lg hover:bg-blue-300 hover:text-white">
        <TbHandStop className="m-auto " />
        Assign to me
      </button>
    </>
}

const AlertsListItem = ({ className, status, title, createdAt, style, initials }: { className?: string, status: string; title: string; createdAt: string; style: 'condensed' | 'expanded'; initials: string; }) => {
  const condensedStyle = style === 'condensed';

  if (condensedStyle) {
    return (
      <div className={classNames(`grid grid-cols-[1fr_8fr_1fr_1fr] justify-between border-b-[1px] border-zinc-200 px-10 py-3 cursor-pointer hover:bg-zinc-200`, className)}>
        <div className="flex items-center">
          <div className="mr-1 text-2xl">{StatusToIcon[status]}</div>
          {status}
        </div>

        <div className="flex items-center">
          <h2 className='font-bold text-base mr-1'>{title}</h2>
          <div className="text-zinc-600">Occaeacat sint aute nulla proident nulla proident nulla proident nulla proident....</div>
        </div>

        <div className="flex items-center">
          <div className="text-zinc-600 font-bold mr-2">{initials}</div>
          <div className="mr-4 whitespace-nowrap">{format(new Date(createdAt), 'dd/MM p')}</div>
        </div>

        <div className="flex items-center justify-end">
          <ActionButtons status={status} />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(`rounded border-[1px] mt-3 border-zinc-200 cursor-pointer hover:bg-zinc-200 p-4`, className)}>
      <div className="flex items-start justify-between">
        <div className="w-2/4">
          <div className="flex items-center mr-4 text-lg mb-2">
            <div className="mr-1 text-2xl">{StatusToIcon[status]}</div>
            <div className="mr-2">{status}</div>
            <div className={`font-bold mr-2`}>{title}</div>
            <div className="text-sm">{initials}</div>
          </div>
          <div className="text-zinc-600 text-smr">Aliquip aliqua adipisicing sunt ea reprehenderit qui deserunt eiusmod id quis officia ut minim ad aliqua. Duis ullamco est proident eiusmod et mollit pariatur dolor aliqua nisi. Consectetur exercitation cupidatat sint consequat aute Lorem. Nostrud dolore eu labore ullamco ea in dolor commodo eiusmod. Ipsum enim id fugiat tempor cillum. Duis aliqua adipisicing excepteur labore nostrud laborum veniam sit irure incididunt minim quis id nulla.</div>
        </div>
        <div className="flex">
          <ul className="mr-8">
            Timeline
            <li>10:203:30</li>
            <li>10:203:30</li>
            <li>10:203:30</li>
          </ul>
          <div className="flex flex-col"><ActionButtons status={status} expanded /></div>
        </div>
      </div>
    </div >
  );
};

export default AlertsListItem;
