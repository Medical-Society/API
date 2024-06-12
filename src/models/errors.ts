export default class HttpException extends Error {
  readonly status = 'fail';
  constructor(
    public statusCode: number = 500,
    message: string = 'Internal server error',
    public errors: string[] = [],
  ) {
    super(message);
    if (errors.length === 0) {
      this.errors.push(message);
    }
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
