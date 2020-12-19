import { http } from './http-instance';
import { Observable } from 'rxjs';
import { CanvasCategoryInterface } from './interfaces';

export class CanvasCategoryService {
  static list(): Observable<CanvasCategoryInterface[]> {
    return new Observable<CanvasCategoryInterface[]>(observer => {
      http
        .request<CanvasCategoryInterface[]>({
          url: '/category',
          method: 'GET',
        })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error.response);
        });
    });
  }
}
