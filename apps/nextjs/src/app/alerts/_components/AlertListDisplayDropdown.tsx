import { VscSettings } from 'react-icons/vsc';

import Dropdown from '../../_components/Dropdown';
import SingleSelect from '../../_components/SingleSelect';

const AlertListDisplayDropdown = ({
  display,
  setDisplay,
}: {
  display: { style: 'condensed' | 'regular' };
  setDisplay: (d: { style: 'condensed' | 'regular' }) => void;
}) => {
  return (
    <Dropdown
      noHighlight
      OpenButton={
        <div className="flex items-center rounded bg-gray-200 px-2 py-1">
          <VscSettings className="mr-1" />
          Display
        </div>
      }
    >
      <button onClick={(e) => e.preventDefault()}>
        <div>Alert Style</div>
        <SingleSelect
          options={[
            { value: 'condensed', label: 'Condensed' },
            { value: 'regular', label: 'Regular' },
          ]}
          value={display.style}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const target = e.currentTarget as HTMLSelectElement;
            setDisplay({ style: target.value });
          }}
        />
      </button>
    </Dropdown>
  );
};

export default AlertListDisplayDropdown;
