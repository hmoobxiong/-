export enum DocType {
  INCOMING = 'ຂາເຂົ້າ', // Incoming
  OUTGOING = 'ຂາອອກ', // Outgoing
  INTERNAL = 'ພາຍໃນ', // Internal
  CONTRACT = 'ສັນຍາ', // Contract
  OTHER = 'ອື່ນໆ', // Other
}

export enum DocStatus {
  DRAFT = 'ຮ່າງ', // Draft
  PENDING = 'ລໍຖ້າອະນຸມັດ', // Pending
  APPROVED = 'ອະນຸມັດແລ້ວ', // Approved
  COMPLETED = 'ສຳເລັດ', // Completed
  REJECTED = 'ປະຕິເສດ' // Rejected
}

export interface DocumentData {
  id: string;
  refNo: string; // Document Number
  title: string;
  type: DocType;
  fromDept: string; // Origin department/person
  date: string;
  status: DocStatus;
  summary: string;
  content?: string; // Full text content if available
  fileName?: string;
}

export interface Stats {
  total: number;
  incoming: number;
  outgoing: number;
  pending: number;
}