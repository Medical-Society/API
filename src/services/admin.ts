import AdminModel from '../models/admin';

export const findAdminByEmail = (email: string) => {
  return AdminModel.findOne({ email });
};

export const createAdmin = (admin: any) => {
  return AdminModel.create(admin);
};
