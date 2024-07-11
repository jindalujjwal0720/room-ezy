import api from '.';

const floorsApi = api.injectEndpoints({
  endpoints: (floors) => ({
    getFloors: floors.query({
      query: (blockId) => `/v1/floors?block=${blockId}`,
      providesTags: ['Floor'],
    }),
    getFloor: floors.query({
      query: (id) => `/v1/floors/${id}`,
      providesTags: ['Floor'],
    }),
    createMultipleFloors: floors.mutation({
      query: ({ blockId, count, mapType, namingConvention, roomsCount }) => ({
        url: '/v1/floors/multiple',
        method: 'POST',
        body: {
          blockId,
          count,
          mapType,
          namingConvention,
          roomsCount,
        },
      }),
      invalidatesTags: ['Floor', 'Room'],
    }),
    updateFloor: floors.mutation({
      query: ({ id, floor }) => ({
        url: `/v1/floors/${id}`,
        method: 'PATCH',
        body: floor,
      }),
      invalidatesTags: ['Floor', 'Room'],
    }),
    deleteFloor: floors.mutation({
      query: ({ id }) => ({
        url: `/v1/floors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Floor', 'Room'],
    }),
  }),
});

export const {
  useGetFloorsQuery,
  useGetFloorQuery,
  useCreateMultipleFloorsMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,
} = floorsApi;
