import { BsList } from 'react-icons/bs';
import { RxCardStack } from 'react-icons/rx';
import { VscSettings } from 'react-icons/vsc';

import Dropdown from '../../_components/Dropdown';
import RadioSelect from '../../_components/RadioSelect';

const AlertListDisplayDropdown = ({
  display,
  setDisplay,
}: {
  display: { style: 'condensed' | 'expanded' };
  setDisplay: (d: { style: 'condensed' | 'expanded' }) => void;
}) => {
  return (
    <Dropdown
      noHighlight
      OpenButton={
        <div className="flex items-center rounded bg-gray-200 px-2 py-1 text-zinc-600">
          <VscSettings className="mr-1.5" />
          Display
        </div>
      }
    >
      <div className="flex w-full items-center justify-between">
        <div>Alert Style</div>
        <RadioSelect
          options={[
            { value: 'expanded', label: 'Expanded', Icon: <RxCardStack /> },
            { value: 'condensed', label: 'Condensed', Icon: <BsList /> },
          ]}
          value={display.style}
          onChange={(style) => setDisplay({ style })}
        />
      </div>
    </Dropdown>
  );
};

export default AlertListDisplayDropdown;
