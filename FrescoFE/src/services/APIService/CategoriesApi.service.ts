import { Observable } from 'rxjs';
import { http } from './http-instance';
import {
  CategoryInterface,
  CategoryResponseInterface,
} from './interfaces/category.interface';

export class CategoriesApiService {
  static create(
    data: CategoryInterface,
  ): Observable<CategoryResponseInterface> {
    return new Observable<CategoryResponseInterface>(subscriber => {
      http
        .request<CategoryResponseInterface>({
          url: 'category',
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

  static getById(id: string): Observable<CategoryResponseInterface> {
    return new Observable<CategoryResponseInterface>(subscriber => {
      http
        .request<CategoryResponseInterface>({
          url: 'category/'.concat(id),
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

  static getAllCategories(): Observable<CategoryResponseInterface[]> {
    return new Observable<CategoryResponseInterface[]>(subscriber => {
      http
        .request<CategoryResponseInterface[]>({
          url: 'category',
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
    data: CategoryInterface,
  ): Observable<CategoryResponseInterface> {
    return new Observable<CategoryResponseInterface>(subscriber => {
      http
        .request<CategoryResponseInterface>({
          url: 'category/'.concat(id),
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

  static deleteById(id: string): Observable<CategoryResponseInterface> {
    return new Observable<CategoryResponseInterface>(subscriber => {
      http
        .request<CategoryResponseInterface>({
          url: 'category/'.concat(id),
          method: 'DELETE',
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
