import { http } from './APIService/http-instance';

export function resendConfirmationEmail(email: string): Promise<any> {
  return http.request({
    method: 'POST',
    url: '/auth/resendConfirmationEmail',
    data: {
      email,
    },
  });
}
