
const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
    />
  );
};

export default Skeleton;
