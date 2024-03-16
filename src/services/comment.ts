import CommentModel from '../models/comment';
import HttpException from '../models/errors';
import PostModel from '../models/post';

export const createPatientComment = async (
  patientId: any,
  text: any,
  postId: any,
) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post Not found you can not commit to it', [
      'post not found you can not commit to it',
    ]);
  }

  const comment = new CommentModel({
    patient: patientId,
    text: text,
    post: postId,
  });
  await comment.save();
  return comment;
};
export const getCommentsByPostId = async (postId: string) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post Not found ', ['post not found ']);
  }
  const comments = await CommentModel.find({ post: postId });
  if (!comments) {
    return [];
  }
  return comments;
};

export const findCommentByIdAndDelete = async (
  patientId: string,
  commentId: any,
  postId: string,
) => {
  const comment = await CommentModel.findById(commentId);

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }
  if (!comment) {
    throw new HttpException(404, 'Comment not found', ['comment not found']);
  }
  if (!comment.patient._id.equals(patientId)) {
    throw new HttpException(404, 'You are not allowed to delete this comment', [
      'You are not allowed to delete this comment',
    ]);
  }

  await CommentModel.findByIdAndDelete(commentId);
};

export const editPatientComment = async (
  patientId: any,
  text: string,
  commentId: any,
  postId: any,
) => {
  const comment = await CommentModel.findById(commentId);

  const post = await PostModel.findById(postId);

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
