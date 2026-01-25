export type ResponseType<T = any> = {
  success: true | false;
  message?: string;
  username?: string;
  email?: string;
  id?: string;
  data?: T;
  [key: string]: any;
};
