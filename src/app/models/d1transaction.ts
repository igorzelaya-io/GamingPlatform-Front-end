import { D1Service } from "./d1service";

export class D1Transaction {
    transactionId: string;
    transactionService: D1Service;
    transactionAmountCharge: number;
    transactionTime: string;

    constructor(transactionId?: string, transactionService?: D1Service, transactionAmountCharge?: number, transactionTime ?: string){
        this.transactionId = transactionId;
        this.transactionService = transactionService;
        this.transactionAmountCharge = transactionAmountCharge;
        this.transactionTime = transactionTime;
    }

}