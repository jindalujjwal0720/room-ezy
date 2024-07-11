export const getRoomNameFromConvention = (
  convention: string,
  config: { block: string; floor: string; room: string; building: string }
) => {
  return convention
    .replace(/{building}/g, config.building)
    .replace(/{block}/g, config.block)
    .replace(/{floor}/g, config.floor)
    .replace(/{room}/g, config.room);
};
