import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MARBEL_AddMARBEL_URL, MARBEL_BY_ID_URL, MARBEL_BY_SEARCH_URL, MARBEL_BY_TAG_URL, MARBEL_TAGS_URL, MARBEL_URL ,UPLOAD_Image} from './../constans/urls';
import { Marble } from '../models/marble';
import { Tag } from '../models/tag';
import { ToastrService } from 'ngx-toastr';
import { ImarbelAdd } from '../shared/interfaces/ImarblesAdd';

@Injectable({
  providedIn: 'root'
})
export class MarblesService {
  createMarble(marbleData: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient ,private toastrService: ToastrService) {

    try {
      console.log('MarbleService instantiated, HttpClient:', this.http);
    } catch (e) {
      console.error('Error in MarbleService constructor:', e);
    }
  }
    getMarbleById(marbelId:string):Observable <Marble>{
    return this.http.get<Marble>(MARBEL_BY_ID_URL+marbelId);
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
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(UPLOAD_Image, formData);
  }
    ADD_Marble(marble: ImarbelAdd): Observable<Marble> {
    return this.http.post<Marble>(MARBEL_AddMARBEL_URL, marble).pipe(
      tap(
        (createdMarble) => {
          this.toastrService.success(
            `createdMarble ${createdMarble.name}!`,
          );
        },
        (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed');
        }
      )
    );
  }
    deleteMarble(marbleId: string): Observable<void> {
    const url = MARBEL_BY_ID_URL + marbleId;
    return this.http.delete<void>(url).pipe(
      tap(
        () => {
          this.toastrService.success('Marble deleted successfully!', 'Delete Successful');
        },
        (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Delete Failed');
        }
      )
    );
  }
  updateMarble(marbleId: string, marble: ImarbelAdd): Observable<Marble> {
    return this.http.put<Marble>(`${MARBEL_URL}/${marbleId}`, marble).pipe(
      tap(
        (updatedMarble) => {
          this.toastrService.success(
            `Marble ${updatedMarble.name} updated successfully!`,
            'Update Successful'
          );
        },
        (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Update Failed');
        }
      )
    );
  }
}


