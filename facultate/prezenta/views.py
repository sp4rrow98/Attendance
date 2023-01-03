
from django.shortcuts import render, HttpResponseRedirect
from psycopg2 import IntegrityError
from .models import Grades, Profesor, Specializare, Materie, Facultate, Student, User, Asteptare
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.decorators import login_required
from django.urls import reverse 
from django.contrib import messages
from threading import Timer

# Login
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember = request.POST.get("remember")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if remember:
                try:
                    request.session.set_expiry(60000)
                except:
                    pass
            return HttpResponseRedirect(reverse('index'))
        else:
            messages.warning(request, "Contul sau parola este gresita.")
            return HttpResponseRedirect(reverse('login'))
    return render(request, 'prezenta/login.html')

# Logout
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

# Register
def register_profesor(request):
    username = request.POST.get("username")
    email = request.POST.get("email")
    nume = request.POST.get("nume")
    nume = nume.lower().capitalize()
    prenume = request.POST.get("prenume")
    prenume = prenume.title()
    password = request.POST.get("password")
    confirm_password = request.POST.get("confirm_password")
    materii = request.POST.getlist("materii")

    # Error check
    if len(nume) < 3:
        messages.warning(request, "Numele are sub 3 caractere, asigura-te ca ai adaugat numele complet.")
        return HttpResponseRedirect(reverse(register_view))

    for character in nume:
        if character.isdigit() is True:
            messages.warning(request, "Numele are sub 3 caractere, asigura-te ca ai adaugat numele complet.")
            return HttpResponseRedirect(reverse(register_view))
        
    if len(prenume) < 3:
        messages.warning(request, "Prenumele are sub 3 caractere, asigura-te ca ai adaugat prenumele complet.")
        return HttpResponseRedirect(reverse(register_view))
        
    if len(username) < 3:
        messages.warning(request, "Incearca alt username.")
        return HttpResponseRedirect(reverse(register_view))

    if password != confirm_password:
        return render(request, 'prezenta/register.html', {
                "error": "The password field must be filled!"
                })
    try:
        user = User.objects.create_user(username=username, password=password, email=email, profesor=True)
        user.save()
        profesor = Profesor(nume=nume.title(), prenume=prenume.title())
        profesor.save()
        for materie in materii:
            if materie != "none":
                # materie = Materie.objects.get(id=materie)
                profesor.materii.add(materie)
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    except IntegrityError:
        return render(request, "prezenta/register.html", {
                "error": "Adauga alt username"
            })
    except Exception as e:
        messages.success(request, "Incearca alt username",extra_tags="danger")
        return HttpResponseRedirect(reverse(register_view))


def register_view(request):
    materii = Materie.objects.all().order_by("specializare")
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        nume = request.POST.get("nume")
        nume = nume.lower().capitalize()
        prenume = request.POST.get("prenume")
        prenume = prenume.lower().capitalize()
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")
        specializare = request.POST.get("specializare")
        instance = Specializare.objects.get(id=specializare)

        # Error check
        if len(nume) < 3:
            messages.warning(request, "Numele are sub 3 caractere, asigura-te ca ai adaugat numele complet.")
            return HttpResponseRedirect(reverse(register_view))

        for character in nume:
            if character.isalpha() is not True:
                messages.warning(request, "Numele are sub 3 caractere, asigura-te ca ai adaugat numele complet.")
                return HttpResponseRedirect(reverse(register_view))
        
        if len(prenume) < 3:
            messages.warning(request, "Prenumele are sub 3 caractere, asigura-te ca ai adaugat prenumele complet.")
            return HttpResponseRedirect(reverse(register_view))

        for character in prenume:
            for pre in prenume.split():
                if pre.isalpha() is not True:
                    messages.warning(request, "Prenumele are sub 3 caractere sau contine caractere nepermise.")
                    return HttpResponseRedirect(reverse(register_view))
        
        if len(username) < 3:
            messages.warning(request, "Incearca alt username.")
            return HttpResponseRedirect(reverse(register_view))

        if password != confirm_password:
            return render(request, 'prezenta/register.html', {
                "error": "The password field must be filled!"
                })

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            student = Student(nume=nume.title(), prenume=prenume.title(), specializare=instance)
            student.save()
            for materie in materii:
                if materie.specializare == instance:
                    student.materii.add(materie)

            messages.success(request, "Contul a fost creat.")
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        except IntegrityError:
            return render(request, "prezenta/register.html", {
                "error": "Adauga alt username"
            })


    specializari = Specializare.objects.all()
    return render(request, 'prezenta/register.html', context={
        "specializari": specializari,
        "materii": materii,
    })

@login_required(login_url="/login")
def index_view(request):

    return render(request, 'prezenta/index.html')

# Prezent view
@login_required(login_url="/login")
def prezenta_view(request, materie):
    if request.method == "GET":
        materia = Materie.objects.get(id=materie)
        context= {
            "materia": materia,
            "url": materie,
        }
        return render(request, 'prezenta/materie.html', context)

@login_required(login_url="/login")
def adauga_materie_grupa(request):
    if request.method == "POST":
        pass

@login_required(login_url="/login")
def cataloage_view(request):
    if request.method == "GET":
        return render(request, 'prezenta/cataloage.html') 

@login_required(login_url="/login")     
def catalog(request):
    if request.method == "GET":
        return render(request, 'prezenta/catalog')

@login_required(login_url="/login")
def admin_profesori(request):
    materii = Materie.objects.all()
    specializari = Specializare.objects.all()
    facultati = Facultate.objects.all()
    note = Grades.objects.all()
    profesori = Profesor.objects.all()
    studenti = Student.objects.all()
    context = {
        'materii': materii,
        'specializari': specializari,
        'note': note,
        'facultati': facultati,
        'profesori': profesori,
        'studenti': studenti,
    }

    if request.method == "GET":
        if request.user.profesor == True or request.user.is_superuser == True:
            return render(request, 'prezenta/admin_profesori.html', context)
        else:
            return render(request, 'prezenta/error.html', context={
                "message": "Esti profesor?",
            })

@login_required(login_url="/login")
def adauga_materie(request):
    materie = request.POST.get("materie")
    metoda = request.POST.get("metoda_de_predare")
    metoda = metoda.upper()
    profesor = request.POST.get("profesor")
    lista_specializare = request.POST.getlist("specializare")
    for specializare in lista_specializare:
        try:
            specializare = Specializare.objects.get(id=specializare)
        except Specializare.DoesNotExist:
            messages.success(request, "Adauga o specializare.", extra_tags="warning")
        if profesor != "None":
            try:
                instance = Profesor.objects.get(id=profesor)
                new = Materie(nume_materie=materie.title(), metoda_de_predare=metoda, profesor=instance, specializare=specializare)
            except Profesor.DoesNotExist:
                messages.success(request, "Asigura-te ca ai adaugat un profesor pentru materie.", extra_tags="warning")
                return HttpResponseRedirect(reverse(admin_profesori))
        new = Materie(nume_materie=materie.title(), metoda_de_predare=metoda,  specializare=specializare)
        new.save()
    messages.success(request, "Materie adaugata.")
    return HttpResponseRedirect(reverse(admin_profesori))

@login_required(login_url="/login")
def adauga_materie_student(request):
    materii = request.POST.getlist("materie")
    student = request.POST.get("student_adauga_materie")
    try:
        student = student.split()[:-1]
        nume = student[0]
        prenume = student[1::]
        prenume = ' '.join(prenume)
    except Exception as e:
        messages.warning(request, "Cadsa.", extra_tags="danger")
        return HttpResponseRedirect(reverse(admin_profesori))
    try:
        student = Student.objects.get(nume=nume.title(), prenume=(prenume.title()))
        materiii = student.materii.all()
        for materie in materii:
            materie = int(materie)
            print(materie)
            for m in materiii:
                m = m.id
                print(m)
                if materie is not m:
                    student.materii.add(materie)
                else: 
                    print("e")
                    # ERROR: loops through all materii and adds unnecessary manytomany instances
                    # FIX: check if materie is already in the field and add ONLY if there is not
        messages.success(request, 'Materia a fost adaugata.')
        return HttpResponseRedirect(reverse(admin_profesori))
    except IntegrityError:
        messages.warning(request, "Ceva nu a mers, incearca din nou sau contacteaza adminul.", extra_tags="danger")
        return HttpResponseRedirect(reverse(admin_profesori))

@login_required(login_url="/login")
def adauga_specializare(request):
    specializare = request.POST.get("specializare")
    facultate = request.POST.get("facultate")
    instance = Facultate.objects.get(id=facultate)
    grupa = request.POST.get("grupa")
    an = request.POST.get("an")

    # Check if grupa already exists
    sp = Specializare.objects.all()
    list = []
    for gr in sp:
        list.append(gr.grupa)

    if not int(grupa) in list:
        add = Specializare(specializare=specializare.title(),grupa=grupa, an=an, facultate=instance)
        add.save()
        messages.success(request, "Specializarea a fost adaugata")
    else:
        messages.warning(request, "Numarul grupei apartine altei specializari. Incearca alt numar")

    return HttpResponseRedirect(reverse(admin_profesori))

@login_required(login_url="/login")
def adauga_note(request):
    student = request.POST.get("student")
    #  If full name is provided
    try: 
        nume = student.split()[0]
        prenume = student.split()[1]
    except IndexError:
        messages.warning(request, 'Numele este prea scurt sau nu este alcatuit din "nume" si "prenume". ')
        return HttpResponseRedirect(reverse(admin_profesori))
    except TypeError:
        messages.warning(request, 'Incearca alt nume')
        return HttpResponseRedirect(reverse(admin_profesori))
 
    nume = nume.lower().capitalize()
    prenume = prenume.lower().capitalize()
    try:
        student = Student.objects.get(nume=nume.title(), prenume=prenume.title())
    except Exception as e:
        messages.warning(request, 'Ceva nu a functionat. Contacteaza administratorul site-ului.')
        return HttpResponseRedirect(reverse(admin_profesori))

    materie = request.POST.get("materie")
    nota = request.POST.get("nota")
    materie = Materie.objects.get(id=materie)
    add = Grades(student=student, materie=materie, nota=nota)
    add.save()
    
    messages.success(request, "Nota inregistrata cu succes.")
    return HttpResponseRedirect(reverse(admin_profesori))

def adauga_facultate(request):
    facultate = request.POST.get("facultate")
    f = Facultate(nume=facultate.title())
    try:
        f.save()
        messages.success(request, "Facultate adaugata.")
        return HttpResponseRedirect(reverse(admin_profesori))
    except Exception as e:
        messages.warning(request, "Ceva nu a functionat.")
        return HttpResponseRedirect(reverse(admin_profesori))


def specializare(request, id):
    specializare = Specializare.objects.get(id=id)
    id = specializare.id
    materii = Materie.objects.filter(specializare=id)
    context = {
        "materii": materii,
        "specializare": specializare,
    }
    return render(request, 'prezenta/specializare.html', context)

@login_required(login_url="/login")
def profesor_materie(request):
    profesor = request.POST.get("profesor")
    materii = request.POST.getlist("materie")
    for materie in materii:
        try:
            prof_instance = Profesor.objects.get(id=profesor)
            materie = Materie.objects.get(id=materie)
            try:
                prof_instance.materii.add(materie)
                materie.profesor = prof_instance
            except Exception as e:
                messages.warning(request, "Ceva nu a functionat. Contacteaza adminul.")
                return HttpResponseRedirect(reverse(admin_profesori))
            materie.save()
            prof_instance.save()
        except Exception as e:
            messages.warning(request, "Ceva nu a functionat, contacteaza adminul.")
            return HttpResponseRedirect(reverse(admin_profesori))
    messages.success(request, "Profesor adaugat.")
    return HttpResponseRedirect(reverse(admin_profesori))

def prezenta_timing(request):
    if request.method == "POST":
        url = request.POST.get("url")
        profesor = request.user.id
        profesor = Profesor.objects.get(id=profesor)
        materie = Materie.objects.get(id=url)
        if materie.open is False:
            materie.open = True
        else:
            materie.open = False
        materie.save()

        return HttpResponseRedirect(reverse(prezenta_view, kwargs={'materie' : url},))