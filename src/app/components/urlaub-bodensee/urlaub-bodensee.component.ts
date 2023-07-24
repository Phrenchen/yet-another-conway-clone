import {AfterViewInit, Component, ViewChild, ViewChildren} from '@angular/core';

@Component({
    selector: 'app-urlaub-bodensee',
    templateUrl: './urlaub-bodensee.component.html',
    styleUrls: ['./urlaub-bodensee.component.scss']
})
export class UrlaubBodenseeComponent implements AfterViewInit {

    @ViewChild('days') days: any;

    public selectedImageUrl: string | null = null;

    ngAfterViewInit() {
        const images: any[] = Array.from(this.days.nativeElement.querySelectorAll('img'));

        images.forEach(image => {
            image.addEventListener('click', () => {
                console.log('image:', image, '|||', image.src);
                this.selectedImageUrl = image.src !== this.selectedImageUrl ?
                    image.src : null;

                // image.classList.contains('selected-image') ?
                //     image.classList.remove('selected-image') :
                //     image.classList.add('selected-image');
            });
        })
    }

    public closeImage(): void {
        this.selectedImageUrl = null;
    }
}
