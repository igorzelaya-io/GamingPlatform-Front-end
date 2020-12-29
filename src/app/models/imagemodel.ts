export class ImageModel {
    imageName: string;
    imageFile: File;
    imageByte: any;
    pending: boolean;
    status = 'init';
    imageSrc: string;
    constructor(imageFile: File, imageSrc: string, imageByte?: any, imageName?: string){
        
    }

}