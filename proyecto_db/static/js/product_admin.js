function simplifySchema(schema) {
    const result = {};
    for (const key in schema) {
      const field = schema[key];
      if (field.enum) {
        result[key] = field.enum;
      }
    }
    return JSON.stringify(result, null, 2);
  }

document.addEventListener('DOMContentLoaded', function () {
    const categorySelect = document.getElementById('id_category');
    const attributesField = document.getElementById('id_attributes');

    if (!categorySelect || !attributesField) return;

    function updateAttributes(schema) {
        attributesField.value = simplifySchema(schema.properties);
    }

    categorySelect.addEventListener('change', function () {
        const categoryId = this.value;
        if (categoryId) {
            fetch(`/api/category-schema/${categoryId}/`)
                .then(res => res.json())
                .then(schema => updateAttributes(schema))
                .catch(err => {
                    console.error('Error al cargar el schema:', err);
                });
        }
    });
});
