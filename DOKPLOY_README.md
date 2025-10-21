# Dokploy Deployment Guide

Esta guía explica cómo desplegar el frontend React en Dokploy.

## Archivos de Configuración

- `Dockerfile` - Configuración multi-stage optimizada para producción
- `nginx.conf` - Configuración de Nginx para SPA
- `docker-compose.yml` - Configuración para desarrollo local
- `.env.dokploy` - Variables de entorno para Dokploy

## Despliegue en Dokploy

### 1. Crear un nuevo proyecto

1. Ve a tu panel de Dokploy
2. Crea un nuevo proyecto
3. **IMPORTANTE**: Selecciona "Dockerfile" (NO selecciones "Node.js" o "npm")
4. Si ya creaste el proyecto como Node.js, elimínalo y créalo de nuevo como Dockerfile

### 2. Configurar Variables de Entorno

En la sección de Environment Variables de Dokploy, configura:

```bash
NODE_ENV=production
REACT_APP_AUTH_API_BASE_URL=https://tu-auth-api.dokploy.dev/api
REACT_APP_DASHBOARD_API_BASE_URL=https://tu-dashboard-api.dokploy.dev/api
```

### 3. Desplegar

- Si usas **Dockerfile**: Solo sube el código, Dokploy detectará el Dockerfile automáticamente
- Si usas **Docker Compose**: Sube el `docker-compose.yml`

### 4. Configuración de Puerto

El contenedor expone el puerto 80. Dokploy debería detectarlo automáticamente.

## Health Check

La aplicación incluye un endpoint de health check en `/health` que Dokploy puede usar para verificar el estado del servicio.

## Optimizaciones Incluidas

- ✅ Multi-stage build para imágenes más pequeñas
- ✅ Nginx optimizado para SPAs
- ✅ Headers de seguridad
- ✅ Compresión gzip
- ✅ Health checks integrados
- ✅ Usuario no-root para mayor seguridad
- ✅ Variables de entorno configurables

## Desarrollo Local

Para desarrollo local, usa:

```bash
npm run docker:up
```

Esto levantará el servicio en `http://localhost:3001`

## Troubleshooting

### ❌ Error: webpack-dev-server en producción
**Síntoma**: Ves errores como `$RefreshSig$ is not defined` o `webpack-dev-server` en la consola del navegador.

**Causa**: Dokploy está ejecutando `npm start` en lugar de usar el Dockerfile.

**Solución**:
1. En Dokploy, ve a la configuración de tu aplicación
2. Cambia el "Build Type" de "Node.js" a "Dockerfile"
3. Asegúrate de que el Dockerfile path sea `./Dockerfile`
4. Redespliega la aplicación

### Build falla
- Verifica que todos los archivos estén incluidos en el contexto de build
- Revisa los logs de build en Dokploy
- Asegúrate de que NODE_ENV=production esté configurado

### API no conecta
- Verifica las URLs de las APIs en las variables de entorno
- Asegúrate de que los servicios backend estén desplegados y accesibles

### Puerto no expuesto
- Verifica que Dokploy esté configurado para exponer el puerto 80
- Revisa la configuración de dominio en Dokploy