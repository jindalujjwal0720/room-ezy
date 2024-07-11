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
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'GET',
      }),
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
    }),
    me: builder.query({
      query: () => ({
        url: '/v1/auth/me',
        method: 'GET',
      }),
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
