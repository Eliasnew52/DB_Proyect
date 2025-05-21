from rest_framework.renderers import JSONRenderer

class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response', None)
        status_code = getattr(response, 'status_code', 200)
        message = ''
        success = 200 <= status_code < 300

        # Si es error de validación
        if not success:
            message = data.get('detail', 'Ocurrió un error')
            return super().render({
                'success': False,
                'message': message,
                'errors': data
            }, accepted_media_type, renderer_context)

        # Para respuestas exitosas
        if isinstance(data, dict) and 'message' in data:
            message = data.pop('message')
        else:
            message = 'Operación exitosa'

        return super().render({
            'success': True,
            'message': message,
            'result': data
        }, accepted_media_type, renderer_context)