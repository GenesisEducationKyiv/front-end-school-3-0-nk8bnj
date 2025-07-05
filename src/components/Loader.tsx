const Loader = () => {
  return (
    <div
      className={`flex justify-center items-center h-64`}
      data-testid="loading-tracks"
      data-loading="true"
    >
      <div
        className={`animate-spin rounded-full h-18 w-18 border-b-2 border-primary`}
        data-testid="loading-indicator"
      ></div>
    </div>
  );
};

export default Loader; 