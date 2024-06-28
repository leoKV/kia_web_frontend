import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CancionService } from '../services/cancion/cancion.service';
import { CancionDetailDTO } from '../models/cancion-detail.dto';
import { CartService } from '../services/cart/cart.service';
import Swal from 'sweetalert2';
import { Parametro } from '../models/parametro';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cancion-detail',
  templateUrl: './cancion-detail.component.html',
  styleUrls: ['./cancion-detail.component.css']  // Corregido: styleUrl -> styleUrls
})
export class CancionDetailComponent implements OnInit {

  cancionDetail : CancionDetailDTO | undefined;
  parametroUrlDemo: Parametro | undefined;
  filteredUrls: string[] = [];
  filteredTiposUrls: string[] = [];
  safeVideoUrl: SafeResourceUrl | undefined;

  constructor(
    private route: ActivatedRoute,
    private cancionService: CancionService,
    private cartService: CartService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCancionDetail(parseInt(id, 10));
      this.loadUrlDemoState();
    }
  }

  loadCancionDetail(id: number): void {
    this.cancionService.getCancionDetailById(id).subscribe((data: CancionDetailDTO) => {
      this.cancionDetail = data;
      this.filterUrls();
    });
  }

  loadUrlDemoState(){
    this.cancionService.getUrlDemoState().subscribe((data: Parametro) =>{
      this.parametroUrlDemo = data;
      this.filterUrls();
    });
  }

  filterUrls(): void {
    if (!this.cancionDetail || !this.parametroUrlDemo) {
      return;
    }

    const isDemo = this.parametroUrlDemo.p_Valor.toLowerCase() === 'true';
    this.filteredUrls = [];
    this.filteredTiposUrls = [];

    this.cancionDetail.urls?.forEach((url, index) => {
      const tipoUrl = this.cancionDetail?.tipos_urls?.[index];
      if (tipoUrl) {
        if (isDemo && tipoUrl.toLowerCase() === 'demo') {
          this.filteredUrls.push(url);
          this.filteredTiposUrls.push(tipoUrl);
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(url, 'demo'));
        } else if (!isDemo && tipoUrl.toLowerCase() === 'source') {
          this.filteredUrls.push(url);
          this.filteredTiposUrls.push(tipoUrl);
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(url, 'source'));
        }
      }
    });
  }

  convertToEmbedUrl(url: string, tipo: string): string {
    if (tipo === 'demo') {
      // Asume que la URL demo contiene solo el ID del video
      return `https://www.youtube.com/embed/${url}`;
    } else {
      // Extrae el ID del video de la URL completa
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  addToCart(): void {
    if (this.cancionDetail) {
      const wasAdded = this.cartService.addToCart(this.cancionDetail);
      if (wasAdded) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Karaoke agregado correctamente!",
          showConfirmButton: false,
          timer: 2500
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "El karaoke ya está en el carrito!",
          showConfirmButton: false,
          timer: 2500
        });
      }
    }
  }

  copyURL(): void {
    const url = `${window.location.origin}${this.router.url}`;
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "URL copiada al portapapeles",
        showConfirmButton: false,
        timer: 2500
      });
    }).catch(err => {
      console.error('Error al copiar el URL: ', err);
    });
  }
}
