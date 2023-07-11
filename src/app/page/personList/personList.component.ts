import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-personList',
  standalone: true,
  imports: [ CommonModule, MatIconModule, HttpClientModule,MatIconModule],
  templateUrl: './personList.component.html',
  styleUrls: ['./personList.component.scss'],
  providers: [ApiService],
})
export class PersonListComponent implements OnInit {
  personList: import("d:/Angular demo project/New folder/New folder/src/app/page/product/product").person[];
  products: any;

  constructor( private apiService: ApiService,private router: Router) { }

  ngOnInit() {
    this.getPersonList();
  }
 getPersonList() {
    this.apiService.getpersonList().subscribe((data) => {
      console.log(data);
      this.personList = data
    });
  }
  createPerson(){
    this.router.navigate(['/pages/addperson'], { queryParams:{create:"create"} });
  }
  updatePerson(e){
    console.log(e);
    const dataString = JSON.stringify(e);

    // Encode the data as a query parameter
    const encodedData = encodeURIComponent(dataString);
    this.router.navigate(['/pages/addperson'], { queryParams: { data: encodedData ,id:e.id }});
  }
  deletePerson(person: any) {
    this.apiService.deletePerson(person.id).subscribe(() => {
      const index = this.personList.findIndex(p => p.id === person.id);
      if (index !== -1) {
        this.personList.splice(index, 1);
      }
    })
   
  }
}
