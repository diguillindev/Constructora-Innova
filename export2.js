// Función para exportar a Excel (.xlsx)
function exportarAExcel() {
    if (!presupuestoActual) {
        alert('No hay un presupuesto creado para exportar.');
        return;
    }

    // Parsear los valores de los totales
    const valorNeto = parsearPesosChilenos(valorNetoSpan.textContent);
    const valorGanancias = parsearPesosChilenos(valorGananciasSpan.textContent);
    const valorConIva = parsearPesosChilenos(valorConIvaSpan.textContent);

    // Crear los datos para la hoja de cálculo
    const worksheetData = [
        ['Presupuesto del Cliente'],
        ['Cliente:', presupuestoActual.cliente],
        ['Fecha:', new Date(presupuestoActual.fecha).toLocaleDateString()],
        [], // Fila vacía para separar secciones
        ['Materiales'],
        ['Tipo', 'Medidas', 'Cantidad', 'Precio Unitario', '% Ganancia', 'Precio Total', 'Precio con Ganancia']
    ];

    // Agregar los materiales al array
    materiales.forEach(material => {
        const precioTotal = material.calcularPrecioTotal();
        const precioConGanancia = material.calcularPrecioConGanancia();
        worksheetData.push([
            material.tipo,
            material.medidas,
            material.cantidad,
            formatearPesosChilenos(material.precioUnitario),
            `${material.porcentajeGanancia}%`,
            formatearPesosChilenos(precioTotal),
            formatearPesosChilenos(precioConGanancia)
        ]);
    });

    // Agregar los totales
    worksheetData.push(
        [],
        ['Valor Neto:', '', '', '', '', '', formatearPesosChilenos(valorNeto)],
        ['Valor con Ganancias:', '', '', '', '', '', formatearPesosChilenos(valorGanancias)],
        ['Valor Total (IVA 19%):', '', '', '', '', '', formatearPesosChilenos(valorConIva)]
    );

    // Crear el libro de trabajo y la hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Presupuesto');

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, 'presupuesto.xlsx');
}

// Función para exportar a Google Docs (CSV)
function exportarAGoogleDocs() {
    if (!presupuestoActual) {
        alert('No hay un presupuesto creado para exportar.');
        return;
    }

    // Parsear los valores de los totales
    const valorNeto = parsearPesosChilenos(valorNetoSpan.textContent);
    const valorGanancias = parsearPesosChilenos(valorGananciasSpan.textContent);
    const valorConIva = parsearPesosChilenos(valorConIvaSpan.textContent);

    // Crear los datos en formato CSV
    let csvContent = "Presupuesto del Cliente\n";
    csvContent += `Cliente:,${presupuestoActual.cliente}\n`;
    csvContent += `Fecha:,${new Date(presupuestoActual.fecha).toLocaleDateString()}\n`;
    csvContent += "\nMateriales\n";
    csvContent += "Tipo,Medidas,Cantidad,Precio Unitario,% Ganancia,Precio Total,Precio con Ganancia\n";

    // Agregar los materiales
    materiales.forEach(material => {
        const precioTotal = material.calcularPrecioTotal();
        const precioConGanancia = material.calcularPrecioConGanancia();
        csvContent += `${material.tipo},${material.medidas},${material.cantidad},${formatearPesosChilenos(material.precioUnitario)},${material.porcentajeGanancia}%,${formatearPesosChilenos(precioTotal)},${formatearPesosChilenos(precioConGanancia)}\n`;
    });

    // Agregar los totales
    csvContent += `\nValor Neto:,,,,,,${formatearPesosChilenos(valorNeto)}\n`;
    csvContent += `Valor con Ganancias:,,,,,,${formatearPesosChilenos(valorGanancias)}\n`;
    csvContent += `Valor Total (IVA 19%):,,,,,,${formatearPesosChilenos(valorConIva)}\n`;

    // Descargar el archivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'presupuesto.csv';
    link.click();
}