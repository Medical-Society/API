export default class HttpException extends Error {
  readonly status = 'error';
  constructor(
    public statusCode: number = 500,
    message: string = 'Something went wrong',
    public errors: string[] = ['Internal server error'],
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
