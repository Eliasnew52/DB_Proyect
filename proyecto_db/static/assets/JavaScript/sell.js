document.getElementById('add-form').addEventListener('click', function() {
    // Obtener el total de formularios y el índice del nuevo formulario
    const totalForms = document.querySelector('#id_detalleventa_set-TOTAL_FORMS');
    const formIndex = parseInt(totalForms.value);

    // Clonar el último formulario
    const container = document.getElementById('formset-container');
    const lastForm = container.querySelector('.detalleventa-form:last-of-type');
    const newForm = lastForm.cloneNode(true);

    // Actualizar los nombres e IDs en el nuevo formulario
    newForm.querySelectorAll('input, select, textarea').forEach(function(input) {
        const name = input.name.replace(`-${formIndex - 1}-`, `-${formIndex}-`);
        const id = input.id.replace(`-${formIndex - 1}-`, `-${formIndex}-`);
        input.name = name;
        input.id = id;

        // Limpiar los valores
        if (input.type !== 'hidden') {
            input.value = '';
        }
    });

    // Agregar el nuevo formulario al contenedor
    container.querySelector('tbody').appendChild(newForm);

    // Incrementar el número total de formularios
    totalForms.value = formIndex + 1;
});