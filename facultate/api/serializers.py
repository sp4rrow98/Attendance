from rest_framework import serializers

from prezenta.models import (Asteptare, Facultate, Grades, Materie, Prezente,
                             Specializare, Student, Profesor)


class SpecializareSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Specializare
        fields = ["specializare", "id", "grupa", "an", "specializare_prescurtare", "facultate"] 
        depth = 2

class FacultateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Facultate
        fields = ['id', 'nume', 'prescurtare']

class MaterieSerializer(serializers.ModelSerializer):
    # specializare = serializers.CharField(source='specializare.specializare',read_only=True)
    specializare = SpecializareSerializer
    class Meta:
        model = Materie
        fields = ['id', 'specializare', 'nume_materie', 'metoda_de_predare', 'profesor', 'durata_predare']
        depth = 2

class StudentSerializer(serializers.ModelSerializer):
    materii = MaterieSerializer
    class Meta:
        model = Student
        fields = ['id', 'nume', 'prenume', 'specializare', 'materii', 'id']
        depth = 2

class PrezenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prezente
        fields = ['id', 'elev', 'materie', 'date']

class GradesSerializer(serializers.ModelSerializer):
    student = StudentSerializer
    materie = MaterieSerializer
    class Meta:
        model = Grades
        fields = ['id', 'student', 'materie', 'nota']

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = '__all__'

class AsteptareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asteptare
        fields = ['id', 'student', 'materie', 'profesor']
        depth = 1
        
    # Stack overflow 
    def __init__(self, *args, **kwargs):
        super(AsteptareSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method=='POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1
