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
      invalidatesTags: ['Building'],
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
      invalidatesTags: ['Building', 'Block', 'Floor'],
    }),
  }),
});

export const {
  useGetBuildingsQuery,
  useGetBuildingQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
} = buildingsApi;
