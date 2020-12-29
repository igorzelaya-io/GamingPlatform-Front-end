import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {

  @ViewChild('image', {static: false})
  public imageElement: ElementRef;

  @Input('src')
  public imageSource: string;

  public imageDestination = '';

  private cropper: Cropper;

  constructor() {
    this.imageSource = '';
  }

  public ngAfterInit(){
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: false,
      scalable: false,
      aspectRatio: 1,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas();
        this.imageDestination = canvas.toDataURL('image/png');
      }
    });
  }

  ngOnInit(): void {
  }

}
