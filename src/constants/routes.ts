export const ROUTES = {
  PROJECTS: "/projects",
  ADD_PROJECT: "/projects/add",
  EDIT_PROJECT: (id: string) => `/projects/edit/${id}`,
  PROJECT_DETAILS: (id: string) => `/projects/${id}`,
};
