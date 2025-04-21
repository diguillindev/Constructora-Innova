// Variables globales
let presupuestoActual = null;
let materiales = [];
const IVA = 0.19; // 19% de IVA en Chile

// Funciones de formato de moneda
function formatearPesosChilenos(numero) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numero);
}

function parsearPesosChilenos(texto) {
    if (!texto) return 0;

    // Si ya es un número, retornarlo
    if (typeof texto === 'number') return texto;

    // Eliminar el símbolo de peso, puntos y reemplazar coma por punto
    const limpio = texto.toString()
        .replace(/\$/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

    return parseFloat(limpio);
}

// Clase Material
class Material {
    constructor(tipo, medidas, cantidad, precioUnitario, porcentajeGanancia = 0) {
        this.tipo = tipo;
        this.medidas = medidas;
        this.cantidad = Number(cantidad);
        this.precioUnitario = parsearPesosChilenos(precioUnitario);
        this.porcentajeGanancia = Number(porcentajeGanancia);
    }

    calcularPrecioTotal() {
        return this.cantidad * this.precioUnitario;
    }

    calcularPrecioConGanancia() {
        const precioTotal = this.calcularPrecioTotal();
        return precioTotal + (precioTotal * this.porcentajeGanancia / 100);
    }

    actualizarPorcentajeGanancia(nuevoValor) {
        this.porcentajeGanancia = Number(nuevoValor);
    }
}

// Elementos DOM
const crearPresupuestoBtn = document.getElementById('crear-presupuesto');
const agregarMaterialBtn = document.getElementById('agregar-material');
const clienteInput = document.getElementById('cliente');
const tipoInput = document.getElementById('tipo');
const medidasInput = document.getElementById('medidas');
const cantidadInput = document.getElementById('cantidad');
const precioInput = document.getElementById('precio');
const gananciaInput = document.getElementById('ganancia');
const aumentarGananciaBtn = document.getElementById('aumentar-ganancia');
const disminuirGananciaBtn = document.getElementById('disminuir-ganancia');
const materialesSection = document.getElementById('materiales-section');
const listaMaterialesSection = document.getElementById('lista-materiales');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const valorNetoSpan = document.getElementById('valor-neto');
const valorGananciasSpan = document.getElementById('valor-ganancias');
const valorConIvaSpan = document.getElementById('valor-con-iva');

// Event listeners
crearPresupuestoBtn.addEventListener('click', crearPresupuesto);
agregarMaterialBtn.addEventListener('click', agregarMaterial);
aumentarGananciaBtn.addEventListener('click', () => {
    let valor = parseInt(gananciaInput.value) || 0;
    if (valor < 100) {
        gananciaInput.value = valor + 1;
    }
});
disminuirGananciaBtn.addEventListener('click', () => {
    let valor = parseInt(gananciaInput.value) || 0;
    if (valor > 0) {
        gananciaInput.value = valor - 1;
    }
});

// Función para crear un nuevo presupuesto
function crearPresupuesto() {
    const cliente = clienteInput.value.trim();
    if (!cliente) {
        alert('Debe ingresar el nombre del cliente');
        return;
    }

    presupuestoActual = {
        id: Date.now(), // Usamos timestamp como ID temporal
        cliente: cliente,
        fecha: new Date()
    };

    // Mostrar secciones de materiales
    materialesSection.style.display = 'block';
    listaMaterialesSection.style.display = 'block';

    // Limpiar materiales existentes
    materiales = [];
    actualizarTablaMateriales();

    alert('Presupuesto creado correctamente para: ' + cliente);
}

// Función para agregar un material al presupuesto
function agregarMaterial() {
    if (!presupuestoActual) {
        alert('Primero debe crear un presupuesto');
        return;
    }

    const tipo = tipoInput.value.trim();
    const medidas = medidasInput.value.trim();
    const cantidad = cantidadInput.value;
    const precioUnitario = precioInput.value;
    const porcentajeGanancia = gananciaInput.value;

    if (!tipo || !medidas || !cantidad || !precioUnitario) {
        alert('Debe completar todos los campos obligatorios');
        return;
    }

    const material = new Material(tipo, medidas, cantidad, precioUnitario, porcentajeGanancia);
    materiales.push(material);

    // Limpiar formulario de materiales
    tipoInput.value = '';
    medidasInput.value = '';
    cantidadInput.value = '';
    precioInput.value = '';
    gananciaInput.value = '0';

    // Actualizar tabla y totales
    actualizarTablaMateriales();
}

// Función para eliminar un material
function eliminarMaterial(index) {
    materiales.splice(index, 1);
    actualizarTablaMateriales();
}

// Función para actualizar el porcentaje de ganancia de un material
function actualizarPorcentaje(index, valor) {
    if (index >= 0 && index < materiales.length) {
        materiales[index].actualizarPorcentajeGanancia(valor);
        actualizarTablaMateriales();
    }
}

// Función para incrementar el porcentaje de ganancia de un material
function incrementarPorcentaje(index) {
    if (index >= 0 && index < materiales.length) {
        const material = materiales[index];
        if (material.porcentajeGanancia < 100) {
            material.porcentajeGanancia++;
            actualizarTablaMateriales();
        }
    }
}

// Función para decrementar el porcentaje de ganancia de un material
function decrementarPorcentaje(index) {
    if (index >= 0 && index < materiales.length) {
        const material = materiales[index];
        if (material.porcentajeGanancia > 0) {
            material.porcentajeGanancia--;
            actualizarTablaMateriales();
        }
    }
}

// Función para actualizar la tabla de materiales
function actualizarTablaMateriales() {
    cuerpoTabla.innerHTML = '';

    let valorNeto = 0;
    let valorConGanancias = 0;

    materiales.forEach((material, index) => {
        const precioTotal = material.calcularPrecioTotal();
        const precioConGanancia = material.calcularPrecioConGanancia();

        valorNeto += precioTotal;
        valorConGanancias += precioConGanancia;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.tipo}</td>
            <td>${material.medidas}</td>
            <td>${material.cantidad}</td>
            <td>${formatearPesosChilenos(material.precioUnitario)}</td>
            <td>
                <div class="porcentaje-tabla">
                    <button class="tabla-flecha-btn flecha-btn" onclick="decrementarPorcentaje(${index})">-</button>
                    <input type="number" class="porcentaje-tabla-input" value="${material.porcentajeGanancia}" 
                        min="0" max="100" onchange="actualizarPorcentaje(${index}, this.value)">
                    <button class="tabla-flecha-btn flecha-btn" onclick="incrementarPorcentaje(${index})">+</button>
                </div>
            </td>
            <td>${formatearPesosChilenos(precioTotal)}</td>
            <td>${formatearPesosChilenos(precioConGanancia)}</td>
            <td><button class="remove-btn" onclick="eliminarMaterial(${index})">Eliminar</button></td>
        `;

        cuerpoTabla.appendChild(row);
    });

    // Calcular valor con IVA (19%)
    const valorConIva = valorConGanancias + (valorConGanancias * IVA);

    // Actualizar totales
    valorNetoSpan.textContent = formatearPesosChilenos(valorNeto);
    valorGananciasSpan.textContent = formatearPesosChilenos(valorConGanancias);
    valorConIvaSpan.textContent = formatearPesosChilenos(valorConIva);
}

// Asociar eventos a los botones de exportación
document.addEventListener('DOMContentLoaded', function () {
    // Botón para exportar a Excel
    const exportarExcelBtn = document.getElementById('exportar-excel');
    if (exportarExcelBtn) {
        exportarExcelBtn.addEventListener('click', exportarAExcel);
    }

    // Botón para exportar a Google Docs (CSV)
    const exportarGoogleDocsBtn = document.getElementById('exportar-google-docs');
    if (exportarGoogleDocsBtn) {
        exportarGoogleDocsBtn.addEventListener('click', exportarAGoogleDocs);
    }
});