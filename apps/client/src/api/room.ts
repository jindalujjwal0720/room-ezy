import api from '.';

const roomsApi = api.injectEndpoints({
  endpoints: (rooms) => ({
    getRooms: rooms.query({
      query: ({ floorId, select = '' }) =>
        `/v1/rooms?floor=${floorId}&select=${encodeURIComponent(select)}`,
      providesTags: ['Room'],
    }),
    getRoomById: rooms.query({
      query: (roomId) => `/v1/rooms/${roomId}`,
      providesTags: ['Room'],
    }),
    getWantedRooms: rooms.query({
      query: () => '/v1/rooms/wanted',
      providesTags: ['Room'],
    }),
    updateRoomsWantedByUser: rooms.mutation({
      query: ({ roomId }) => ({
        url: `/v1/rooms/${roomId}/wanted`,
        method: 'POST',
      }),
      invalidatesTags: ['Room'],
    }),
    generateProbableRoomsInBuilding: rooms.mutation({
      query: ({ buildingId }) => ({
        url: '/v1/rooms/allocate-probable',
        method: 'POST',
        body: { buildingId },
      }),
      invalidatesTags: ['Room'],
    }),
    getProbableRoomsForUser: rooms.query({
      query: () => '/v1/rooms/probable',
      providesTags: ['Room'],
    }),
    getAllotedRoomForUser: rooms.query({
      query: () => '/v1/rooms/allotment',
      providesTags: ['Room'],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useGetWantedRoomsQuery,
  useUpdateRoomsWantedByUserMutation,
  useGetProbableRoomsForUserQuery,
  useGetAllotedRoomForUserQuery,
} = roomsApi;
