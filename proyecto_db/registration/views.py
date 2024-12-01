from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy

class UserLoginView(LoginView):
    template_name = 'registration/login.html'