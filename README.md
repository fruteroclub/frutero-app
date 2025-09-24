# poktapok - aplicación para builders de frutero club

poktapok es un tercer espacio digital creado especialmente para los builders de frutero club. esta plataforma está diseñada para fomentar el crecimiento colectivo de nuestra comunidad, permitiendo:

- compartir conocimientos y experiencias
- desarrollar nuevas habilidades
- explorar tendencias emergentes
- descubrir oportunidades de colaboración

nuestra visión es crear un ecosistema vibrante donde los builders puedan conectar, aprender y crecer juntos.

## características

- **Next.js** con App Router para una estructura y enrutamiento óptimos.
- **Shadcn** para componentes de UI bien diseñados y reutilizables.
- **Bun** como runtime para builds más rápidas y mejor rendimiento.
- pre-configurado para **Dynamic Wallet** (impulsado por [dynamic.xyz](https://dynamic.xyz)) para manejar la creación y conexión de wallets.

## primeros pasos

### requisitos Previos

- [Node.js](https://nodejs.org/) (asegúrate de tener Bun instalado como runtime)
- [Bun](https://bun.sh/docs/installation)
- [Git](https://git-scm.com/)

### instalación

1. **clona el repositorio:**

   ```bash
   git clone https://github.com/fruteroclub/poktapok.git
   cd poktapok
   ```

2. **instala las dependencias usando Bun:**

   ```bash
   bun install
   ```

3. **configura las variables de entorno:**

   copia el archivo de ejemplo y configúralo:

   ```bash
   cp .env.example .env
   ```

   luego edita `.env` con tus valores reales:

   ```plaintext
   # Para Wallet SDK
   NEXT_PUBLIC_PARA_API_KEY=tu_para_api_key
   NEXT_PUBLIC_PARA_ENVIRONMENT=development

   # Are.na API Configuration
   ARENA_PERSONAL_ACCESS_TOKEN=tu_arena_personal_access_token
   NEXT_PUBLIC_ARENA_PUBLIC_CHANNEL=tu_canal_publico_slug
   NEXT_PUBLIC_ARENA_ADMIN_CHANNEL=tu_canal_admin_slug
   ```

   **Para obtener las credenciales de Are.na:**
   1. Ve a [dev.are.na/oauth/applications](https://dev.are.na/oauth/applications)
   2. Crea una nueva aplicación
   3. Obtén tu Personal Access Token
   4. Configura los slugs de tus canales de Are.na

### ejecutando el proyecto

para iniciar el servidor de desarrollo, ejecuta:

```bash
bun run dev
```

esto lanzará la aplicación en `http://localhost:3000`.

### build y producción

para builds de producción, utiliza:

```bash
bun run build
bun run start
```

## estructura del proyecto

```plaintext
.
├── public/          # archivos estáticos
├── src/app/         # páginas y rutas de Next.js
├── src/components/  # componentes React personalizados
├── src/styles/      # hojas de estilo globales
├── .env             # variables de entorno
├── ...              # ¡otros archivos de configuración, revisa el repo!
```

## integraciones

### Wallet Integration

la aplicación incluye integración con **Para Wallet SDK**, permitiendo una creación y conexión fluida de wallets para los usuarios:

- **Para SDK** proporciona una interfaz de usuario fácil de usar para la conexión de wallets.
- configuración plug-and-play para conectar con cadenas compatibles con EVM.

### Are.na Integration

la sección **Ecosistema** incluye integración completa con Are.na para curación y compartir de contenido:

**Características:**
- **Canal Admin (Hackatones)**: Contenido curado por el equipo, solo lectura para usuarios
- **Canal Público (Libre Papa)**: Comunidad puede agregar links, texto e imágenes
- **Tiempo Real**: Auto-refresh automático cada 30-60 segundos
- **API Segura**: Tokens protegidos en el servidor, no expuestos al cliente

**Configuración de Canales:**
1. Crea canales en [are.na](https://are.na)
2. Canal público: configurar como "public" o "closed" 
3. Canal admin: configurar como "private" y agregar colaboradores
4. Usar los slugs de los canales en las variables de ambiente

**Variables requeridas:**
- `ARENA_PERSONAL_ACCESS_TOKEN`: Token para API calls autenticadas
- `NEXT_PUBLIC_ARENA_PUBLIC_CHANNEL`: Slug del canal público
- `NEXT_PUBLIC_ARENA_ADMIN_CHANNEL`: Slug del canal de admin

## Contribuciones

¡damos la bienvenida a las contribuciones! siéntete libre de enviar issues o pull requests para ayudar a mejorar este proyecto para el club y la comunidad.

## Licencia

este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).
