/* --- STATE --- */
export interface DashboardState {
  loading: boolean;
  listEmail: Array<any>;
  linkInvitation: string;
}

export type ContainerState = DashboardState;
