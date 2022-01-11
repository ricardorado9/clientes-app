import { Component, OnInit } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes!: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response => {
          //this.clientes = clientes
          console.log('ClientesComponent tap3');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          })
        })
      ).subscribe(
        response => {

          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente): void {
    swal.fire({
      title: 'Confirmar Eliminar',
      text: `Seguro de que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}'?`,
      showDenyButton: true,
      //  showCancelButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente);
          swal.fire('Cliente Eliminado', `${cliente.nombre} ${cliente.apellido}' Se eliminó correctamente!`, 'success')

        })

      } else if (result.isDenied) {
        swal.fire('No se eliminó', '', 'info')
      }
    })
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
