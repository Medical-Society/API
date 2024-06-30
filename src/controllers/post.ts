import { Request, Response, NextFunction } from 'express';
import {
  CreatePostInput,
  CreatePostParamsInput,
  DeletePostBodyInput,
  DeletePostParamsInput,
  GetPostsParamsInput,
  GetPostsQueryInput,
  UpdatePostBodyInput,
  UpdatePostParamsInput,
} from '../schema/post';
import {
  CreatePost,
  findPostByIdAndDelete,
  findPostByIdAndUpdate,
  findPosts,
} from '../services/post';
import HttpException from '../models/errors';

export const getDoctorPosts = async (
  req: Request<GetPostsParamsInput, {}, {}, GetPostsQueryInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await findPosts(req.params.doctorId, req.query);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const createPost = async (
  req: Request<CreatePostParamsInput, {}, CreatePostInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body.auth.doctorId != req.params.doctorId)
      throw new HttpException(403, 'Forbidden', [
        'You are not allowed to create a post for another doctor',
      ]);
    const post = await CreatePost(
      req.body.auth.doctorId,
      req.body.description,
      req.body.images,
    );

    return res.status(201).json({
      status: 'success',
      data: { post },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deletePost = async (
  req: Request<DeletePostParamsInput, {}, DeletePostBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body.auth.doctorId != req.params.doctorId)
      throw new HttpException(403, 'Forbidden', [
        'You are not allowed to delete a post for another doctor',
      ]);
    const post = await findPostByIdAndDelete(
      req.body.auth.doctorId,
      req.params.postId,
    );

    return res.status(204).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};

export const updatePost = async (
  req: Request<UpdatePostParamsInput, {}, UpdatePostBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body.auth.doctorId != req.params.doctorId)
      throw new HttpException(403, 'Forbidden', [
        'You are not allowed to update a post for another doctor',
      ]);
    const post = await findPostByIdAndUpdate(
      req.body.auth.doctorId,
      req.body.description,
      req.body.images,
      req.params.postId,
    );
    return res.status(200).json({
      status: 'success',
      post,
    });
  } catch (err: any) {
    next(err);
  }
};
