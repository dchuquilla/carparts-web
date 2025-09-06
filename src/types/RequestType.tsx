interface RequestType {
  show_key: string;
  part_image?: string;
  part_name?: string;
  part_brand?: string;
  part_model?: string;
  part_year?: string;
  part_chassis?: string;
  formatted_created_at?: string;
  proposals?: Array<{
    id: number;
    created_at: string;
    formatted_price: string;
    notes: string;
    warranty_months: number;
    delivery_time_days: number;
    status: string;
  }>;
}
export default RequestType;