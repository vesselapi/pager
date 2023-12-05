import { useState } from 'react';
import Button from '../_components/Button';
import Input from '../_components/Input';

/**
 * TODO(@zkirby): Replace this with a form library
 */
const TeamListAddTeamForm = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: ({ name }: { name: string }) => void;
}) => {
  const [teamName, setTeamName] = useState('');

  return (
    <>
      <Input
        label="Team name"
        type="text"
        value={teamName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          // @ts-expect-error TODO(@zkirby): Fiddle with ts config so the HTMLInput types are correct (include value).
          setTeamName(e.target.value as string)
        }
        placeholder="e.g. Backend"
      />
      <div className="flex justify-end w-full  mt-8">
        <Button type="tertiary" className="mr-3" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit({ name: teamName })}>Add team</Button>
      </div>
    </>
  );
};

export default TeamListAddTeamForm;
