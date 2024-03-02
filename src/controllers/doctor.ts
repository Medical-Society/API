// Third party modules
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

// local modules
import { Status } from '../models/enums';
import { NextFunction, Request, Response } from 'express';
import {
  ChangeDoctorStatusInput,
  DeleteDoctorInput,
  DeleteMyDoctorInput,
  ForgotPasswordDoctorInput,
  GetDoctorInput,
  LoginDoctorInput,
  ResetPasswordDoctorInput,
  SignupDoctorInput,
  UpdateDoctorInput,
  UpdateDoctorPasswordInput,
  VerifyDoctorInput,
  SearchDoctorInput,
  DeletePostParamsInput,
  DeletePostBodyInput,
  CreatePostInput,
  GetPostByIdInput,
} from '../schema/doctor';
import {
  createDoctor,
  findDoctorByEmail,
  findDoctorById,
  findDoctorByIdAndDelete,
  findDoctorByIdAndUpdate,
  findDoctor,
  addReviewForDoctorById,
  findDoctorReviewsById,
  findDoctorByIdAndCreatePost,
  findPostAndDeleteById,
  findPostById,
} from '../services/doctor';
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from '../services/mailing';
import {
  AddReviewBodyInput,
  AddReviewParamsInput,
  GetReviewsParamsInput,
  GetReviewsQueryInput,
} from '../schema/review';
import { SaveImageInput } from '../schema/customZod';
import HttpException from '../models/errors';

const key: string = process.env.JWT_SECRET as string;

export const signup = async (
  req: Request<{}, {}, SignupDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await createDoctor(req.body);
    const token = jwt.sign({ _id: doctor._id }, key, { expiresIn: '15m' });
    sendVerificationEmail(doctor.email, token, 'doctors');
    res.status(201).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} signed up successfully, Please verify your email`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (
  req: Request<{}, {}, LoginDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorByEmail(req.body.email);
    if (!doctor) {
      throw new HttpException(400, 'Invalid email or password', [
        'Email or password is incorrect',
      ]);
    }
    // console.log(doctor.password);
    const isMatch = await doctor.comparePassword(req.body.password);
    if (!isMatch) {
      throw new HttpException(400, 'Invalid email or password', [
        'Email or password is incorrect',
      ]);
    }

    if (!doctor.isVerified) {
      throw new HttpException(400, 'Please verify your email', [
        'Please verify your email',
      ]);
    }

    if (doctor.status !== Status.ACCEPTED) {
      throw new HttpException(400, 'Your account is not accepted yet', [
        'Your account is not accepted yet',
      ]);
    }
    const token = jwt.sign({ _id: doctor._id }, key);
    const { password: _, ...result } = doctor.toObject();
    res.status(200).json({
      status: 'success',
      data: { token, result },
    });
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request<{}, {}, VerifyDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const decoded = jwt.verify(req.body.token, key) as JwtPayload;
    const doctor = await findDoctorById(decoded._id);
    if (!doctor) {
      throw new HttpException(400, 'Invalid token', ['Invalid token']);
    }
    if (doctor.isVerified) {
      throw new HttpException(400, 'Email already verified', [
        'Email already verified',
      ]);
    }
    doctor.isVerified = true;
    await doctor.save();
    res.status(200).json({
      status: 'success',
      data: { message: 'Email verified successfully' },
    });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const doctor = await findDoctorByEmail(email);
    if (doctor) {
      const secret = doctor.password + '-' + key;
      const token = jwt.sign({ _id: doctor._id }, secret, { expiresIn: '15m' });
      sendResetPasswordEmail(doctor.email, token, 'doctors');
    }
    res.status(200).json({
      status: 'success',
      message: `If the email: ${email} exists in the system, a reset password link will be sent to it`,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.decode(token);
    if (typeof decoded === 'string' || !decoded?._id) {
      throw new HttpException(400, 'Invalid token', ['Invalid token']);
    }
    const doctor = await findDoctorById(decoded._id);
    if (!doctor) {
      throw new HttpException(400, 'Invalid token', ['Invalid token']);
    }
    const secret = doctor.password + '-' + key;
    jwt.verify(token, secret);
    doctor.password = password;
    await doctor.save();
    res.status(200).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} password reset successfully`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const changeStatus = async (
  req: Request<
    ChangeDoctorStatusInput['params'],
    {},
    ChangeDoctorStatusInput['body']
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctor = await findDoctorById(id);
    if (!doctor) {
      throw new HttpException(404, 'Doctor not found', ['Doctor not found']);
    }
    doctor.status = status;
    await doctor.save();
    res.status(200).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} status changed to ${status}`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteDoctor = async (
  req: Request<DeleteDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorByIdAndDelete(req.params.id);
    if (!doctor) {
      throw new HttpException(404, 'Doctor not found', ['Doctor not found']);
    }
    res
      .status(204)
      .json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (err: any) {
    next(err);
  }
};

export const update = async (
  req: Request<{}, {}, UpdateDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorByIdAndUpdate(
      req.body.auth.id,
      req.body,
    ).select('-password');
    res.status(200).json({ status: 'success', data: { doctor } });
  } catch (err: any) {
    next(err);
  }
};

export const deleteMyAccount = async (
  req: Request<{}, {}, DeleteMyDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await findDoctorByIdAndDelete(req.body.auth.id);
    res
      .status(204)
      .json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (err: any) {
    next(err);
  }
};

export const changePassword = async (
  req: Request<{}, {}, UpdateDoctorPasswordInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const doctor = await findDoctorById(req.body.auth.id);
    if (!doctor) {
      throw new HttpException(404, 'Invalid Token', []);
    }
    const isMatch = await bcrypt.compare(oldPassword, doctor.password);
    if (!isMatch) {
      throw new HttpException(
        400,
        'Password is incorrect please try again',
        [],
      );
    }
    doctor.password = newPassword;
    await doctor.save();
    res
      .status(200)
      .json({ status: 'success', message: 'Password changed successfully' });
  } catch (err: any) {
    next(err);
  }
};

export const searchDoctor = async (
  req: Request<{}, {}, {}, SearchDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await findDoctor({}, req.query);
    return res.status(200).json({ status: 'success', data });
  } catch (err: any) {
    next(err);
  }
};

export const getDoctor = async (
  req: Request<GetDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorById(req.params.id, { password: 0 });
    if (!doctor) {
      throw new HttpException(404, 'Doctor not found', ['Doctor not found']);
    }
    res.status(200).json({ status: 'success', data: { doctor } });
  } catch (err: any) {
    next(err);
  }
};

export const addReview = async (
  req: Request<AddReviewParamsInput, {}, AddReviewBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await addReviewForDoctorById(req.params.id, req.body.auth.id, req.body);
    res.status(201).json({
      status: 'success',
      data: { message: 'Review is created successfully' },
    });
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (
  req: Request<GetReviewsParamsInput, {}, {}, GetReviewsQueryInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await findDoctorReviewsById(
      req.params.id,
      req.query.page,
      req.query.limit,
    );
    res.status(200).json({ status: 'success', data });
  } catch (err: any) {
    next(err);
  }
};

export const saveProfileImage = async (
  req: Request<{}, {}, SaveImageInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorByIdAndUpdate(req.body.auth.id, {
      avatar: req.body.imageURL,
    }).select('-password');
    return res.status(200).json({
      status: 'success',
      data: doctor,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getDoctorPosts = async (
  req: Request<GetDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { posts: doctor?.posts },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getPostById = async (
  req: Request<GetPostByIdInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await findPostById(req.params.id);
    if (!post) {
      throw new HttpException(404, 'Post Not Found', []);
    }
    return res.status(200).json({ status: 'success', data: { post } });
  } catch (err: any) {
    next(err);
  }
};

export const createPost = async (
  req: Request<{}, {}, CreatePostInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await findDoctorByIdAndCreatePost(
      req.body.auth.id,
      req.body.description,
      req.body.images,
    );

    return res.status(200).json({
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
    await findPostAndDeleteById(req.body.auth.id, req.params.id);
    return res.status(204).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};
