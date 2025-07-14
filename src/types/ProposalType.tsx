interface ProposalType {
  id?: number;
  createdAt?: string;
  price: string;
  notes: string;
  warrantyMonths: number;
  deliveryTimeDays: number;
}

export default ProposalType;