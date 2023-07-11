import { HttpClient, HttpHeaders } from '@angular/common/http';
 import { person } from '../../page/product/product';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 
@Injectable({providedIn:'root'})
export class ApiService {
  baseURL: string = "http://localhost:4000/";
 
  constructor(private http: HttpClient) {
  }
 
  getpersonList(): Observable<person[]> {
    console.log('getPeople '+this.baseURL + 'user')
    return this.http.get<person[]>(this.baseURL + 'user')
  }
 
  createPerson(field:person): Observable<any> {
   const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(field);
    console.log(body)
    return this.http.post(this.baseURL + 'user', body,{'headers':headers})
  }
  updatePerson(person: person,id): Observable<void> {
    const url = `${this.baseURL}user/${id}`;
    return this.http.put<void>(url, person); 
  }
  deletePerson(personId: number): Observable<void> {
    const url = `${this.baseURL}user/${personId}`;
    return this.http.delete<void>(url);
  }

}