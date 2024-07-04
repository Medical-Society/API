import { FilterQuery } from 'mongoose';
import ChatModel, { Chat } from '../models/chat';
import DoctorModel from '../models/doctor';
import HttpException from '../models/errors';
import PatientModel from '../models/patient';
import jwt from 'jsonwebtoken';

import {
  GetChatByIdSchemaBody,
  GetChatByIdSchemaParams,
  GetChatSchemaBody,
} from '../schema/chat';
import MessageModel, { Message } from '../models/message';
const key = process.env.JWT_SECRET as string;

export const createChats = async (appointment: any) => {
  if (appointment.status === 'FINISHED') {
    const filterChat: FilterQuery<Chat> = {
      patient: appointment.patient,
      doctor: appointment.doctor,
    };
    const existChat = await ChatModel.find(filterChat);
    if (existChat.length === 0) {
      const room = jwt.sign(
        { patient: appointment.patient._id, doctor: appointment.doctor._id },
        key,
      );
      const doctor = await DoctorModel.findById(appointment.doctor);

      const entryMessage = await MessageModel.create({
        userId: appointment.doctor,
        text: `You can start chatting with Dr. ${doctor.englishFullName} now.`,
        seen: false,
      });
      await ChatModel.create({
        patient: appointment.patient,
        doctor: appointment.doctor,
        roomId: room,
        messages: [entryMessage],
      });
    }
  }
};

export const getChats = async (body: GetChatSchemaBody) => {
  const doctor = await DoctorModel.findById(body.auth.id);
  const patient = await PatientModel.findById(body.auth.id);

  if (!doctor && !patient) {
    throw new HttpException(403, 'Forbidden', ['Forbidden']);
  }
  let filter: any = {};
  if (doctor) {
    filter = { doctor: body.auth.id };
  }
  if (patient) {
    filter = { patient: body.auth.id };
  }

  const chats = await ChatModel.find(filter)
    .populate('patient', '-password')
    .populate('doctor', '-password')
    .select('-roomId')
    .exec();

  return {
    length: chats.length,
    chats,
  };
};

export const getChatById = async (
  body: GetChatByIdSchemaBody,
  params: GetChatByIdSchemaParams,
) => {
  const doctor = await DoctorModel.findById(body.auth.id);
  const patient = await PatientModel.findById(body.auth.id);
  const chat = await ChatModel.findById(params.chatId);
  if (!doctor && !patient) {
    throw new HttpException(403, 'Forbidden', ['Forbidden']);
  }
  if (!chat) {
    throw new HttpException(404, 'Not Found', ['Chat not found']);
  }
  if (
    !chat.doctor._id.equals(doctor?.id) &&
    !chat.patient._id.equals(patient?.id)
  ) {
    throw new HttpException(403, 'Forbidden', ['Forbidden']);
  }

  const updateQuery = { 'messages.$[elem].seen': true };
  const arrayFilters = [{ 'elem.userId': { $ne: body.auth.id } }];

  await ChatModel.updateMany(
    { _id: params.chatId },
    { $set: updateQuery },
    { arrayFilters },
  );

  const updatedChat = await ChatModel.findById(params.chatId)
    .populate('patient', '-password')
    .populate('doctor', '-password')
    .select('-roomId')
    .exec();

  return updatedChat;
};
