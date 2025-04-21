import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MARBEL_AddMARBEL_URL, MARBEL_BY_ID_URL, MARBEL_BY_SEARCH_URL, MARBEL_BY_TAG_URL, MARBEL_TAGS_URL, MARBEL_URL } from './../constans/urls';
import { Marble } from '../models/marble';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class MarblesService {

  constructor(private http: HttpClient) {
    
    try {
      console.log('MarbleService instantiated, HttpClient:', this.http);
    } catch (e) {
      console.error('Error in MarbleService constructor:', e);
    }
  }
  getAll():Observable<Marble[]>{
    return this.http.get<Marble[]>(MARBEL_URL);
  }
  getAllTags():Observable<Tag[]>{
    return this.http.get<Tag[]>(MARBEL_TAGS_URL);  }
   
  getAllmarbleByTag(tag: string) : Observable<Marble[]> {

     return  tag ==="All" ?
    this.getAll():
    this.http.get<Marble[]>(MARBEL_BY_TAG_URL +tag);
     
  }
  
}


