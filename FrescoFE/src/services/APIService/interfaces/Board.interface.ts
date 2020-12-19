export interface BoardRequestInterface {
  name: string;
  orgId: string;
  categoryId?: string;
  data: string;
  imageId?: string;
}

export interface BoardInterface extends BoardRequestInterface {
  id: string;
  createdUserId: string;
  path?: string;
}

export interface BoardResponseInterface extends BoardInterface {}
