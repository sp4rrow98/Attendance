from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone as tz
from django.contrib.auth.models import AbstractUser
from django.db.models import SET_NULL
from django.utils import timezone, dateformat

formatted_date = dateformat.format(timezone.now(), 'Y-m-d H:i:s')
# !
# !
# !
# De adaugat relatia intre User si Student sau Profesor.
# De modificat in views tot ce tine de inregistrare pentru a evita erorile.
# !
# !
# !


class User(AbstractUser):
    profesor = models.BooleanField(default=False)
    specializare = models.ForeignKey('Specializare', on_delete=models.DO_NOTHING, blank=True, null=True)
    materii = models.ManyToManyField('Materie', related_name="materii", blank=True)

# Create your models here.
class Facultate(models.Model):
    nume = models.CharField(max_length=200, blank=False, unique=True)
    prescurtare = models.CharField(max_length=10, blank=True)
    # Autofill the prescurtare (short) field
    def save(self, *args, **kwargs):
        if not self.prescurtare:
            nume = self.nume
            nume = nume.upper()
            lista = nume.split()
            prescurtare = ""
            for cuvant in lista:
                if len(cuvant) > 2:
                    prescurtare += cuvant[0]
            self.prescurtare = prescurtare
            super().save(self, *args, **kwargs)

    def __str__(self, *args, **kwargs):
        return f"{self.nume} ({self.prescurtare})"

# Inca un model pentru grupa?!
class Specializare(models.Model):
    # choices for the year
    class ANUL(models.IntegerChoices):
        INTAI = 1
        DOI = 2
        TREI = 3
        PATRU = 4
    
    specializare = models.CharField(max_length=150, blank=False)
    facultate = models.ForeignKey(Facultate, on_delete=models.CASCADE, blank=False)
    grupa = models.IntegerField(blank=False) 
    an = models.IntegerField(choices=ANUL.choices)
    specializare_prescurtare = models.CharField(max_length=10, blank=True)
    # If a Specializare is changed from django-admin, there will be an error because of the overwritten save method. LOOK INTO THAT
    # COMMENT: This is a well known problem, everyone seems to avoid it.
    # COMMENT 2: I tried a walk around this problem but it seems like the database needs some extra-configurations for a proper fix
    # autofill the specializare_prescurtare field 
    def save(self, *args, **kwargs):
        if not self.specializare_prescurtare:
            specializare = self.specializare
            specializare = specializare.upper()
            lista = specializare.split()
            prescurtare = ""
            for cuvant in lista:
                if len(cuvant) > 2:
                    prescurtare += cuvant[0]
            self.specializare_prescurtare = prescurtare
        super().save(self, *args, **kwargs)

    # Format
    def __str__(self):
        return f"{self.specializare_prescurtare}, anul {self.an}, ({self.grupa})"

class Materie(models.Model):
    # Choices for course method
    class Metoda_de_predare(models.TextChoices):
        CURS = 'CURS', _('Curs')
        SEMINAR = 'SEM', _('Seminar')
        LABORATOR = 'LAB', _('Laborator')

    # Choices for the day that the course is held 
    LUNI = 0
    MARTI = 1
    MIERCURI = 2
    JOI = 3
    VINERI = 4
    INFIECARE_CHOICES = (
        (LUNI, 'Luni'),
        (MARTI, 'Marti'),
        (MIERCURI, 'Miercuri'),
        (JOI, 'Joi'),
        (VINERI, 'Vineri')
    )

    nume_materie = models.CharField(max_length=200, blank=False)
    metoda_de_predare = models.CharField(choices=Metoda_de_predare.choices, max_length=4)
    durata_predare = models.IntegerField(default="14")
    in_fiecare = models.IntegerField(choices=INFIECARE_CHOICES, blank=True, null=True)
    profesor = models.ForeignKey('Profesor', on_delete=SET_NULL, null=True, blank=True)
    specializare = models.ForeignKey('Specializare', related_name="specializari", blank=True, on_delete=models.CASCADE, null=True)
    open = models.BooleanField(default=False)

    def __str__(self):
        return f" ({self.metoda_de_predare}) {self.nume_materie}, {self.specializare}"

    class Meta:
        ordering = ['nume_materie']

# De modificat materii in materie
class Student(models.Model):
    user = models.CharField(max_length=30, default="user")
    nume = models.CharField(max_length=100)
    prenume = models.CharField(max_length=100)
    specializare = models.ForeignKey(Specializare, on_delete=models.CASCADE)
    materii = models.ManyToManyField(Materie, blank=True)

    def __str__(self):
        return f"{self.nume} {self.prenume}"

class Prezente(models.Model):
    elev = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    materie = models.ForeignKey(Materie, on_delete=models.CASCADE)
    prezenta = models.BooleanField(default=True, blank=True)
    date = models.DateTimeField(default=formatted_date)

    def save(self, *args, **kwargs):
        if not self.prezenta:
            self.prezenta == True
        super(Prezente, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.elev}, {self.materie}, {self.prezenta}"

class Grades(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    materie = models.ForeignKey(Materie, on_delete=models.CASCADE)
    nota = models.IntegerField(default=0, validators=[MinValueValidator(1), MaxValueValidator(10)])

class Profesor(models.Model):
    nume = models.CharField(max_length=30)
    prenume = models.CharField(max_length=100)
    materii = models.ManyToManyField(Materie, blank=True, related_name='materie')

    def __str__(self):
        return f"{self.nume} {self.prenume}"

class Materii_profesor(models.Model): 
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    materii = models.ManyToManyField(Materie)

    def __str__(self):
        return f'Profesor {self.profesor}'

class Planificare(models.Model):
    zi = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=1)
    saptamana = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(7)], default=1)
    an = models.IntegerField(default=2022)
    grupa = models.ForeignKey(Specializare, on_delete=models.CASCADE, default=None)
    ora = models.IntegerField(validators=[MinValueValidator(8), MaxValueValidator(16)], default=8)
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE, default=None)

class Asteptare(models.Model):
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE, null=True, default=None)
    materie = models.ForeignKey(Materie, on_delete=models.CASCADE, null=True, default=None)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, default=None)
    date_sent = models.DateTimeField(default=formatted_date)

    def __str__(self):
        return f"{self.profesor} a deschis prezenta {self.materie}"



