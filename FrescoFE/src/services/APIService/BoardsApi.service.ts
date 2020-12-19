import { Observable } from 'rxjs';
import { http } from './http-instance';
import {
  BoardInterface,
  BoardResponseInterface,
} from './interfaces/Board.interface';

export class BoardApiService {
  static create(data: BoardInterface): Observable<BoardResponseInterface> {
    return new Observable<BoardResponseInterface>(subscriber => {
      http
        .request({
          url: 'board',
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

  static getById(id: string): Observable<BoardResponseInterface> {
    return new Observable<BoardResponseInterface>(subscriber => {
      http
        .request<BoardResponseInterface>({
          url: 'board/'.concat(id),
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

  static getByOrganizationId(id: string): Observable<BoardResponseInterface[]> {
    return new Observable<BoardResponseInterface[]>(subscriber => {
      http
        .request<BoardResponseInterface[]>({
          url: 'board/organization/'.concat(id),
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
    data: BoardInterface,
  ): Observable<BoardResponseInterface> {
    return new Observable<BoardResponseInterface>(subscriber => {
      http
        .request<BoardResponseInterface>({
          url: 'board/'.concat(id),
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
  ): Observable<BoardResponseInterface> {
    return new Observable<BoardResponseInterface>(subscriber => {
      http
        .request<BoardResponseInterface>({
          url: 'board/'.concat(id),
          method: 'DELETE',
          data: {
            orgId,
          },
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
