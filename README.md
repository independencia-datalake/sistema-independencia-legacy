# sistema-independencia
## Proposito del proyecto

El propósito de este proyecto es crear una plataforma que recopile información relevante sobre la Municipalidad de Independencia y la visualice de manera intuitiva, con el fin de ayudar en la toma de decisiones políticas y administrativas. El objetivo es optimizar los recursos limitados de la municipalidad, centrándose en los problemas que requieren mayor atención y brindando soluciones efectivas para la comunidad.

## Tecnologías utilizadas
- Backend: [Django](https://docs.djangoproject.com/)
- Frontend: [Angular](https://angular.io/)
- Base de datos: PostgreSQL

El proyecto utiliza Django como framework para el backend y Angular para el frontend. La base de datos utilizada es PostgreSQL, un sistema de gestión de bases de datos relacional.

## Requisitos del sistema
Antes de instalar y ejecutar el proyecto, asegúrate de que tu sistema cumple con los siguientes requisitos:

### Requisitos de hardware
- Procesador: 1 GHz o superior
- Memoria RAM: 2 GB o superior
- Espacio en disco duro: al menos 5 GB de espacio libre

### Requisitos de software
- Sistema operativo: Windows 10, macOS 10.13 o superior, o alguna distribución de Linux
- [Python 3.8 o superior](https://www.python.org/downloads/): para instalar Python, sigue las instrucciones en la página oficial de descargas de Python.
- [Node.js 14.x o superior](https://nodejs.org/en/download/): para instalar Node.js, sigue las instrucciones en la página oficial de descargas de Node.js.
- [PostgreSQL 12.x o superior](https://www.postgresql.org/download/): para instalar PostgreSQL, sigue las instrucciones en la página oficial de descargas de PostgreSQL.
- Angular CLI: para instalar Angular CLI, abre una terminal y ejecuta el siguiente comando:
    ```
    npm install -g @angular/cli
    ```

Una vez que hayas instalado todos los requisitos, puedes continuar con la instalación y ejecución del proyecto.

## Cómo instalar y ejecutar el proyecto
1. Clonar este repositorio:

`git clone https://github.com/independencia-datalake/sistema-independencia.git`
Esto descargará el código fuente del proyecto a tu máquina local.

2. Crear un entorno virtual:

`python3 -m venv myenv`
Esto creará un entorno virtual llamado "myenv" en el directorio actual. Los entornos virtuales son una forma de aislar las dependencias y configuraciones de un proyecto del resto del sistema.

3. Activar el entorno virtual:

```
source myenv/bin/activate (Linux/MacOS)
myenv\Scripts\activate (Windows)
```
Esto activará el entorno virtual que acabas de crear. A partir de ahora, cualquier paquete que instales o comando que ejecutes se aplicará solo a este entorno virtual.

4. Instalar los requerimientos:

`pip install -r requirements.txt`
Esto instalará todas las dependencias necesarias para el proyecto, como Django y PostgreSQL.

5. Crear archivo .env:
Debes ponerte en contacto con los administradores del proyecto para obtener el archivo .env. Este archivo contiene información confidencial, como claves secretas y credenciales de bases de datos, que se utiliza para configurar el proyecto.

Una vez que obtengas el archivo .env, colócalo en el directorio raíz de django (sistema-independencia/backend/).

Para provar aqui hay un ejemplo de archivo .env para iniciar la aplicacion 
```
DJANGO_SETTINGS_MODULE=settings.test
DEBUG=True
SECRET_KEY=ejemploclavesecreta123
```

6. Crear la base de datos local, migrar los datos iniciales y crear un superusuario:

```
cd backend/database/fixtures/
sh backend_start.sh (Linux/MacOS)
backend_start.bat (Windows)
```
Este comando creará la base de datos local, aplicará todas las migraciones necesarias y cargará datos iniciales en la base de datos. También creará un superusuario con permisos de administrador.

7. Iniciar el servidor Django:

`python manage.py runserver`
Esto iniciará el servidor de desarrollo de Django en tu máquina local.

8. Abre otra terminal y navega hasta el directorio "frontend" del proyecto:
```
cd frontend
npm install
```
9. Inicia la aplicación Angular:
`ng serve`
Esto iniciará la aplicación Angular en tu navegador web. Asegúrate de que la aplicación se esté ejecutando correctamente y no hay errores en la consola del navegador.

Nota: si al intentar ejecutar el archivo backend_start.sh obtienes un error que indica que la base de datos local-db.sqlite3 es de solo lectura, debes otorgarle permisos de usuario a la misma. Esto se puede hacer mediante el siguiente comando en la terminal:

```
chmod u+w backend/local-db.sqlite3`
chmod +x backend_start.sh
```
En Windows, es posible que necesites agregar python a la variable de entorno Path para poder ejecutar algunos comandos.

## Contribución

Este proyecto está en constante evolución y mejora, y cualquier tipo de contribución es bienvenida. Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio y clónalo en tu máquina local.
2. Crea una nueva rama para tu contribución:
`git checkout -b mi-contribucion`
3. Realiza los cambios necesarios y asegúrate de que tu código cumple con los estándares de calidad del proyecto.
4. Realiza pruebas para asegurarte de que todo funciona correctamente.
5. Realiza un commit con tus cambios:
`git commit -am 'Agregué una nueva función'`
6. Sube tus cambios a tu repositorio:
`git push origin mi-contribucion`
7. Crea un nuevo Pull Request y describe tus cambios de manera detallada.

Antes de hacer una contribución, asegúrate de que no exista un problema abierto que ya lo haya resuelto o que alguien más esté trabajando en ello. Si tienes alguna duda o sugerencia, puedes ponerte en contacto con Independencia Ciudadana.

¡Gracias por tu interés en contribuir a este proyecto!

## Documentación adicional

Para obtener más documentación o ayuda adicional, puedes ponerte en contacto con Independencia Ciudadana. Estamos disponibles para responder tus preguntas y proporcionarte la información que necesites.