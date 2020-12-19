/* --- STATE --- */
interface UserType {
  id: string;
  name: string;
  email: string;
  // TODO: define enum for roles
  role: string;
}

export interface GlobalState {
  token: string | null;
  user: null | UserType;
}

export type ContainerState = GlobalState;
