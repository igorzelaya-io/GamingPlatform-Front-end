export class D1Service {
    serviceId: string;
    serviceName: string;
    serviceChargeType: string;
    serviceChargeAmount: number;
    serviceDescription: string;

    constructor(serviceId ?: string, serviceName?: string, serviceChargeAmount?: number, 
                serviceChargeType ?: string, serviceDescription ?: string){
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.serviceChargeType = serviceChargeType;
        this.serviceDescription = serviceDescription;
        this.serviceChargeAmount = serviceChargeAmount;
    }


}