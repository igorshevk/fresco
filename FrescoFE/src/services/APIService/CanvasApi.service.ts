import { Observable } from 'rxjs';
import { http } from './http-instance';
import { CanvasInterface, CanvasResponseInterface } from './interfaces';

export class CanvasApiService {
  static create(data: CanvasInterface): Observable<CanvasResponseInterface> {
    return new Observable<CanvasResponseInterface>(subscriber => {
      http
        .request<CanvasResponseInterface>({
          url: 'canvas',
          data: data,
          method: 'POST',
        })
        .then(response => {
          subscriber.next(response.data);
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });
    });
  }

  static getById(id: string): Observable<CanvasResponseInterface> {
    return new Observable<CanvasResponseInterface>(subscriber => {
      http
        .request<CanvasResponseInterface>({
          url: 'canvas/'.concat(id),
          method: 'GET',
        })
        .then(
          response => {
            subscriber.next(response.data);
            subscriber.complete();
          },
          error => {
            subscriber.error(error);
          },
        );
    });
  }

  static getByOrganizationId(
    id: string,
  ): Observable<CanvasResponseInterface[]> {
    return new Observable<CanvasResponseInterface[]>(subscriber => {
      http
        .request<CanvasResponseInterface[]>({
          url: 'canvas/organization/'.concat(id),
          method: 'GET',
        })
        .then(
          response => {
            subscriber.next(response.data);
            subscriber.complete();
          },
          error => {
            subscriber.error(error);
          },
        );
    });
  }

  static updateById(
    id: string,
    data: CanvasInterface,
  ): Observable<CanvasResponseInterface> {
    return new Observable<CanvasResponseInterface>(subscriber => {
      http
        .request<CanvasResponseInterface>({
          url: 'canvas/'.concat(id),
          method: 'PUT',
          data,
        })
        .then(
          response => {
            subscriber.next(response.data);
            subscriber.complete();
          },
          error => {
            subscriber.error(error);
          },
        );
    });
  }

  static deleteById(
    id: string,
    orgId: string,
  ): Observable<CanvasResponseInterface> {
    return new Observable<CanvasResponseInterface>(subscriber => {
      http
        .request<CanvasResponseInterface>({
          url: 'canvas/'.concat(id),
          method: 'DELETE',
          data: { orgId },
        })
        .then(
          response => {
            subscriber.next(response.data);
            subscriber.complete();
          },
          error => {
            subscriber.error(error);
          },
        );
    });
  }
}
