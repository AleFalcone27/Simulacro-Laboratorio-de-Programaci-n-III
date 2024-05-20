import { Producto } from "./auto.js";
import { escribirStorage, leerStorage, objectToJson } from "./local-storage.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const items = await leerStorage() || [];

const frm = document.getElementById("form-item");
const btnGuardar = document.getElementById("btnGuardar");
const btnEliminar = document.getElementById("btnEliminar");
const btnEliminarTodo = document.getElementById("btnEliminarTodo");
const btnModificar = document.getElementById("btnModificar");

document.addEventListener("DOMContentLoaded", () => {
  manejadorTabla();
  btnGuardar.addEventListener("click", manejadorCargarRegistro);
  btnEliminar.addEventListener('click', manejadorEliminarRegistro);
  btnModificar.addEventListener("click", manejadorModificar);
  btnEliminarTodo.addEventListener('click', manejadorEliminarTodo);
  document.addEventListener("click", manejadorClick);
});


function manejadorEliminarTodo() {
  if (confirm("¿Desea ELIMINAR TODOS los productos?")) {
    items.length = 0; 
    try {
      escribirStorage("Auto", objectToJson(items)); // Actualiza el almacenamiento
      manejadorTabla(); 
    } catch (error) {
      console.error("Error al eliminar todos los productos:", error);
    }
    actualizarFormulario(); 
    document.getElementsByName("id")[0].setAttribute("id",'0'); // Reseteamos el id del formulario
  }
}



function manejadorEliminarRegistro() {
  if (confirm("¿Desea ELIMINAR el producto seleccionado?")) {
    const idSeleccionado = parseFloat(document.getElementsByName("id")[0].getAttribute("id"));

    const itemsActualizado = items.filter(p => p.id !== idSeleccionado);

    try {
      escribirStorage("Auto", objectToJson(itemsActualizado));
      items.length = 0;
      itemsActualizado.forEach(item => items.push(item));
      manejadorTabla();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }
}



function manejadorClick(e){
  if(e.target.matches("td")){
    const id = parseFloat(e.target.parentNode.dataset.id);
    const AutoSeleccionado = items.find(p => p.id === id);
    if (AutoSeleccionado) {
      console.log("Auto Seleccionado:", AutoSeleccionado);
    } else {
      console.log("No se encontró ningún auto con el ID especificado.");
    }

    document.getElementsByName("id")[0].setAttribute("id",AutoSeleccionado.id);
    document.getElementById("titulo").value = AutoSeleccionado.titulo;
    document.getElementById("precio").value = AutoSeleccionado.precio ;
    document.getElementById("descripcion").value = AutoSeleccionado.descripcion;
    document.getElementById("puertas").value = AutoSeleccionado.puertas;
    document.getElementById("kms").value = AutoSeleccionado.kms;
    document.getElementById("potencia").value = AutoSeleccionado.potencia;
    document.getElementById(AutoSeleccionado.tipo.toLowerCase()).checked = true;

  }

}

function manejadorCargarRegistro(e) {
  e.preventDefault()

  const titulo = document.getElementById("titulo").value;
  const precio = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value;
  const puertas = document.getElementById("puertas").value;
  const kms = document.getElementById("kms").value;
  const potencia = document.getElementById("potencia").value;
  let tipo = document.getElementById("alquiler");
  
  if(tipo.checked){
    tipo = 'Alquiler'
  }
  else{
    tipo = 'Venta';
  }

  if( titulo && precio && descripcion && puertas && kms && potencia){
    const nuevoRegistro = new Producto(titulo, precio, descripcion, puertas, kms, potencia, tipo);
    console.log('Alta dada correctamente');
    escribirStorage('Auto',objectToJson(nuevoRegistro));   
    items.push(nuevoRegistro);
    manejadorTabla();
    actualizarFormulario()
  }else{
    alert("No se admiten campos vacios")
  }
}


function manejadorTabla(e) {
  mostrarSpinner()
  delay(2000).then(() => {
    const tabla = createTable(items)
    const contenedor = document.getElementById("container-table");
    renderTabla(tabla, contenedor);
    ocultarSpinner();
  });
}

/*
Limpiamos la tabla y le escribimos todos los 
*/
function renderTabla(tabla, contenedor) {
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild)
  }
  if (tabla) {
    contenedor.appendChild(tabla);
  }
}


function createTable(items) {
  const tabla = document.createElement('table');
  tabla.classList.add('my-table'); 

  if (items.length > 0) {
    tabla.appendChild(createThead(Object.keys(items[0]))); 
    const tbody = createTbody(items); 
    tabla.appendChild(tbody); 
  } else {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'No hay datos disponibles';

    tr.appendChild(th);
    thead.appendChild(tr);
    tabla.appendChild(thead);
  }
  return tabla;
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function DarAlta(th, tr, thead, tabla) {

}


function createTbody(items) {
  const tbody = document.createElement("tbody");
  items.forEach((element) => {
    const tr = document.createElement("tr"); 
    for (const key in element) {
      if (key === 'id') {
        tr.setAttribute("data-id", element[key]);
      } else {
        const td = document.createElement("td");
        td.textContent = element[key];
        tr.appendChild(td); 
      }
    }
    tbody.appendChild(tr); 
  });
  return tbody;
}



function createThead() {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  if (items.length > 0) {
    const keys = Object.keys(items[0]); 
    keys.forEach(key => {
      if (key !== 'id') { 
        const th = document.createElement("th");
        th.textContent = key;
        th.textContent = th.textContent.toUpperCase();
        tr.appendChild(th);
      }
    });
  } else { 
    const th = document.createElement('th');
    th.textContent = 'No hay datos disponibles';
    tr.appendChild(th);
  }
  
  thead.appendChild(tr);
  return thead;
}

function actualizarFormulario() {
  frm.reset();
}

function manejadorModificar() {
  const idSeleccionado = parseFloat(document.getElementsByName("id")[0].getAttribute("id"));
  const AutoSeleccionadoIndex = items.findIndex(p => p.id === idSeleccionado);

  if (AutoSeleccionadoIndex !== -1) {
    const titulo = document.getElementById("titulo").value;
    const precio = document.getElementById("precio").value;
    const descripcion = document.getElementById("descripcion").value;
    const puertas = document.getElementById("puertas").value;
    const kms = document.getElementById("kms").value;
    const potencia = document.getElementById("potencia").value;
    const tipo = document.getElementById("alquiler").checked ? 'Alquiler' : 'Venta';

    items[AutoSeleccionadoIndex] = new Producto(titulo, precio, descripcion, puertas, kms, potencia, tipo);
    
    try {
      escribirStorage("Auto", objectToJson(items));

      manejadorTabla();
      actualizarFormulario();

    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  } else {
    console.log("No se encontró ningún auto con el ID especificado.");
  }
}
