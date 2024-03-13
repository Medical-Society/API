import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
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

  @prop({ type: () => [String], default: [] })
  likes: string[];
}
const PostModel = getModelForClass(Post);
export default PostModel;
