import QueryBuilder from '../../builder/QueryBuilder';
import { ConsultationStatus } from './consultation.constants';
import { IConsultation } from './consultation.interface';
import { Consultation } from './consultation.model';

// ------------- create consultation service
const createConsultation = async (payload: IConsultation): Promise<IConsultation> => {
  // check if too many pending consultations for this customer in last 24 hours
  const consultations = await Consultation.countDocuments({
    'customer.email': payload.customer.email,
    status: ConsultationStatus.Pending,
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  if (consultations > 5) {
    throw new Error('Too many consultation requests detected. Please try again later.');
  }

  const result = await Consultation.create(payload);
  return result;
};

// ------------- update consultation service --------------
const updateConsultation = async (id: string, payload: IConsultation): Promise<IConsultation> => {
  const result = await Consultation.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Consultation not found');
  }
  return result;
};

// ------------- delete consultation service --------------
const deleteConsultation = async (id: string): Promise<IConsultation> => {
  const result = await Consultation.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new Error('Consultation not found');
  }
  return result;
};

// ------------- get consultation by id --------------
const getConsultationById = async (id: string): Promise<IConsultation> => {
  const result = await Consultation.findById(id);
  if (!result) {
    throw new Error('Consultation not found');
  }
  return result;
};

// ------------- get all consultations --------------
const getAllConsultations = async (query: Record<string, unknown>) => {
  const consultationQuery = new QueryBuilder(Consultation.find({ isDeleted: false }), query)
    .search([
      'customer.name',
      'customer.email',
      'customer.phone',
    ])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, pagination] = await Promise.all([
    consultationQuery.modelQuery.lean(),
    consultationQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};


export const ConsultationServices = {
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getConsultationById,
  getAllConsultations,
};