export default class HttpException extends Error {
  readonly status = 'fail';
  constructor(
    public statusCode: number = 500,
    message: string = 'Internal server error',
    public errors: string[] = ['Something went wrong'],
  ) {
    super(message);
  }

  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}
