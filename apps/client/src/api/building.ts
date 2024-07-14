import api from '.';

const buildingsApi = api.injectEndpoints({
  endpoints: (buildings) => ({
    getBuildings: buildings.query({
      query: () => '/v1/buildings',
      providesTags: ['Building'],
    }),
    getBuilding: buildings.query({
      query: (id) => `/v1/buildings/${id}`,
      providesTags: ['Building'],
    }),
    createBuilding: buildings.mutation({
      query: (building) => ({
        url: '/v1/buildings',
        method: 'POST',
        body: building,
      }),
      invalidatesTags: ['Building', 'ActionAuditLog'],
    }),
    updateBuilding: buildings.mutation({
      query: ({ id, building }) => ({
        url: `/v1/buildings/${id}`,
        method: 'PATCH',
        body: building,
      }),
      invalidatesTags: ['Building'],
    }),
    deleteBuilding: buildings.mutation({
      query: ({ id }) => ({
        url: `/v1/buildings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        'Building',
        'BuildingBlock',
        'Floor',
        'Room',
        'ActionAuditLog',
      ],
    }),
    generateProbableRooms: buildings.mutation({
      query: ({ id }) => ({
        url: `/v1/buildings/${id}/predict-allocation`,
        method: 'POST',
      }),
      invalidatesTags: ['Room', 'ActionAuditLog'],
    }),
    allocateRoomsToStudents: buildings.mutation({
      query: ({ id }) => ({
        url: `/v1/buildings/${id}/allocate`,
        method: 'POST',
      }),
      invalidatesTags: ['Room', 'ActionAuditLog'],
    }),
    clearAllocationForBuilding: buildings.mutation({
      query: ({ id }) => ({
        url: `/v1/buildings/${id}/clear-allocation`,
        method: 'POST',
      }),
      invalidatesTags: ['Room', 'ActionAuditLog'],
    }),
    resetBuilding: buildings.mutation({
      query: ({ id }) => ({
        url: `/v1/buildings/${id}/reset`,
        method: 'POST',
      }),
      invalidatesTags: ['Room', 'ActionAuditLog'],
    }),
  }),
});

export const {
  useGetBuildingsQuery,
  useGetBuildingQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
  useGenerateProbableRoomsMutation,
  useAllocateRoomsToStudentsMutation,
  useClearAllocationForBuildingMutation,
  useResetBuildingMutation,
} = buildingsApi;
