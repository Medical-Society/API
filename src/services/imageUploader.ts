import axios from 'axios';
import formData from 'form-data';
import fs from 'fs';

export interface IImgbbResponseObject {
  data: { url: string };
}

export class ImageUploader {
  static async upload(imagePath: string): Promise<string> {
    const form = new formData();
    form.append('key', process.env.IMGBB_KEY);
    form.append('image', fs.createReadStream(imagePath));

    const res = await axios.post<IImgbbResponseObject>(
      'https://api.imgbb.com/1/upload',
      form,
    );
    return res.data.data.url;
  }
}
