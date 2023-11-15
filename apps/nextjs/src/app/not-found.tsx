import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-red-500">Not Found</h2>
      <p className="text-lg text-gray-500">Could not find requested resource</p>
      <Link href="/" className="text-blue-500 underline">
        Return Home
      </Link>
    </div>
  );
};
export default NotFound;
