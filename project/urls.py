from django.urls import path
from . import views

urlpatterns = [
    path('', views.project_list, name='project_page'), # Diubah dari project_page ke project_list
]