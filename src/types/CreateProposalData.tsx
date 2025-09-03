function CreateProposalData(
  id: number,
  created_at: string,
  formatted_price: string,
  notes: string,
  warranty_months: number,
  delivery_time_days: number,
  status: string
) {
  return {
    id,
    created_at,
    formatted_price,
    status,
    history: {
      notes: notes,
      warranty: warranty_months,
      delivery: delivery_time_days,
    },
  };
}

export default CreateProposalData;