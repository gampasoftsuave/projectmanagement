import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ProjectForm,
  Project,
  ProjectQueryParams,
} from "@/interface/interface";
import { PROJECTS_API } from "@/constants/api";
import { buildProjectsUrl } from "./utils";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  }),
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    addProject: builder.mutation<Project, ProjectForm>({
      query: (body) => ({
        url: PROJECTS_API,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
    getProjects: builder.query<
      { projects: Project[]; total: number },
      ProjectQueryParams
    >({
      query: (params) => {
        return { url: buildProjectsUrl(PROJECTS_API, params) };
      },
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => ({ url: `${PROJECTS_API}/${id}` }),
      providesTags: ["Project"],
    }),
    updateProject: builder.mutation<
      Project,
      { id: string; update: Partial<Project> }
    >({
      query: ({ id, update }) => ({
        url: `${PROJECTS_API}/${id}`,
        method: "PUT",
        body: update,
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${PROJECTS_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useAddProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
