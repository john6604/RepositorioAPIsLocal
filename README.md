# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

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

//Migrar a postgress en railway
# Sitúate en tu carpeta backend
cd APIS/gestorAPIs-main/backend

# Asegúrate de estar “linked” al proyecto correcto
railway link

# Instala deps (por si acaso):
railway run pip install -r requirements.txt

# Aplica migraciones:
railway run python manage.py migrate --no-input
