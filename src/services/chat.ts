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
  GetChatSchemaQuery,
} from '../schema/chat';
const key = process.env.JWT_SECRET as string;

export const createChats = async (appointment: any) => {
  if (appointment.status === 'FINISHED') {
    const filterChat: FilterQuery<Chat> = {
      patient: appointment.patient,
      doctor: appointment.doctor,
    };
    const existChat = await ChatModel.find(filterChat);
    console.log('existchat', existChat);
    if (existChat.length === 0) {
      const room = jwt.sign(
        { patient: appointment.patient._id, doctor: appointment.doctor._id },
        key,
      );
      await ChatModel.create({
        patient: appointment.patient,
        doctor: appointment.doctor,
        roomId: room,
      });
    }
  }
};

export const getChats = async (
  body: GetChatSchemaBody,
  query: GetChatSchemaQuery,
) => {
  const doctor = await DoctorModel.findById(body.auth.id);
  const patient = await PatientModel.findById(body.auth.id);

  const { page = 1, limit = 50 } = query;

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

  const count = await ChatModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);

  const chats = await ChatModel.find(filter)
    // .select('-roomId')
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    length: chats.length,
    chats,
    totalPages,
    currentPage,
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

  const updatedChat = await ChatModel.findById(params.chatId);

  return updatedChat;
};
