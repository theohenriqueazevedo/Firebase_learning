import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db: AngularFirestore) { }

  //funcoes que irao interagir com o banco de dados
  addDocument(collection:string, data:any){
    
  }
  getDocument(collection:string,)){

  }
  getCollection(collection:string,)){

  }
  getCollectionWithFilter(collection:string,)){

  }
  updateDocument(collection:string,)){

  }
  deleteDocument(collection:string,)){

  }
  








}
