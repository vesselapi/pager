const Input = ({ label, ...props }: { label: string; [key: string]: any }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-zinc-600 mb-0.5">{label}</label>
      <input
        className="py-1.5 pl-2 rounded text-sm outline-none bg-gray-200 "
        {...props}
      />
    </div>
  );
};

export default Input;
