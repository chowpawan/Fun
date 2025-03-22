import { Component } from '@angular/core';
import { NavComponent } from "./components/navbar/navbar.component";
import{FooterComponent} from "./components/footer/footer.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import {CarouselComponent}  from "./components/carousel/carousel.component";
import {BodyComponent} from "./components/body/body.component";
@Component({
  selector: 'app-root',
  imports: [
    NavComponent,
  FooterComponent,
  CategoriesComponent,
  CarouselComponent,
  BodyComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Crunchyroll';
}
