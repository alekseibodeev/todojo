export type TaskRequestBody = {
  title?: string;
  completed?: boolean;
};

export type TaskQueryParams = {
  taskId: string;
};
