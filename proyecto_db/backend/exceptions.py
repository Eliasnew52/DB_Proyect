from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    error_code = "error"
    message = "Ocurrió un error"
    errors = None

    if response is not None:
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            error_code = "validation_error"
            message = "Datos inválidos"
            errors = response.data
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            error_code = "not_found"
            message = "Recurso no encontrado"
            errors = response.data
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            error_code = "unauthorized"
            message = "No autorizado"
            errors = response.data
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            error_code = "forbidden"
            message = "Acceso denegado"
            errors = response.data
        else:
            message = response.data.get('detail', message)
            errors = response.data

        return Response({
            "success": False,
            "message": message,
            "errors": errors,
            "code": error_code
        }, status=response.status_code)

    return Response({
        "success": False,
        "message": "Error interno del servidor",
        "errors": None,
        "code": "server_error"
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)