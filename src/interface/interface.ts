export type ProjectForm = Pick<Project, "name" | "description" | "status">;

export type ProjectQueryParams = {
  page: number;
  limit: number;
  status: string;
  sort: string;
};

export type StatusDropdownProps = {
  value: string;
  onChange: (val: string) => void;
  options?: string[];
};

export type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
};

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  createdAt?: string;
  updatedAt?: string;
}
