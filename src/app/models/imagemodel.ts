export class ImageModel {
    imageName: string;
    imageFile: File;
    imageByte: any;

    constructor(imageFile: File, imageName?: string, imageByte?: any){
        this.imageFile = imageFile;
        this.imageName = imageName;
        this.imageByte = imageByte;
    }

}