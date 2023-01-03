# University attendance web application
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

# **Distinctiveness and Complexity**:
This project is sufficiently distinct from the previous projects (Search, Wiki, Commerce, Mail and Network) and is definetly not based on the old CS50W Pizza project. Stripe API is not used in this project, it is not a commerce/auction website, it is not alike a Wikipedia type of website and it also have nothing in common with a Network or Mail application. This application uses `Django`, `React`, `Javascript` and `djangorestframework` as API in order to render data with React and Javascript. The database used for this project is PostgreSQL 14 as recommended in the Django documentation on databases. The web application is mobile-responsive, using `bootstrap`.

This web application has nothing in common with the previous projects from the course, it is not based on the CS50W Pizza project and it is much more complex than those. It is much more complex then those projects because it is using `djangorestframework` as API to be consumed with React witch was integrated using the CDN scripts provided in the documentation. I also believe that the project is much more complex because of the content, an attendance applications is much more complex than the projects in this course beause it is using more dependencies, more models, more pages. It uses 11 models, a `PostgreSQL` database, `djangorestframework`, `bootstrap 5.1.3`, `MDN` cdn, `React`, `jQuery`,unlike any other previous project therefore it is indeed much more complex and distinct from the other projects.

API folder contains 2 main files and are responsible for the rest framework, used to render data in the front-end: 
1: `serializers.py` which has the role of importing and serializeing the models from the database.

2: `views.py` containing the view sets for the API endpoints.

3: `apps.py` file, that configurates the API.

The routers can be found in the `facultate` folder, inside the `urls.py` file.

Facultate folder:
1: The most important file in a Django project, `settings.py` has a few lines added for changing the database default engine from the default SQLite to PostgreSQL, `rest_framework`, `api`, `prezenta` as an installed app inside `INSTALLED_APPS`, configured `REST_FRAMEWORK` settings and edited template directory path.

2: `urls.py` contains the urls of the project `prezenta` and also the routers for the API endpoints.

Prezenta folder:

1: Static files using `Javascript` and `React`. (images/*.js files):
   - `cataloage.js` is the `React` file that renders the display of grades and attendance view.
   
   - `facultati.js` file  is also a `React` file that renders the list of all the universities listed in the web-application.
   
   - `lista_asteptare.js`, another `React` file that is responsible for the the professor's view and approving\removing the attendance of the students when it's requested.
    
   - `panel.js` is a file that uses `JavaScript` to help with the functions provided for the admins (or professors), rendered in `prezenta/templates/prezenta/admin_profesori.html`.
   
   - `prezenta.js` is the main `React` file that renders the view to apply and select attendance.
   
   - `styles.css` is the `CSS` external file, that contains custom classes or id's I created for the application.

2: Templates for the website. (*.html files)

3: `models.py` contains all the models registred in the database.

- `User` model, self explaining, pretty much, nothing more to add.

- `Facultate` model, "University".

- `Specializare` model, "Specialization".

- `Materie` model, "Subject".

- `Student` model.

- `Prezente` model, "Attendance".

- `Grades` model.

- `Profesor` model.

- `Materii_profesor` model.

- `Planificare` model, "Planning" model, will be used as I continue to develop the application in order to schedule the exams for each university.

- `Asteptare` model.

4: `urls.py` file has all the urls related to the functions (16 paths in total).

5: `views.py` contains all the backend functions that run the website, responsible for rendering and processing information.

6: In the templates folder we can find the `.html` files defining the web pages, including `layout.html` containing the CDNs that were used in order to design the website in a mobile-responsive way, use React, `fontawesome` CDN, `Google Fonts` CDN, `MDB` CDN, `Bootstrap 5.1.3` CDN, `jQuery` CDN and the `babel-standalone@6` script CDN.

We also have the `requirements.txt` to save the dependecies used for the project, `pip` can help installing them easier in a container.

### Folder structure:
```
main                                                                           
└─ facultate                                                                                 
   ├─ api                                                                                    
   │  ├─ serializers.py                  
   │  ├─ views.py
   ├─ facultate                                                                              
   │  ├─ settings.py                                                                         
   │  ├─ urls.py                                   
   ├─ prezenta                                                                                                  
   │  ├─ static                                                                              
   │  │  ├─ images                                                                           
   │  │  │  ├─ grumpy.png                                                                    
   │  │  │  └─ inginerie.jpg                                                                 
   │  │  └─ prezenta                                                                         
   │  │     ├─ cataloage.js                                                                  
   │  │     ├─ facultati.js                                                                  
   │  │     ├─ panel.js                                                                      
   │  │     ├─ prezenta.js                                                                   
   │  │     └─ styles.css                                                                    
   │  ├─ templates                                                                           
   │  │  └─ prezenta                                                                         
   │  │     ├─ admin_profesori.html                                                          
   │  │     ├─ cataloage.html                                                                
   │  │     ├─ cont.html                                                                     
   │  │     ├─ error.html                                                                    
   │  │     ├─ examene.html                                                                  
   │  │     ├─ facultate.html                                                                
   │  │     ├─ index.html                                                                    
   │  │     ├─ layout.html                                                                   
   │  │     ├─ login.html                                                                    
   │  │     ├─ materie.html                                                                  
   │  │     └─ register.html                                                                            
   │  ├─ admin.py                                                                                         
   │  ├─ models.py                                                                       
   │  ├─ urls.py                                                                             
   │  ├─ views.py                                                                     
   ├─ manage.py                                                                              
   └─ requirements.txt                                                                       
``` 

### Dependencies
- Python 3 & pip3
- PostgreSQL 14
```asgiref==3.5.0
Django==4.0.3
django-smart-selects==1.5.9
djangorestframework==3.13.1
psycopg2==2.9.3
psycopg2-binary==2.9.3
pytz==2021.3
six==1.16.0
sqlparse==0.4.2
tzdata==2021.5
```

### Getting started
I would recommend installing the `requirements.txt` inside a virtual environment.

In order to install and create the virtual environment, also installing the requirements, run the following commands:
```
pip3 install virtualenv
python3 -m venv /path/to/new/virtual/environment
venv/Scripts/activate
pip3 install -r requirements.txt
```
### Run
For development purposes, the project uses `192.168.100.2:8001` host as baseline for the API endpoints.
If you would like to run the project on a different host, you would have to go inside the folder `/static/prezenta/` and replace the url of the endpoints. You don't need to worry about Django accepting the host since `*`, was added in the `settings.py, ALLOWED_HOSTS=['*']`.
#### Commands
```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 192.168.100.2:8001
```
        
