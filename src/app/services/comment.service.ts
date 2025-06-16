import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { COMMENTS_URL } from '../constans/urls';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl =  COMMENTS_URL;

  constructor(private http: HttpClient) {}

  getCommentsByMarbleId(marbleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/marble/${marbleId}`);
  }

  addComment(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl + "/add"
      , comment);
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }

  updateComment(commentId: string, text: string): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/${commentId}`, { text });
  }
}
