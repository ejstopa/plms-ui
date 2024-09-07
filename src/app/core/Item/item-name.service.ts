import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { CreateItemNameDto } from './create_item_name_dto';
import { finalize, take } from 'rxjs';
import { ItemNameReservation } from './item-name-reservation';

@Injectable({
  providedIn: 'root'
})
export class ItemNameService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/item-names`;
  
  constructor() { }

  createItemName(itemNameData: CreateItemNameDto){
    this.loadingService.setLoadingStart();

    return this.http.post<ItemNameReservation>(this.apiUrl, itemNameData).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }
}
