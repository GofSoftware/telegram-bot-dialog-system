import { BaseEntity, IBaseEntity } from './base-entity';

export interface IPayment extends IBaseEntity{
    userId: number;
    userName: string;
    created: number;
    amount: number;
    payload: string;
    response: string;
}

export class Payment extends BaseEntity {
    public static fromJson(jsonObject: IPayment): Payment {

        const baseEntity = BaseEntity.fromJson(jsonObject);

        const payment = new Payment(
            jsonObject.userId,
            jsonObject.userName,
            jsonObject.created,
            jsonObject.amount,
            jsonObject.payload,
            jsonObject.response
        );

        Object.assign(payment, baseEntity);
        return payment;
    }

    constructor(
        public userId: number,
        public userName: string,
        public created: number,
        public amount: number,
        public payload: string,
        public response: string
    ) {
        super();
    }

    public toJson(): IPayment {
        const jsonObject = super.toJson() as IPayment;

        jsonObject.userId = this.userId;
        jsonObject.userName = this.userName;
        jsonObject.created = this.created;
        jsonObject.amount = this.amount;
        jsonObject.payload = this.payload;
        jsonObject.response = this.response;

        return jsonObject;
    }
}
