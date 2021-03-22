export class D1Service {
    serviceId: string;
    serviceName: string;
    serviceChargeType: string;
    serviceGivingAmount: number;
    serviceChargeAmount: number;
    serviceDescription: string;

    constructor(serviceId ?: string, serviceName?: string, serviceChargeAmount?: number, 
                serviceGivingAmount?:number,serviceChargeType ?: string, serviceDescription ?: string){ 
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.serviceChargeType = serviceChargeType;
        this.serviceDescription = serviceDescription;
        this.serviceGivingAmount = serviceGivingAmount;
        this.serviceChargeAmount = serviceChargeAmount;
    }


}