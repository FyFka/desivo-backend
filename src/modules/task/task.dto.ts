export interface ISubscribeDTO {
  projectId: string;
}

export interface IUnsubscribeDTO {
  projectId: string;
}

export interface IColumnsDTO {
  projectId: string;
}

export interface IColumnDTO {
  projectId: string;
  name: string;
  color: string;
}

export interface IDeleteColumnDTO {
  columnId: string;
}

export interface IUpdateTaskDTO {
  taskId: string;
  columnId: string;
  title: string;
  description: string;
}

export interface ICreateLabelDTO {
  taskId: string;
  columnId: string;
  name: string;
  color: string;
}

export interface IDeleteTaskDTO {
  columnId: string;
  taskId: string;
}

export interface ICreateTaskDTO {
  columnId: string;
  title: string;
  description: string;
}

export interface IZippedProjectDTO {
  projectId: string;
  zippedColumns: { columnId: string; order: string[] }[];
}
