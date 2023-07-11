import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from 'src/app/common/shared/input/input.component';
import { ApiService } from 'src/app/core/service/api.service';
@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatIconModule, InputComponent, HttpClientModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [ApiService],
})
export class WeatherComponent implements OnInit {
  itemForm: FormGroup;
  dataSource: any;
  showTable: boolean;
  personForm: FormGroup;
  isFormSubmitted: boolean;
  editBtn: boolean;
  buttonText: string;
  personID: any;
  persondetail: any;
  field: any;
  headingtext: string;
  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.personForm = this.formBuilder.group({
      person: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z\\s]+$")]),
      items: this.formBuilder.array([this.createItem()])
    })

    this.route.queryParams.subscribe((params) => {
      if (params['create']) {
        this.buttonText = "Create";
       this.headingtext ="Create Person"
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.editBtn = true;
        this.buttonText = "Update";
        this.headingtext ="Update Person"
        this.personID = params['id'];
        console.log(params['id']);
        const encodedData = this.route.snapshot.queryParamMap.get('data');
        this.dataSource = JSON.parse(decodeURIComponent(encodedData));
        console.log(this.dataSource);
        const itemsArray = this.personForm.get('items') as FormArray;
        itemsArray.clear();
        this.dataSource.items.forEach(item => {
          itemsArray.push(this.formBuilder.group({
            item: [item.item, [Validators.required, Validators.pattern("^[A-Za-z\\s]+$")]],
            price: [item.price, [Validators.required, Validators.pattern('[0-9]+(\\.[0-9]{1,2})?')]],
            quantity: [item.quantity, [Validators.required, Validators.pattern('[0-9]+')]]
          }));
        });

        this.personForm.patchValue({
          person: this.dataSource['person']
        });
      }


    });

  }
  get formvalid() {
    return this.personForm.controls;
  }
  createItem(): FormGroup {
    return new FormGroup({
      item: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z\\s]+$")]),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\\.[0-9]{1,2})?')]),
      quantity: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    })
  }

  addItem(): void {
    const items = this.personForm.get('items') as FormArray;
    items.push(this.createItem());
  }

  removeItem(index: number): void {
    const items = this.personForm.get('items') as FormArray;
    items.removeAt(index);
    console.log(items);
    if (items.value.length == 0) {
      this.showTable = false
    }
  }

  get itemcontrols() {
    return (this.personForm.get('items') as FormArray).controls;
  }
  createPerson() {
    console.log('data is ', this.personForm.value);
    this.personForm.markAllAsTouched();
    this.field = this.personForm.value;
    if (this.editBtn) {
      this.personForm.patchValue({
        id: this.personID
      })
      this.apiService.updatePerson(this.personForm.value, this.personID).subscribe((data) => {
        this.router.navigate(['/pages/person']);
      });
    } else {
      this.apiService.createPerson(this.field).subscribe((data) => {
        this.router.navigate(['/pages/person']);
      });
    }
  }
  onBackClick() {
    this.router.navigate(['/pages/person']);
  }
}