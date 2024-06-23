import {
  prop,
  getModelForClass,
  modelOptions,
  type Ref,
} from '@typegoose/typegoose';
import { Doctor } from './doctor';
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Post {
  @prop({ ref: Doctor })
  doctor: Ref<Doctor>;

  @prop()
  description: string;

  @prop({ type: () => [String] })
  images: string[];
}
const PostModel = getModelForClass(Post);
export default PostModel;
