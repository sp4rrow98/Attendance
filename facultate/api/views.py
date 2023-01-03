from rest_framework import permissions, viewsets

from prezenta.models import (Asteptare, Facultate, Grades, Materie, Prezente,
                             Specializare, Student, Profesor)

from .serializers import (AsteptareSerializer, FacultateSerializer,
                          GradesSerializer, MaterieSerializer,
                          PrezenteSerializer, SpecializareSerializer,
                          StudentSerializer, ProfesorSerializer)



class FacultateViewSet(viewsets.ModelViewSet):
    queryset = Facultate.objects.all()
    serializer_class = FacultateSerializer
    permission_classes = [permissions.AllowAny]


class MaterieViewSet(viewsets.ModelViewSet):
    queryset = Materie.objects.all()
    serializer_class = MaterieSerializer
    permission_classes = [permissions.AllowAny]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.AllowAny]


class PrezenteViewSet(viewsets.ModelViewSet):
    queryset = Prezente.objects.all()
    serializer_class = PrezenteSerializer
    permission_classes = [permissions.AllowAny]

class SpecializareViewSet(viewsets.ModelViewSet):
    queryset = Specializare.objects.all()
    serializer_class = SpecializareSerializer
    permission_classes = [permissions.AllowAny]

class GradesViewSet(viewsets.ModelViewSet):
    queryset = Grades.objects.all()
    serializer_class = GradesSerializer
    permission_classes = [permissions.AllowAny]

class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer
    permission_classes = [permissions.AllowAny]

class AsteptareViewSet(viewsets.ModelViewSet):
    queryset = Asteptare.objects.all()
    serializer_class = AsteptareSerializer
    permission_classes = [permissions.AllowAny]
