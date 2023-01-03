"""facultate URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('logout', views.logout_view, name="logout"),
    path('login', views.login_view, name='login'),
    path('register', views.register_view, name='register_view'),
    path('cataloage', views.cataloage_view, name='cataloage'),
    path('admin_profesori', views.admin_profesori, name='admin_profesori'),
    path('adauga_specializare', views.adauga_specializare, name='adauga_specializare'),
    path('adauga_note', views.adauga_note, name='adauga_note'),
    path('adauga_materie', views.adauga_materie, name='adauga_materie'),
    path("adauga_mateire_student", views.adauga_materie_student, name="adauga_materie_student"),
    path('adauga_materie_grupa', views.adauga_materie_grupa, name="adauga_materie_grupa"),
    path("register_profesor", views.register_profesor, name="register_profesor"),
    path('adauga_facultate', views.adauga_facultate, name="adauga_facultate"),
    path('profesor_materie', views.profesor_materie, name="profesor_materie"),
    path("specializare/<int:id>", views.specializare, name="specializare"),
    path('prezenta/<int:materie>', views.prezenta_view, name="prezenta"),
    path('prezenta_timing', views.prezenta_timing, name="prezenta_timing")
]
