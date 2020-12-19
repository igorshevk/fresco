import { http } from './http-instance';
import { Observable } from 'rxjs';
import { OrganizationInterface } from './interfaces/Organization.interface';

export class OrganizationsApiService {
  static list(): Observable<OrganizationInterface> {
    return new Observable<OrganizationInterface>(subscriber => {
      http
        .request<OrganizationInterface>({
          url: '/organization',
          method: 'GET',
        })
        .then(response => {
          subscriber.next(response.data);
        })
        .catch(error => {
          subscriber.error(error.response);
        });
    });
  }
}
