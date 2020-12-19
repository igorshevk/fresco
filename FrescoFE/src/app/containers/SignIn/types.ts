/* --- STATE --- */
export interface SignInState {
  loading: boolean;
  error: string;
  user: Object;
}

export type ContainerState = SignInState;
