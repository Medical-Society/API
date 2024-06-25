import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
  Severity,
} from '@typegoose/typegoose';

import { Patient } from './patient';
import { Doctor } from './doctor';
import { Message } from './message';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Chat {
  @prop({ required: true, ref: Patient })
  patient: Ref<Patient>;

  @prop({ required: true, ref: Doctor })
  doctor: Ref<Doctor>;

  @prop({ allowMixed: Severity.ALLOW, required: true })
  messages: Message[];

  @prop({ required: true })
  roomId: string;
}
const ChatModel = getModelForClass(Chat);
export default ChatModel;
