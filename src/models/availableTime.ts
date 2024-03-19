import { Severity, modelOptions, prop } from '@typegoose/typegoose';
import { WeekDay } from './enums';

export class TimeSlot {
  from: { hour: number; minute: number };
  to: { hour: number; minute: number };
}

@modelOptions({
  schemaOptions: { timestamps: true, minimize: false },
  options: { allowMixed: Severity.ALLOW },
})
export class AvailableTime {
  @prop({ required: true, default: {} })
  weekdays!: Record<WeekDay, TimeSlot>;

  @prop({ required: true, default: 4 })
  limit!: number;
}
