import { NextFunction, Request, Response } from 'express';
import {
  GetLikesPostParamsInput,
  LikePatientPostBodyInput,
  LikePatientPostParamsInput,
} from '../schema/like';
import {
  getLikesOfpostByPostId,
  patientLikeOrUnlikePost,
} from '../services/like';

export const LikeOrUnlike = async (
  req: Request<LikePatientPostParamsInput, {}, LikePatientPostBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await patientLikeOrUnlikePost(
      req.body.auth.patientId,
      req.params.postId,
    );
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};
export const GetLikesOfPost = async (
  req: Request<GetLikesPostParamsInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getLikesOfpostByPostId(req.params.postId);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};
