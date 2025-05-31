from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    print(f"Exception: {exc}, Context: {context}")
    if response is None:
        return Response({
            "success": False,
            "code": "server_error",
            "message": "Error interno del servidor",
            "errors": {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    code_map = {
        status.HTTP_400_BAD_REQUEST:    ("validation_error", "Datos inválidos"),
        status.HTTP_401_UNAUTHORIZED:    ("unauthorized",      "No autorizado"),
        status.HTTP_403_FORBIDDEN:       ("forbidden",         "Acceso denegado"),
        status.HTTP_404_NOT_FOUND:       ("not_found",         "Recurso no encontrado"),
    }
    code, message = code_map.get(response.status_code, ("error", response.data.get("detail", "Ocurrió un error")))

    raw = response.data
    normalized_errors: dict[str, list[str]] = {}

    if isinstance(raw, dict):
        for field, value in raw.items():
            if field == "detail":
                msgs = value if isinstance(value, list) else [str(value)]
                normalized_errors.setdefault("non_field_errors", []).extend(msgs)
            else:
                msgs = value if isinstance(value, list) else [str(value)]
                normalized_errors.setdefault(field, []).extend(msgs)

    elif isinstance(raw, list):
        normalized_errors["non_field_errors"] = [str(item) for item in raw]

    else:
        normalized_errors["non_field_errors"] = [str(raw)]

    return Response({
        "success": False,
        "code": code,
        "message": message,
        "errors": normalized_errors
    }, status=response.status_code)
