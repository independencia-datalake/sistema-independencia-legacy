import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { ProductosService } from 'src/app/service/productos.service';
import { StockService } from 'src/app/service/stock.service';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.css']
})
export class CargaMasivaComponent {
  selectedFile: File = null;

  formEstadoIngreso: FormGroup;

  formCrearProducto: FormGroup;
  formProductoIngresado: FormGroup;

  files: File[] = [];
  public Data: any;

  public n_ingreso: any;


  constructor(private productosfarmacia: ProductosService,
              private authService: AuthService,
              private stockService: StockService,
              private fb: FormBuilder,) {

  }

	onSelect(event) {
		console.log(event);
    if(event.addedFiles[0].name.split('.').pop() === 'xlsx'){
      this.selectedFile = event.addedFiles;
      // console.log(this.selectedFile[0].name)
      this.readFile(this.selectedFile[0])
    }else{

    }

	}
  onSelectFile(event) {
    if(event.target.files[0].name.split('.').pop() === 'xlsx'){
      console.log(event.target.files);
      this.selectedFile = event.target.files;
      this.readFile(this.selectedFile[0])
    }else{
      // console.log('pare que no paso na')
    }

	}

	onRemove(event) {
		// console.log(event);
		this.selectedFile = null;
	}

  readFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* Leer workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* Obtener el nombre de la primera hoja */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* Guardar datos */
      const data = XLSX.utils.sheet_to_json(ws, {header: 1});

    /* Filtrar filas sin datos */
    const filteredData = data.filter(row => row.length > 0);
    this.Data = filteredData
    // console.log(filteredData);  // imprime la data filtrada, sin filas vacías

    };
    reader.readAsBinaryString(file);
  }

  subirCarga() {

    this.stockService.getEstadoIngreso().subscribe(response => {
      let estado = response[0].estado
      this.n_ingreso = response[0].id

      if (estado === true){
        this.formEstadoIngreso = this.fb.group({
          estado: false,
          farmaceuta: this.authService.getUserId(localStorage.getItem('token')),
        })
        let estadoOrdenIngreso = this.formEstadoIngreso.value
        this.stockService.createEstadoIngreso(estadoOrdenIngreso).subscribe(respuesta => {
          console.log(respuesta)
          this.n_ingreso = respuesta.id
          this.stockService.updateEstadoIngreso(this.n_ingreso).subscribe();

        })
      } else if (estado === false) {
        this.stockService.deteleProductosIngresados().subscribe()
        this.stockService.updateEstadoIngreso(this.n_ingreso).subscribe();
      }
    }

    // })
    )

    this.Data.slice(1).forEach(element => {

      this.formCrearProducto = this.fb.group({
        marca_producto: element[0],
        proveedor: '',
        p_a: element[1],
        dosis: element[2],
        presentacion: element[4],
        precio: element[7],
        cenabast: element[6],
        bioequivalencia: element[9],
        laboratorio_id: 1,
        laboratorio: element[5],
        autor: this.authService.getUserId(localStorage.getItem('token')),
      })
      console.log(this.formCrearProducto.value)
    this.formCrearProducto.addControl('stock_minimo', new FormControl(''));

    let producto = this.formCrearProducto.value;
    producto.laboratorio = this.formCrearProducto.get('laboratorio').value;

    const stockMinimo = 5;

    this.productosfarmacia.createProducto(producto).subscribe(response => {
      // console.log(response);
      const idProducto = response.id;

      this.stockService.createBodega(idProducto, stockMinimo).subscribe(bodegaResponse => {
        // this.formProductoIngresado = this.fb.group({
        //   cantidad: element[8],
        //   lote: element[10],
        //   precio_compra: '',
        //   precio_venta: element[7],
        //   n_factura: '',
        //   producto: idProducto,
        //   n_venta: 0,
        // })
        let producto_ingresado_aux = {
          cantidad: element[8],
          lote: element[10],
          precio_compra: null,
          precio_venta: element[7],
          n_factura: '',
          nombre: response.id,
          n_venta: this.n_ingreso,
        }
        this.stockService.createProductoIngresado(producto_ingresado_aux).subscribe(respuesta => {

        })

      }, error => {
        console.log('Error al crear la bodega:', error);
      });

    }, (error) => {
      console.log(error);
    });



    });
}

}
