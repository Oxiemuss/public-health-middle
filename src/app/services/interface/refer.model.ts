export interface ReferCase {
  rid: number;
  cid: string;
  patient_name: string;
  birth_date: string;
  tel: string;
  p_address: string;
  refer_pic:string;
  cid_pic: string
  from_hospital_name: string;
  to_hospital_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  is_active: boolean;
}