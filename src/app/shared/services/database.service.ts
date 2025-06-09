import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db: AngularFirestore) {
    console.log('DatabaseService constructor chamado');
  }

  //funcoes que irao interagir com o banco de dados
  addDocument(collection: string, data: any): Promise<any> {
    console.log('addDocument chamado:', collection, data);
    return this.db.collection(collection).add(data);
  }

  getDocument(collection: string, id: string): Observable<any | undefined> {
    console.log('getDocument chamado:', collection, id);
    return this.db.collection(collection).doc(id).valueChanges();
  }

  getCollection(collection: string): Observable<any[]> {
    console.log('getCollection chamado:', collection);
    return this.db.collection(collection).valueChanges({ idField: 'id' });
  }

  getCollectionWithFilter(collection: string, field: string, value: string): Observable<any[]> {
    console.log('getCollectionWithFilter chamado:', collection, field, value);
    return this.db.collection(collection, ref => ref.where(field, '==', value)).valueChanges({ idField: 'id' });
  }

  updateDocument(collection: string, id: string, data: any): Promise<any> {
    console.log('updateDocument chamado:', collection, id, data);
    return this.db.collection(collection).doc(id).update(data);
  }

  deleteDocument(collection: string, id: string): Promise<void> {
    console.log('deleteDocument chamado:', collection, id);
    return this.db.collection(collection).doc(id).delete();
  }
}
