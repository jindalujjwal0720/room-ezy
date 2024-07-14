import api from '.';

const logsApi = api.injectEndpoints({
  endpoints: (logs) => ({
    getActionAuditLogs: logs.query({
      query: ({ offset = 0, limit = 10 }) =>
        `/v1/logs/actions?offset=${offset}&limit=${limit}`,
      providesTags: ['ActionAuditLog'],
    }),
    clearActionAuditLogs: logs.mutation({
      query: () => ({
        url: '/v1/logs/actions/clear',
        method: 'POST',
      }),
      invalidatesTags: ['ActionAuditLog'],
    }),
  }),
});

export const { useGetActionAuditLogsQuery, useClearActionAuditLogsMutation } =
  logsApi;

export default logsApi;
