import { FilterQuery, ProjectionType } from 'mongoose';
import DoctorModel, { Doctor } from '../models/doctor';

export const findDoctorByEmail = (email: string) => {
  return DoctorModel.findOne({ email });
};

export const createDoctor = (doctor: any) => {
  return DoctorModel.create(doctor);
};

export const findDoctorById = (
  id: string,
  projection?: ProjectionType<Doctor>
) => {
  return DoctorModel.findById(id, projection);
};

export const findDoctorsPagination = async (
  filter: FilterQuery<Doctor>,
  pageS: string = '1',
  limitS: string = '20'
) => {
  const limit = parseInt(limitS);
  const count = await DoctorModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const page = Math.min(totalPages, parseInt(pageS));
  return {
    doctors: await DoctorModel.find(
      {},
      { password: 0 },
      { limit, skip: (page - 1) * limit, sort: { createdAt: -1 } }
    ),
    totalPages,
    currentPage: page,
  };
};

export const findDoctorByIdAndUpdate = (
  id: string,
  update: any,
  options: any = { new: true }
) => {
  return DoctorModel.findByIdAndUpdate(id, update, options);
};

export const findDoctorByIdAndDelete = (id: string) => {
  return DoctorModel.findByIdAndDelete(id);
};
