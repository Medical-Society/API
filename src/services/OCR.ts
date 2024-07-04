import axios from 'axios';
import formData from 'form-data';
import fs from 'fs';
import HttpException from '../models/errors';

// export interface IImgbbResponseObject {
//   data: { url: string };
// }

export class OcrUploader {
  static async upload(imagePath: string): Promise<string> {
    try {
      const form = new formData();
      form.append('image', fs.createReadStream(imagePath));

      const res = await axios.post(process.env.API_OCR as string, form);

      return res.data.response;
    } catch (err) {
      console.log('OCR API error', err);
      throw new HttpException(500, 'OCR API error');
    }
  }
}
