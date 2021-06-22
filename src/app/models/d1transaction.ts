import { D1Service } from "./d1service";

export class D1Transaction {
    transactionId: string;
    transactionService: D1Service;
    transactionAmountCharge: number;
    transactionTime: Date;

    constructor(transactionId?: string, transactionService?: D1Service, transactionAmountCharge?: number, transactionTime ?: Date){
        this.transactionId = transactionId;
        this.transactionService = transactionService;
        this.transactionAmountCharge = transactionAmountCharge;
        this.transactionTime = transactionTime;
    }

}