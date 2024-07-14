import { createSlice } from '@reduxjs/toolkit';

interface Building {
  _id: string;
  name: string;
}

interface BuildingBlock {
  _id: string;
  name: string;
}

interface Floor {
  _id: string;
  name: string;
  mapType: string;
  namingConvention: string;
  roomsCount: number;
  roomCapacity: number;
}

interface HomeHistory {
  selectedBuilding?: Building;
  selectedBlock?: BuildingBlock;
  selectedFloor?: Floor;
}

interface AdminHistory {
  actions: {
    selectedBuilding?: Building;
  };
  building: {
    selectedBuilding?: Building;
  };
  block: {
    selectedBuilding?: Building;
    selectedBlock?: BuildingBlock;
  };
  floor: {
    selectedBuilding?: Building;
    selectedBlock?: BuildingBlock;
    selectedFloor?: Floor;
  };
}

interface HistoryState {
  home: HomeHistory;
  admin: AdminHistory;
}

const initialState: HistoryState = {
  home: {
    selectedBuilding: undefined,
    selectedBlock: undefined,
    selectedFloor: undefined,
  },
  admin: {
    actions: {
      selectedBuilding: undefined,
    },
    building: {
      selectedBuilding: undefined,
    },
    block: {
      selectedBuilding: undefined,
      selectedBlock: undefined,
    },
    floor: {
      selectedBuilding: undefined,
      selectedBlock: undefined,
      selectedFloor: undefined,
    },
  },
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHomeHistory(state, action) {
      state.home = action.payload;
    },
    setAdminActionsHistory(state, action) {
      state.admin.actions = action.payload;
    },
    setAdminBuildingHistory(state, action) {
      state.admin.building = action.payload;
    },
    setAdminBlockHistory(state, action) {
      state.admin.block = action.payload;
    },
    setAdminFloorHistory(state, action) {
      state.admin.floor = action.payload;
    },
  },
});

export const {
  setHomeHistory,

  setAdminActionsHistory,
  setAdminBuildingHistory,
  setAdminBlockHistory,
  setAdminFloorHistory,
} = historySlice.actions;

export const selectHomeHistory = (state: { history: HistoryState }) =>
  state.history.home;
export const selectAdminActionsHistory = (state: { history: HistoryState }) =>
  state.history.admin.actions;
export const selectAdminBuildingHistory = (state: { history: HistoryState }) =>
  state.history.admin.building;
export const selectAdminBlockHistory = (state: { history: HistoryState }) =>
  state.history.admin.block;
export const selectAdminFloorHistory = (state: { history: HistoryState }) =>
  state.history.admin.floor;

export default historySlice.reducer;
