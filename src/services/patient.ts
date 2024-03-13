import { FilterQuery, ProjectionType } from 'mongoose';
import PatientModel, { Patient } from '../models/patient';
import CommentModel from '../models/comment';
import PostModel from '../models/post';
import HttpException from '../models/errors';
import { GetAllPatientInput } from '../schema/patient';
export const findPatientByEmail = (email: string) => {
  return PatientModel.findOne({ email });
};

export const createPatient = (patient: any) => {
  return PatientModel.create(patient);
};
export const findPatientById = (
  id: string,
  projection: ProjectionType<Patient> = {},
) => {
  return PatientModel.findById(id, projection);
};
export const findPatientsPagination = async (
  filter: FilterQuery<Patient>,
  query: GetAllPatientInput,
) => {
  let { page = 1, limit = 20 } = query;
  const count = await PatientModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const patients = await PatientModel.find(
    {},
    { password: 0 },
    { limit, skip, sort: { createdAt: -1 } },
  );

  return {
    length: patients.length,
    patients,
    totalPages,
    currentPage,
  };
};

export const findPatientByIdAndUpdate = (
  id: string,
  update: any,
  options: any = { new: true },
) => {
  return PatientModel.findByIdAndUpdate(id, update, options);
};

export const findPatientByIdAndDelete = async (patientId: any) => {
  const patient = await PatientModel.findById(patientId);
  if (!patient) {
    throw new HttpException(400, 'Patient not Found', [
      'patient does not exist',
    ]);
  }

  await CommentModel.deleteMany({ patientId });

  await PostModel.updateMany({}, { $pull: { likes: patientId } });
  await PostModel.updateMany({}, { $pull: { comments: { patientId } } });

  await PatientModel.findByIdAndDelete(patientId);
};

export const createPatientComment = async (
  patientId: string,
  postId: string,
  text: string,
) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post Not found you can not commit to it', [
      'post not found you can not commit to it',
    ]);
  }
  const comment = new CommentModel({ patient: patientId, post: postId, text });
  await comment.save();
  return comment;
};

export const findCommentByIdAndDelete = async (
  patientId: string,
  commentId: any,
) => {
  const comment = await CommentModel.findById(commentId);
  const post = await PostModel.findById(comment?.post._id);
  if (!comment) {
    throw new HttpException(404, 'Comment not found', ['comment not found']);
  }
  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }
  if (!comment.patient._id.equals(patientId)) {
    throw new HttpException(404, 'You are not allowed to delete this comment', [
      'You are not allowed to delete this comment',
    ]);
  }

  await CommentModel.findByIdAndDelete(commentId);
  return comment;
};

export const editPatientComment = async (
  patientId: any,
  text: string,
  commentId: any,
) => {
  const comment = await CommentModel.findById(commentId);
  const post = await PostModel.findById(comment?.post._id);
  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }
  if (!comment) {
    throw new HttpException(404, 'Comment not found', ['comment not found']);
  }
  if (!comment.patient._id.equals(patientId)) {
    throw new HttpException(404, 'You are not allowed to edit this comment', [
      'You are not allowed to edit this comment',
    ]);
  }

  comment.text = text;
  await comment.save();

  return comment;
};

export const LikePatientPost = async (patientId: any, postId: any) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }
  if (post.likes.includes(patientId)) {
    throw new HttpException(400, 'Post already liked by you', [
      'Post already liked by you',
    ]);
  }
  post.likes.push(patientId);
  await post.save();
  return post.likes;
};

export const unlikePatientPost = async (patientId: any, postId: any) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }
  if (!post.likes.includes(patientId)) {
    throw new HttpException(400, 'you did not like it', [
      'you did not like it',
    ]);
  }
  post.likes = post.likes.filter((id) => id !== patientId);
  await post.save();
};
