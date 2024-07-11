import api from '.';

const blocksApi = api.injectEndpoints({
  endpoints: (blocks) => ({
    getBlocks: blocks.query({
      query: (buildingId) => `/v1/blocks?building=${buildingId}`,
      providesTags: ['Block'],
    }),
    getBlock: blocks.query({
      query: (id) => `/v1/blocks/${id}`,
      providesTags: ['Block'],
    }),
    createMultipleBlocks: blocks.mutation({
      query: ({ buildingId, count }) => ({
        url: '/v1/blocks/multiple',
        method: 'POST',
        body: { buildingId, count },
      }),
      invalidatesTags: ['Block'],
    }),
    updateBlock: blocks.mutation({
      query: ({ id, block }) => ({
        url: `/v1/blocks/${id}`,
        method: 'PATCH',
        body: block,
      }),
      invalidatesTags: ['Block'],
    }),
    deleteBlock: blocks.mutation({
      query: ({ id }) => ({
        url: `/v1/blocks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Block', 'Floor'],
    }),
  }),
});

export const {
  useGetBlocksQuery,
  useGetBlockQuery,
  useCreateMultipleBlocksMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
} = blocksApi;
