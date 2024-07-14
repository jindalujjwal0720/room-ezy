import api from '.';

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: {
          email,
          otp,
        },
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'GET',
      }),
      invalidatesTags: ['User', 'Building', 'BuildingBlock', 'Floor', 'Room'],
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/v1/auth/refresh',
        method: 'GET',
      }),
    }),
    sendLoginOTP: builder.mutation({
      query: ({ email }) => ({
        url: '/v1/auth/send-login-otp',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ name, admissionNumber }) => ({
        url: '/v1/auth/update-user',
        method: 'PATCH',
        body: {
          name,
          admissionNumber,
        },
      }),
      invalidatesTags: ['User'],
    }),
    me: builder.query({
      query: () => ({
        url: '/v1/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useSendLoginOTPMutation,
  useUpdateUserMutation,
  useMeQuery,
} = authApi;

export default authApi;
