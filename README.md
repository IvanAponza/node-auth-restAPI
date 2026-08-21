# Rest Project + TypeScript

Repositorio API REST construida con Node.js, TypeScript, Express.js, MongoDB, JWT, Bcrypt y express-fileupload, que implementa un sistema completo de autenticación y gestión de recursos; está diseñada para ser escalable, mantenible y segura, ideal como backend para aplicaciones web modernas. La aplicación utiliza una arquitectura limpia y modular basada en capas (Domain, Data, Presentation) siguiendo principios de Clean Architecture.


## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno `cp .env.template .env`
2. Ejecutar `npm install` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Llenar la base de datos con los datos de prueba ejecutando `npm run seed`
5. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo

