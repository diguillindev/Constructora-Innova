// Incluir jsPDF (asegúrate de incluir el script en tu HTML como se mostró antes)
const { jsPDF } = window.jspdf;

/* Función para exportar el presupuesto a PDF
function exportarPresupuestoAPDF() {
    if (!presupuestoActual) {
        alert('No hay un presupuesto creado para exportar.');
        return;
    }

    // Crear una instancia de jsPDF
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text("Presupuesto del Cliente", 10, 10);

    // Datos del cliente
    doc.setFontSize(14);
    doc.text(`Cliente: ${presupuestoActual.cliente}`, 10, 20);
    doc.text(`Fecha: ${new Date(presupuestoActual.fecha).toLocaleDateString()}`, 10, 30);

    // Totales del presupuesto
    const valorNeto = parsearPesosChilenos(valorNetoSpan.textContent);
    const valorGanancias = parsearPesosChilenos(valorGananciasSpan.textContent);
    const valorConIva = parsearPesosChilenos(valorConIvaSpan.textContent);

    doc.setFontSize(12);
    doc.text(`Valor Neto: ${formatearPesosChilenos(valorNeto)}`, 10, 40);
    doc.text(`Valor con Ganancias: ${formatearPesosChilenos(valorGanancias)}`, 10, 50);
    doc.text(`Valor Total (IVA 19%): ${formatearPesosChilenos(valorConIva)}`, 10, 60);

    // Lista de materiales
    let yPos = 70; // Posición inicial para la tabla

    // Encabezados de la tabla
    doc.setFontSize(12);
    doc.text('Tipo | Medidas | Cantidad | Precio Unitario | % Ganancia | Precio Total | Precio con Ganancia', 10, yPos);
    yPos += 10;

    // Contenido de la tabla
    materiales.forEach(material => {
        const precioTotal = material.calcularPrecioTotal();
        const precioConGanancia = material.calcularPrecioConGanancia();

        const filaTexto = `${material.tipo} | ${material.medidas} | ${material.cantidad} | ${formatearPesosChilenos(material.precioUnitario)} | ${material.porcentajeGanancia}% | ${formatearPesosChilenos(precioTotal)} | ${formatearPesosChilenos(precioConGanancia)}`;
        doc.text(filaTexto, 10, yPos);
        yPos += 10;
    });

    // Guardar el PDF
    doc.save('presupuesto.pdf');
}*/
function exportarPresupuestoAPDF() {
    if (!presupuestoActual) {
        alert('No hay un presupuesto creado para exportar.');
        return;
    }

    // Crear una instancia de jsPDF
    const doc = new jsPDF();

    // Margen general para el contenido
    const margin = 10;

    // Título del PDF
    doc.setFontSize(18);
    doc.text("Innovo Constructores", 10, 10);

    // Datos del cliente
    doc.setFontSize(14);
    doc.text(`Cliente: ${presupuestoActual.cliente}`, 10, 20);
    doc.text(`Fecha: ${new Date(presupuestoActual.fecha).toLocaleDateString()}`, 10, 30);

    // Totales del presupuesto
    const valorNeto = parsearPesosChilenos(valorNetoSpan.textContent);
    const valorGanancias = parsearPesosChilenos(valorGananciasSpan.textContent);
    const valorConIva = parsearPesosChilenos(valorConIvaSpan.textContent);

    // Preparar los datos de la tabla
    const rows = materiales.map(material => {
        const precioTotal = material.calcularPrecioTotal();
        const precioConGanancia = material.calcularPrecioConGanancia();
        return [
            material.tipo,
            material.medidas,
            material.cantidad,
            formatearPesosChilenos(material.precioUnitario),
            `${material.porcentajeGanancia}%`,
            formatearPesosChilenos(precioTotal),
            formatearPesosChilenos(precioConGanancia)
        ];
    });

    const startY = margin + 25;

    // Agregar la tabla al PDF usando autoTable
    doc.autoTable({
        startY: startY, // Posición inicial de la tabla
        head: [['Tipo', 'Medidas', 'Cantidad', 'Precio Unitario', '% Ganancia', 'Precio Total', 'Precio con Ganancia']],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        

        columnStyles: {
            0: { cellWidth: 20 }, // Tipo
            1: { cellWidth: 20 }, // Medidas
            2: { cellWidth: 20 }, // Cantidad
            3: { cellWidth: 30 }, // Precio Unitario
            4: { cellWidth: 20 }, // % Ganancia
            5: { cellWidth: 30 }, // Precio Total Interno
            6: { cellWidth: 30 }  // Precio con Ganancia Cliente
        },

        margin: { left: margin, right: margin }
    });

    // Posición final de la tabla
    const finalY = doc.lastAutoTable.finalY + 10;

    // Agregar los totales después de la tabla
    doc.setFontSize(12);
    doc.text(`Valor Neto: ${formatearPesosChilenos(valorNeto)}`, 10, finalY);
    doc.text(`Valor con Ganancias: ${formatearPesosChilenos(valorGanancias)}`, 10, finalY + 10);
    doc.text(`Valor Total (IVA 19%): ${formatearPesosChilenos(valorConIva)}`, 10, finalY + 20);

    // Guardar el PDF
    doc.save('presupuesto.pdf');
}
// Mostrar vista previa
document.getElementById('mostrar-preview').addEventListener('click', function () {
    if (!presupuestoActual) {
        alert('No hay un presupuesto creado para mostrar.');
        return;
    }

    // Mostrar el contenedor de la vista previa
    const previewContainer = document.getElementById('preview-container');
    previewContainer.style.display = 'block';

    // Ocultar el botón "Mostrar Vista Previa" y mostrar el botón "Cerrar Vista Previa"
    document.getElementById('mostrar-preview').style.display = 'none';
    document.getElementById('cerrar-preview').style.display = 'inline-block';

    // Rellenar los datos del cliente
    document.getElementById('preview-cliente').textContent = presupuestoActual.cliente;
    document.getElementById('preview-fecha').textContent = new Date(presupuestoActual.fecha).toLocaleDateString();

    // Limpiar y rellenar la tabla de materiales
    const cuerpoTablaPreview = document.getElementById('preview-cuerpo-tabla');
    cuerpoTablaPreview.innerHTML = '';

    materiales.forEach(material => {
        const precioTotal = material.calcularPrecioTotal();
        const precioConGanancia = material.calcularPrecioConGanancia();

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.tipo}</td>
            <td>${material.medidas}</td>
            <td>${material.cantidad}</td>
            <td>${formatearPesosChilenos(material.precioUnitario)}</td>
            <td>${material.porcentajeGanancia}%</td>
            <td>${formatearPesosChilenos(precioTotal)}</td>
            <td>${formatearPesosChilenos(precioConGanancia)}</td>
        `;
        cuerpoTablaPreview.appendChild(row);
    });

    // Rellenar los totales
    document.getElementById('preview-valor-neto').textContent = valorNetoSpan.textContent;
    document.getElementById('preview-valor-ganancias').textContent = valorGananciasSpan.textContent;
    document.getElementById('preview-valor-con-iva').textContent = valorConIvaSpan.textContent;
});

// Cerrar vista previa
document.getElementById('cerrar-preview').addEventListener('click', function () {
    const previewContainer = document.getElementById('preview-container');
    previewContainer.style.display = 'none';

    // Mostrar el botón "Mostrar Vista Previa" y ocultar el botón "Cerrar Vista Previa"
    document.getElementById('mostrar-preview').style.display = 'inline-block';
    document.getElementById('cerrar-preview').style.display = 'none';
});

// Asociar la función al botón de exportar
document.getElementById('exportar-pdf').addEventListener('click', exportarPresupuestoAPDF);