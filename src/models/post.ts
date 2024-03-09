import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { Comment } from './comment';
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Post {
  @prop()
  doctorId: string;

  @prop()
  description: string;

  @prop({ type: () => [String] })
  images: string[];

  @prop({ type: () => Comment, ref: Comment, default: [] })
  comments: Ref<Comment>[];

  @prop({ type: () => [String], default: [] })
  likes: string[];
}
const PostModel = getModelForClass(Post);
export default PostModel;
