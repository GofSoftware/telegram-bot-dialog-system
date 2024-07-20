export interface IBaseEntity {
    __id: string;
}

export class BaseEntity {

    public __id: string = null;

    public static fromJson(jsonObject: IBaseEntity): BaseEntity {
        const entity = new BaseEntity();
        entity.__id = jsonObject.__id;
        return entity;
    }

    public toJson(): IBaseEntity {
        return {
            __id: this.__id
        };
    }
}
