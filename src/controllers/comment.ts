import { NextFunction, Request, Response } from 'express';
import {
  CreateCommentBodyInput,
  CreateCommentParamsInput,
  DeleteCommentBodyInput,
  DeleteCommentParamsInput,
  EditCommentBodyInput,
  EditCommentParamsInput,
  GetCommentParamsInput,
} from '../schema/comment';
import {
  createPatientComment,
  editPatientComment,
  findCommentByIdAndDelete,
  getCommentsByPostId,
} from '../services/comment';

export const createComment = async (
  req: Request<CreateCommentParamsInput, {}, CreateCommentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {

    const comment = await createPatientComment(
      req.body.auth.patientId,
      req.body.text,
      req.params.postId,
    );
    return res.status(200).json({
      status: 'success',
      comment,
    });
  } catch (err: any) {
    next(err);
  }
};
export const getComments = async(
  req:Request<GetCommentParamsInput>,
  res:Response,
  next:NextFunction

)=>{
  try{
    const comments = await getCommentsByPostId(
      req.params.postId
    );
    return res.status(200).json({
      status:'success',
      comments
    })
  }catch(err:any)
  {
    next(err);
  }
}

export const deleteComment = async (
  req: Request<DeleteCommentParamsInput, {}, DeleteCommentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await findCommentByIdAndDelete(
      req.body.auth.patientId,
      req.params.commentId,
      req.params.postId,
    );
    return res.status(204).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};

export const editComment = async (
  req: Request<EditCommentParamsInput, {}, EditCommentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment = await editPatientComment(
      req.body.auth.patientId,
      req.body.text,
      req.params.commentId,
      req.params.postId,
    );
    res.status(200).json({
      status: 'success',
      comment,
    });
  } catch (err: any) {
    next(err);
  }
};
