// src/features/api/watchSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api.service';

export const watchSlice = createApi({
  reducerPath: 'watchSlice',
  baseQuery: axiosBaseQuery(), // Adjust base URL as needed
  endpoints: (builder) => ({
    // Fetch all watch
    getWatch: builder.query({
      query: () => ({
        url: 'watch',
      }),
    }),

    // Fetch a specific watch by ID
    getWatchById: builder.query({
      query: (id) => ({
        url: `watch/${id}`
      })
    }),

    // Create a new watch (POST)
    createWatch: builder.mutation({
      query: (newWatch) => ({
        url: 'watch',
        method: 'POST',
        data: newWatch,
      }),
    }),

    // Update an existing watch (PUT)
    updateWatch: builder.mutation({
      query: ({ id, updatedWatch }) => ({
        url: `watch/${id}`,
        method: 'PUT',
        data: updatedWatch,
      }),
    }),
    // Update an existing watch (PUT)
    postComment: builder.mutation({
      query: ({ id, commentData }) => ({
        url: `watch/${id}/comments`,
        method: 'Post',
        data: commentData,
      }),
    }),

    // Delete a watch (DELETE)
    deleteWatch: builder.mutation({
      query: (id) => ({
        url: `watch/${id}`,
        method: 'DELETE',
      }),
    }),

    // Fetch brand (GET)
    getBrand: builder.query({
      query: () => ({
        url: 'brand',
      }),
    }),

    // Create a new brand (POST)
    createBrand: builder.mutation({
      query: (newBrand) => ({
        url: 'brand',
        method: 'POST',
        data: newBrand,
      }),
    }),

    // Update an existing brand (PUT)
    updateBrand: builder.mutation({
      query: ({ id, updatedBrand }) => ({
        url: `brand/${id}`,
        method: 'PUT',
        data: updatedBrand,
      }),
    }),

    // Delete a brand (DELETE)
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `brand/${id}`,
        method: 'DELETE',
      }),
    }),

    // Create a new comment (POST)
    createComment: builder.mutation({
      query: (newComment) => ({
        url: 'comments',
        method: 'POST',
        data: newComment,
      }),
    }),

    // Update a comment (PUT)
    updateComment: builder.mutation({
      query: ({ id, updatedComment }) => ({
        url: `comments/${id}`,
        method: 'PUT',
        data: updatedComment,
      }),
    }),

    // Delete a comment (DELETE)
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
    }),
    login: builder.mutation({
      query: (formData) => ({
        url: 'user/login',
        method: 'POST',
        data: formData,
      }),
    }),
    register: builder.mutation({
      query: (formData) => ({
        url: 'user/register',
        method: 'POST',
        data: formData,
      }),
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: 'user/updateprofile',
        method: 'POST',
        data: formData,
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: 'user/profile',
      }),
    }),
    getAllUserProfile: builder.query({
      query: () => ({
        url: 'user/allprofile',
      }),
    }),
    updatePassword: builder.mutation({
      query: (formData) => ({
        url: `/user/profile/password`,
        method: 'PUT',
        data: formData,
      }),
    }),
  }),
});

// Export hooks for each mutation and query
export const {
  useGetWatchQuery,
  useGetWatchByIdQuery,
  useCreateWatchMutation,
  useUpdateWatchMutation,
  usePostCommentMutation,
  useDeleteWatchMutation,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useGetAllUserProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation
} = watchSlice;
