import { Observable } from 'rxjs';
import { http } from './http-instance';
import { MessagesInterface } from './interfaces/MessagesInterface';

export class MessagesApiService {
  static AllMessages(id): any {
    return new Observable<MessagesInterface>(subscriber => {
      http
        .request<any>({
          url: `/message/${id}`,
          method: 'GET',
        })
        .then(response => {
          subscriber.next(response.data);
        })
        .catch(error => {
          subscriber.error(error.data);
        });
    });
  }

  static postMessage(message, boardId): any {
    return new Observable<any>(subscriber => {
      http
        .request<any>({
          url: '/message',
          method: 'POST',
          data: {
            boardId: boardId,
            message: message,
          },
        })
        .then(response => {
          subscriber.next(response.data);
        })
        .catch(error => {
          subscriber.error(error.data);
        });
    });
  }
}
