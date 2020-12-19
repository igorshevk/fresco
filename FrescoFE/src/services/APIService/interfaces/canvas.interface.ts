export interface CanvasInterface {
  name: string;
  orgId: string;
  data: string;
  categoryId: string;
  imageId?: string;
  createdAt?: string;
  users?: any[];
}

export interface CanvasResponseInterface extends CanvasInterface {
  createdUserId: 'e140c36a-5b68-436c-951f-50fc9cd55ba7';
  id: 'e8e348aa-4ddf-4499-b28d-5b0f0c686658';
  path?: string;
}
