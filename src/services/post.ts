import CommentModel from '../models/comment';
import HttpException from '../models/errors';
import PostModel from '../models/post';
import { GetPostsQueryInput } from '../schema/post';

export const CreatePost = async (
  doctorId: string,
  description: string,
  images: string[] | undefined,
) => {
  const post = new PostModel({ doctor: doctorId, description, images });
  await post.save();
  return post;
};

export const findPosts = async (
  doctorId: string,
  query: GetPostsQueryInput,
) => {
  let { page = 1, limit = 20 } = query;
  const posts = await PostModel.find({ doctor: doctorId });

  const count = posts.length;
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const result = posts.slice(skip, skip + limit);

  return {
    length: result.length,
    posts: result,
    totalPages,
    currentPage,
  };
};

export const findPostByIdAndDelete = async (
  doctorId: string,
  postId: string,
) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'post not found');
  }
  if (!post.doctor._id.equals(doctorId)) {
    throw new HttpException(403, 'You are not allowed to Update this post', [
      'You are not allowed to Update this post',
    ]);
  }
  await post.save();
  await CommentModel.deleteMany({ post: postId });
  return await PostModel.findByIdAndDelete(postId);
};

export const findPostByIdAndUpdate = async (
  doctorId: string,
  description: string | undefined,
  images: string[] | undefined,
  postId: string,
) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }
  if (!post.doctor._id.equals(doctorId)) {
    throw new HttpException(403, 'You are not allowed to Update this post', [
      'You are not allowed to Update this post',
    ]);
  }
  if (description) {
    post.description = description;
  }
  if (images) {
    post.images = images;
  }
  await post.save();
  return post;
};
