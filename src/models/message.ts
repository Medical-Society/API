import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Message {
  @prop({ required: true })
  userId: string;

  @prop({ required: true })
  text: string;

  @prop({ default: false, required: true })
  seen: boolean;

  @prop({ default: new Date() })
  createdAt?: Date;
}
const MessageModel = getModelForClass(Message);
export default MessageModel;
