/* --- STATE --- */
export interface SignupState {
  loading: boolean;
  token: string | null;
  errorCode: number | null;
}

export type ContainerState = SignupState;
