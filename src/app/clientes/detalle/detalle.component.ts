import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
//import { ActivatedRoute } from '@angular/router';
import { ModalService } from './modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: String = "Detalle del Cliente";
  fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
    //   private activatedRoute: ActivatedRoute
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturaService
  ) {
  }

  ngOnInit(): void {
    /*  this.activatedRoute.paramMap.subscribe(params => {
        let id: number = +params.get('id');
        if (id) {
          this.clienteService.getCliente(id).subscribe(cliente => {
            this.cliente = cliente;
          });

        }

      });*/
  }


  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error al seleccionar imagen :El archivo debe ser una imagen', 'El archivo debe ser una imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal.fire('Error: Debe seleccionar una foto', 'Debe seleccionar una foto', 'error');
    }
    else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id + '').subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire('La foto se ha subido con éxito!', response.mensaje, 'success');
          }
          //  this.cliente = cliente;

        }

      );
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;

  }

  delete(factura: Factura): void {
    swal.fire({
      title: 'Confirmar Eliminar',
      text: `Seguro de que desea eliminar la factura ${factura.descripcion}'?`,
      showDenyButton: true,
      //  showCancelButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(response => {
          this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
          swal.fire('Factura Eliminada', ` ${factura.descripcion} Se eliminó correctamente!`, 'success')

        })

      } else if (result.isDenied) {
        swal.fire('No se eliminó', '', 'info')
      }
    })

  }
}
