import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { Patient } from './patient';
import { Post } from './post';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Comment {
  @prop()
  text: string;

  @prop({ ref: Patient })
  patient: Ref<Patient>;

  @prop({ ref: Post })
  post: Ref<Post>;
}

const CommentModel = getModelForClass(Comment);
export default CommentModel;
