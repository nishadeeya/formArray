import { Routes } from '@angular/router';
import { PageComponent } from './page.component';

export const page_routes: Routes = [
    {
        path: '',
        component: PageComponent,
       children:[
        {
          path: 'addperson',
          loadComponent: () => import('./weather/weather.component').then(mod => mod.WeatherComponent),
         
        },{
          path: 'person',
          loadComponent: () => import('./personList/personList.component').then(mod => mod.PersonListComponent),
         
        },
       ]
    },
     
];
