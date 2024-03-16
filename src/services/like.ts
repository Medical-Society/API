import HttpException from '../models/errors';
import LikeModel from '../models/like';
import PostModel from '../models/post';

export const patientLikeOrUnlikePost = async (patientId: any, postId: any) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }

  const like = await LikeModel.find({ patient: patientId });
  console.log(like);
  if (like.length == 1) {
    await LikeModel.deleteOne({ patient: patientId });
    return 'you unlike this post';
  }

  const newLike = new LikeModel({ patient: patientId, post: postId });

  await newLike.save();

  return newLike;
};

export const getLikesOfpostByPostId = async (postId: any) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HttpException(404, 'Post not found', ['post not found']);
  }
  const likes = await LikeModel.find({ post: postId });
  return {
    length: likes.length,
    likes,
  };
};
