Pasos para iniciar el entorno:

//Entorno virtual
python -m venv venv
venv/Scripts/activate
source venv/bin/activate //Nube

//Instalaciones - Dependencias
Raiz del proyecto
pip install django djangorestframework django-cors-headers

cd frontend
npm install axios react-router-dom
npm -i lucide-react

// BACKEND
LEVANTAR SERVER: python manage.py runserver

//FRONTEND 
npm start

//FINALIZAR
Ctrl + C
deactivate# Pasos para iniciar el entorno:

## Entorno virtual
### Crear entorno virtual
python -m venv venv

### Activar entorno virtual
#### Windows
venv/Scripts/activate
#### Linux/Mac
source venv/bin/activate

## Instalaciones - Dependencias
### Raiz del proyecto
pip install django djangorestframework django-cors-headers

### Frontend
cd frontend
npm install axios react-router-dom
npm install lucide-react

## Iniciar servidores
### Backend
python manage.py runserver

### Frontend
npm start

## Finalizar
### Detener servidores
Ctrl + C

### Desactivar entorno virtual
deactivate

### Salir de la terminal
exit

## Hacer commit
### Agregar archivos
git add .

### Verificar archivos
git status

### Realizar commit
git commit -m "TITULO"

### Enviar cambios
git push --force origin main
exit

//HACER COMMIT
git add .
git status //ver los archivos que se van a actualizar 
git commit - m "TITULO"
git push --force origin main