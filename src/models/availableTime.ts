import { Severity, modelOptions, prop } from '@typegoose/typegoose';
import { WeekDay } from './enums';

export class TimeSlot {
  from: { hour: number; minute: number };
  to: { hour: number; minute: number };
}
@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class AvailableTime {
  @prop({ required: true , default:{}})
  weekdays!: Record<WeekDay, TimeSlot>;

  @prop({ required: true, default: 0 })
  limit!: number;

  // constructor(obj?: { weekdays: Record<WeekDay, TimeSlot>; limit?: number }) {
  //   if (obj) {
  //     this.weekdays = obj.weekdays;
  //     if (obj.limit) this.limit = obj.limit;
  //   } else {
  //     this.weekdays = {} as Record<WeekDay, TimeSlot>;
  //   }
  // }
}
