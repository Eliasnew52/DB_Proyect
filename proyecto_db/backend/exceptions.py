from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        return response
    from rest_framework.response import Response
    return Response({
        'success': False,
        'message': 'Error interno del servidor',
        'errors': str(exc)
    }, status=500)