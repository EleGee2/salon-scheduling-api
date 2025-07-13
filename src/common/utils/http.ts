interface Meta {
  paging?: Paging | null;
}

interface Paging {
  page: number;
  pages: number;
  size: number;
  total: number;
}

interface Error {
  message: string;
  field?: string;
  value?: unknown;
}

interface ResponseObject<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Meta;
  errors?: Error[];
}

abstract class BaseResponseObject implements ResponseObject {
  constructor(
    public success: boolean,
    public message: string,
  ) {}
}

export class SuccessResponseObject<T = unknown> extends BaseResponseObject {
  constructor(
    message: string,
    public data: T,
  ) {
    super(true, message);
  }
}

export class PaginatedSuccessResponseObject<T = unknown> extends SuccessResponseObject<T> {
  public meta: Meta;

  constructor(message: string, data: T, paging: Paging) {
    super(message, data);
    this.meta = { paging };
  }
}

export class ErrorResponseObject extends BaseResponseObject {
  constructor(
    public message: string,
    public errors: Error[] = [],
  ) {
    super(false, message);
  }
}
