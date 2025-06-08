import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db: AngularFirestore) { }

  //funcoes que irao interagir com o banco de dados
  addDocument(collection:string, data:any): Promise<any>{
    return this.db.collection(collection).add(data)
      
  }
  getDocument(collection:string, id: string): Observable<any | undefined> {
    return this.db.collection(collection).doc(id).valueChanges();
  }
  getCollection(collection:string): Observable<any[]> {
    return this.db.collection(collection).valueChanges({idField:'id'});
  }
  getCollectionWithFilter(collection:string, field:string, value: string): Observable<any[]> {
    return this.db.collection(collection, ref => ref.where(field, '==', value)).valueChanges({idField: 'id'});

  }
  updateDocument(collection:string, id:string, data:any): Promise<any>{
    return this.db.collection(collection).doc(id).update(data);
  }
  deleteDocument(collection:string, id:string): Promise<void> {
    return this.db.collection(collection).doc(id).delete();
  }



}
