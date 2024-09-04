import { Component, computed, inject, input, output } from '@angular/core';
import { Model } from '../model';
import { CreoSessionService } from '../../creo/services/creo-session.service';

@Component({
  selector: 'app-model-descriptor',
  standalone: true,
  imports: [],
  templateUrl: './model-descriptor.component.html',
  styleUrl: './model-descriptor.component.scss',
  host: { class: "d-flex align-items-center" }
})
export class ModelDescriptorComponent {
  creoSessionService = inject(CreoSessionService);
  model = input.required<Model>();

  creoConnected = computed(() => this.creoSessionService.isConnected());
  modelTypeImgPath = computed(() => this.getModelTypeImgPath(this.model()));

  openModel(){
    if (this.creoConnected()) {
      this.creoSessionService.openCreoFiles([this.model().filePath]);
    }
  }

  private getModelTypeImgPath(model: Model) {
    let ModelImgPath = "";

    switch (model.type) {
      case ".prt":
        ModelImgPath = "images/prt_image.png";
        break;
      case ".asm":
        ModelImgPath = "images/asm_image.png";
        break;
      case ".drw":
        ModelImgPath = "images/drawing.png";
        break;
    }
    return ModelImgPath;
  }


}
