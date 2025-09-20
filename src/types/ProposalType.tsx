interface ProposalType {
  id?: number;
  requestId?: number;
  createdAt?: string;
  price?: string | null;
  notes?: string | null;
  partImage?: string | null;
  warrantyMonths: number;
  deliveryTimeDays: number;
}

export default ProposalType;