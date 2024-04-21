import PatientModel from '../models/patient';
import ScannedPrescriptionModel, {
  ScannedPrescription,
} from '../models/scannedPrescription';
import { CreateScannedPrescriptionBody } from '../schema/scannedPrescription';

export const createScannedPrescription = async (
  patientId: any,
  medicines: string[],
) => {
  const prescription = new ScannedPrescriptionModel();
  prescription.patient = patientId;
  medicines.forEach((el) => {
    const newMedicine = { name: el, time: '', note: '' };
    prescription.medicines.push(newMedicine);
  });
  prescription.save();
  return prescription;
};
