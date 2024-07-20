import { IDatabase } from './i-database';
import { BaseEntity, IBaseEntity } from './entity/base-entity';
import { firestore } from 'firebase-admin';

export class FirestoreDatabase implements IDatabase {

    public static create(firestoreInstance: firestore.Firestore): FirestoreDatabase {
        return new FirestoreDatabase(firestoreInstance);
    }

    private db: firestore.Firestore;

    private constructor(firestoreInstance: firestore.Firestore) {
        this.db = firestoreInstance;
    }

    public async loadEntity<T extends BaseEntity, I extends IBaseEntity>(
            entityName: string,
            id: number | string,
            instantiator: (data: I) => T): Promise<T> {
        const res = await this.db.collection(entityName).where('id', '==', id).get();
        if (res.empty) {
            return null;
        }
        if (res.size !== 1) {
            throw new Error(`More that one entity ${entityName} with id: ${id}`);
        }
        const doc = res.docs[0].data();
        doc.__id = res.docs[0].id;
        return instantiator(doc as I);
    }

    public async loadEntityWhere<T extends BaseEntity, I extends IBaseEntity>(
            entityName: string,
            field: string,
            operator: string,
            value: any,
            instantiator: (data: I) => T): Promise<T[]> {
        const res = await this.db.collection(entityName).where(field, operator as FirebaseFirestore.WhereFilterOp, value).get();
        return res.docs.map((doc) => {
            const docEntity = doc.data();
            docEntity.__id = doc.id;
            return instantiator(doc.data() as I);
        });
    }

    public async saveEntity<T extends BaseEntity>(entityName: string, entity: T): Promise<string> {
        if(entity.__id != null) {
            await this.db.collection(entityName).doc(entity.__id).set(entity.toJson() as any, {merge: true});
            return entity.__id;
        } else {
            const doc = await this.db.collection(entityName).add(entity.toJson() as any);
            entity.__id = doc.id;
            return doc.id;
        }
    }

    public async saveToCollection<T extends BaseEntity>(entityName: string, entityId: string, entity: T): Promise<string> {
        const doc = await this.db.collection(entityName).doc(entityId).collection('payments').add(entity.toJson() as any);
        entity.__id = doc.id;
        return entity.__id;
    }
}
