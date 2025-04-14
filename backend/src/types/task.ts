export type TaskRequestBody = {
  title?: string;
  completed?: boolean;
};

export type TaskRequestParams = {
  taskId: string;
};
