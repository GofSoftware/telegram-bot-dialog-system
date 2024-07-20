import { BaseEntity, IBaseEntity } from './entity/base-entity';

export interface IDatabase {
    loadEntity<T extends BaseEntity, I extends IBaseEntity>(entityName: string, id: number | string, instantiator: (data: I) => T): Promise<T>;
    saveEntity<T extends BaseEntity>(entityName: string, entity: T): Promise<string>;
    saveToCollection<T extends BaseEntity>(entityName: string, entityId: string, entity: T): Promise<string>;
    loadEntityWhere<T extends BaseEntity, I extends IBaseEntity>(
        entityName: string, field: string, operator: string, value: any, instantiator: (data: I) => T): Promise<T[]>
}
