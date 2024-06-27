import server from './app';
import { Server } from 'socket.io';
import PatientModel from './models/patient';
import DoctorModel from './models/doctor';
import jwt from 'jsonwebtoken';
import ChatModel from './models/chat';
import MessageModel from './models/message';
import HttpException from './models/errors';

const key = process.env.JWT_SECRET as jwt.Secret;

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const getAllChats = async (userId: any) => {
  try {
    const patient = await PatientModel.findById(userId);

    const doctor = await DoctorModel.findById(userId);
    if (!doctor && !patient) throw new HttpException(403, 'Forbidden');
    if (patient) {
      const chat = await ChatModel.find({ patient: patient._id });
      return chat || [];
    }
    if (doctor) {
      const chat = await ChatModel.find({ doctor: doctor._id });
      return chat || [];
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

import { IncomingMessage } from 'http';

io.engine.use((req: any, _res: any, next: any) => {
  const isHandshake = req._query.sid === undefined;
  if (!isHandshake) {
    return next();
  }

  const header = req.headers['authorization'];
  console.log('header', header);

  if (!header) {
    return next(new Error('no token'));
  }

  if (!header.startsWith('bearer ')) {
    return next(new Error('invalid token'));
  }

  const token = header.substring(7);

  jwt.verify(token, key, (err: any, decoded: any) => {
    if (err) {
      return next(new Error('invalid token'));
    }
    req.user = { id: decoded._id };
    next();
  });
});

io.on('connection', async (socket) => {
  const req = socket.request as IncomingMessage & { user?: { id: string } };
  const userId = req.user?.id;
  console.log('user connected', socket.id, 'user id:', userId);
  const chatList = await getAllChats(userId);

  if (!chatList) throw new HttpException(404, 'Chat not found');

  chatList.map((chat) => {
    socket.join(chat.roomId);
  });

  socket.on(
    'send message',
    async ({ chatId, message }: { chatId: string; message: string }) => {
      try {
        const chat = await ChatModel.findById(chatId);
        if (!chat) {
          throw new HttpException(404, 'Chat not found');
        }
        const patient = await PatientModel.findById(userId);
        const doctor = await DoctorModel.findById(userId);
        if (!doctor && !patient) {
          throw new HttpException(403, 'Forbidden');
        }
        const newMsg = new MessageModel({
          userId,
          text: message,
        });
        chat.messages.push(newMsg);
        await chat.save();

        io.to(chat.roomId).emit('listen message', newMsg);
      } catch (err) {
        console.error(err);
      }
    },
  );

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});
