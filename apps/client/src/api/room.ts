import api from '.';

const roomsApi = api.injectEndpoints({
  endpoints: (rooms) => ({
    getRooms: rooms.query({
      query: (floorId) => `/v1/rooms?floor=${floorId}`,
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
  }),
});

export const {
  useGetRoomsQuery,
  useGetWantedRoomsQuery,
  useUpdateRoomsWantedByUserMutation,
} = roomsApi;
