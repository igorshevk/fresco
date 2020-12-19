/* --- STATE --- */
export interface BoardListState {
  loading: boolean;
  boardList: Array<any>;
}

export type ContainerState = BoardListState;
