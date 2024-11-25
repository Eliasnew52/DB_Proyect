from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy

class UserLoginView(LoginView):
    template_name = 'registration/login.html'
    redirect_authenticated_user = True
    next = reverse_lazy('dashboard')
