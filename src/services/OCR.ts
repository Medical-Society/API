import axios from 'axios';
import formData from 'form-data';
import fs from 'fs';

// export interface IImgbbResponseObject {
//   data: { url: string };
// }

export class OcrUploader {
  static async upload(imagePath: string): Promise<string> {
    const form = new formData();
    form.append('image', fs.createReadStream(imagePath));

    const res = await axios.post('https://ocr-3nz8.onrender.com/OCR', form);

    return res.data.response;
  }
}
