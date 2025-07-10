# Imagen base
FROM python:3.11-slim

# Seteamos directorio de trabajo
WORKDIR /app

# Copiamos los archivos del backend
COPY . /app

# Instalamos dependencias
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expone el puerto de Django
EXPOSE 8000

# Comando por defecto
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
