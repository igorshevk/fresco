/* --- STATE --- */
export interface SignupForInvitationState {
  loading: boolean;
  token: string | null;
}

export type ContainerState = SignupForInvitationState;
