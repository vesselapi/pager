import { ActivityIndicator } from 'react-native';

interface Status {
  loading: boolean;
  // TODO(@zkirby)
  // isError: boolean;
  // isSuccess: boolean;
}

const Loader = ({
  status,
  className,
  children,
}: React.PropsWithChildren<{
  status: Status;
  className?: string;
}>) => {
  if (status.loading) return <ActivityIndicator className={className} />;
  return children;
};

export default Loader;
