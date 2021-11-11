export enum TransactionStatus {
  Success = 1,
  Fails = 0,
  Pending = -1,
}
export interface Transaction {
  name: string;
  status: TransactionStatus;
  txHash: string;
}
