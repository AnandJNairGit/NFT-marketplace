const currentUnixTimestamp = async (campaigns) => {
  return Math.floor(Date.now() / 1000);
};
export default currentUnixTimestamp;
