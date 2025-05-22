from rest_framework.renderers import JSONRenderer

class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        if isinstance(data, dict) and 'success' in data:
            return super().render(data, accepted_media_type, renderer_context)

        message = 'Operación exitosa'
        if isinstance(data, dict) and 'message' in data:
            message = data.pop('message')
        return super().render({
            'success': True,
            'message': message,
            'result': data
        }, accepted_media_type, renderer_context)