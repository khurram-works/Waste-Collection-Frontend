export interface Request {
  requestId: string;
  requestDate: string;
  citizen: { name: string; phone: string; zoneId: number };
  address: string;
  wasteType: string;
  status: string;
  photoUrl: string;
  notes: string;
  route: { name: string; routeId: number; zoneId: number };
  worker: { name: string; userId: number; phone: string };
}

export interface Worker {
  name: string;
  userId: number;
  zone: string;
  zoneId: number;
  responsibleFor: string,
  phone?: string,
}

export interface Route {
  zoneId: number;
  name: string;
  schedule: string;
  routeId: number;
  zone: { name: string; zoneId: number };
  type: string;
  capacity: number;
}

export interface RequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
  workersData: Worker[];
  routesData: Route[];
  onAssign?: (updatedRequest: Request) => void;
  onReject?: (requestId: string) => void;
}

export interface userData {
  name: string;
  email: string;
  address: string;
  password: string;
  zoneId: number;
  latitude: number;
  longitude: number;
}

export interface WorkerData {
  name: string;
  userId: number;
  zone: { name: string; zoneId: number };
  phone: string;
  status: string;
  vehicle: string;
  _count: { assignedPickups: number };
  collectedCount: number;
  responsibleFor: string;
}

export interface WorkerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  worker: WorkerData | null;
  onUpdate?: (updatedWorker: WorkerData) => void;
  onDelete?: (userId: number) => void;
}

export interface WorkerforEdit {
  name: string;
  userId: number;
  phone: string;
  status: string;
  vehicle: string;
  _count: { assignedPickups: number };
  collectedCount: number;
  zone: { name: string; zoneId: number };
}

export interface ZoneData {
  name: string;
  zoneId: number;
}

export interface TaskData {
  requestId: string;
  address: string;
  wasteType: string;
  status: string;
  photoUrl: string;
  notes: string;
  estimatedWeight: number;
  workerId: number;
  priority: string;
  route: { name: string };
  latitude: number;
  longitude: number;
  citizenId: number;
  condition: string | null
}

export type Status =
  | "PENDING"
  | "ASSIGNED"
  | "COLLECTED"
  | "VERIFIED"
  | "PAID";

export interface PickupRequestItem {
  requestId: number;
  wasteType: string;
  requestDate: string;
  scheduledDate: string;
  status: Status;
  estimatedWeight: number;
  estimatedEarnings: number;
  pickupAddress: string;
  citizenNote: string | null;
  photoUrl: string | null;
  actualWeight: number | null;
  rateApplied: number | null;
  condition: string;
  workerId: number;
  workerName: string;
  workerPhone: string;
  workerZoneId: number;
  routeName: RouteName;
  routeType: RouteType;
  routeSchedule: RouteSchedule;
  worker:string;
}

export interface RouteName {
  routeName: string;
}

export interface RouteType {
  routeType: string;
}

export interface RouteSchedule {
  scheduleDate: string;
}

export interface PickupRequests {
  requests: PickupRequestItem[];
  totalEarnings: number;
}

export interface RateData{
  rateId: number,
  condition: string,
  createdAt: string,
  createdBy: number,
  deletedAt: string | null,
  effectiveFrom: string,
  effectiveTo: string | null,
  isActive: boolean,
  ratePerKg: string,
  updatedAt: string,
  wasteType: string,
}

export interface VerifiedTaskData{
  requestId: number,
  workerId: number,
  citizenId: number,
  weight: number,
  condition: string,
  appliedRate: number,
  notes: string,
  totalEarnings: number,
}

export interface User{
  userId: number,
  name: string,
  email: string,
  role: string,
  status: string,
  address: string
}

export interface SavedAddresses{
  addressId: number,
  address: string,
  latitude: number,
  longitude: number,
  userId: number
}


export interface TransactionRequestData{
  requestId: number,
  citizenId: number,
  workerId: number,
  routeId: number,
  wasteType: string,
  estimatedWeight: number,
  actualWeight: number,
  condition: string,
  status: string,
  requestDate: string,
  assignedDate:string,
  collectionDate:string,
  scheduledDate:string,
  priority: string,
  address: string,
  notes: string,
  photoUrl: string,
  rateApplied: number,
  deletedAt: string,
  createdAt: string,
  updatedAt: string,
  latitude: number,
  longitude: number,
}

export interface WithdrawalData{
  id: number,
  userId: number,
  amount: number,
  status: string,
  paymentMethod: string,
  accountNumber: string,
  accountTitle: string,
  paymentReference: string,
  processedAt: string,
  createdAt: string,
  updateAt: string,
  bankName: string | null,
  iban: string | null,
}


export interface allTransactions{
  transactionId: number,
  citizenId: number,
  requestId: number,
  withdrawalId: number | null,
  amount: number,
  type: string,
  transactionStatus: string,
  sourceType: string,
  description: string,
  referenceId: string,
  createdAt: string,
  updateAt: string,
  request: TransactionRequestData | null,
  withdrawal: WithdrawalData | null
}


export interface UserBalance{
  totalEarnings: number,
  availableBalance: number,
  pendingBalance: number,
}

export interface WithdrawRequestData{
  userId: number,
  amount: number,
  paymentMethod: string,
  accountNumber: string,
  accountTitle: string,
  bankName?: string | null,
  iban?: string | null,
}


export interface allWithdrawalsData{
  id: number,
  userId: number,
  amount: number,
  status: string,
  paymentMethod: string,
  accountNumber: string,
  accountTitle: string,
  paymentReference: string,
  processedAt: string,
  createdAt: string,
  updateAt: string,
  bankName: string | null,
  iban: string | null,
  user: withdrawuserData
}

export interface withdrawuserData{
  userId: number,
  email: string,
  password: string,
  role: string,
  name: string,
  phone: string | null,
  address: string,
  zoneId: number,
  vehicle: string | null,
  responsibleFor: string | null,
  status: string,
  totalEarnings: number,
  availableBalance: number,
  pendingBalance: number,
  deletedAt: string | null,
  createdAt: string | null,
  updatedAt: string | null,

}
