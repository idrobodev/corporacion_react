# PDF Export Fix Plan for Participantes Page

## Problem Analysis

The PDF export functionality in [`src/pages/Dashboard/Participantes.jsx`](src/pages/Dashboard/Participantes.jsx:140) has several data mapping issues:

### Issues Identified:

1. **Data Structure Mismatch**: PDF template expects `participante.nombre` but data uses `nombres` and `apellidos` separately
2. **Sede Field Issue**: Shows `[object Object]` because `participante.sede` is an object, not a string
3. **Age Calculation**: Shows "N/A" because it tries to access `participante.edad` directly instead of calculating from `fecha_nacimiento`
4. **Statistics Logic**: Shows "Activos: 0" because it filters for "Activo" but data uses "ACTIVO"
5. **Missing API Methods**: Database service references CRUD methods that don't exist in API service

## Required Fixes

### 1. Fix PDF Export Data Mapping

**Current Problem**: Lines 247-255 in [`handleExportPDF`](src/pages/Dashboard/Participantes.jsx:247) use incorrect field mappings.

**Solution**: Update the PDF template to use the same data mapping logic as the main table:

```javascript
// Current problematic code (lines 247-255):
${filteredParticipantes.map(participante => `
  <tr>
    <td>${participante.nombre || 'N/A'}</td>
    <td>${participante.edad || 'N/A'}</td>
    <td>${participante.genero || 'N/A'}</td>
    <td>${participante.telefono || 'N/A'}</td>
    <td>${participante.sede || 'N/A'}</td>
    <td>${participante.estado || 'N/A'}</td>
  </tr>
`).join('')}

// Should be updated to match the main table logic:
${filteredParticipantes.map(participante => {
  const nombreCompleto = participante.nombres && participante.apellidos 
    ? `${participante.nombres} ${participante.apellidos}` 
    : participante.nombre || 'N/A';
  
  const edad = (() => {
    if (participante.fecha_nacimiento) {
      const birthDate = new Date(participante.fecha_nacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} años`;
    }
    return participante.edad ? `${participante.edad} años` : 'N/A';
  })();
  
  const sedeNombre = participante.sede?.direccion || participante.sede || 'N/A';
  const estado = participante.estado === 'ACTIVO' || participante.estado === 'Activo' ? 'Activo' : 
                 participante.estado === 'INACTIVO' || participante.estado === 'Inactivo' ? 'Inactivo' : 'N/A';
  
  return `
    <tr>
      <td>${nombreCompleto}</td>
      <td>${edad}</td>
      <td>${participante.genero === 'MASCULINO' ? 'Masculino' : participante.genero === 'FEMENINO' ? 'Femenino' : 'N/A'}</td>
      <td>${participante.telefono || 'N/A'}</td>
      <td>${sedeNombre}</td>
      <td>${estado}</td>
    </tr>
  `;
}).join('')}
```

### 2. Fix Statistics Logic

**Current Problem**: Lines 263-264 filter for "Activo"/"Inactivo" but data uses "ACTIVO"/"INACTIVO"

**Solution**: Update statistics to match the main table logic:

```javascript
// Current problematic code (lines 263-264):
<p><strong>Activos:</strong> ${filteredParticipantes.filter(p => p.estado === 'Activo').length}</p>
<p><strong>Inactivos:</strong> ${filteredParticipantes.filter(p => p.estado === 'Inactivo').length}</p>

// Should be updated to:
<p><strong>Activos:</strong> ${filteredParticipantes.filter(p => p.estado === 'ACTIVO' || p.estado === 'Activo').length}</p>
<p><strong>Inactivos:</strong> ${filteredParticipantes.filter(p => p.estado === 'INACTIVO' || p.estado === 'Inactivo').length}</p>
```

### 3. Add Missing API Methods

**Problem**: [`dbService.createParticipante`](src/shared/services/database.js:34) and [`dbService.updateParticipante`](src/shared/services/database.js:39) are referenced but don't exist in [`api.js`](src/shared/services/api.js).

**Solution**: Add the missing CRUD methods to [`src/shared/services/api.js`](src/shared/services/api.js):

```javascript
// Add these methods to the ApiService class in api.js:

// Crear nuevo participante
async createParticipante(participanteData) {
  try {
    const response = await dashboardClient.post('/participantes', participanteData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error creando participante:', error);
    return {
      data: null,
      error: {
        message: error.message || 'Error al crear participante'
      }
    };
  }
}

// Actualizar participante
async updateParticipante(id, participanteData) {
  try {
    const response = await dashboardClient.put(`/participantes/${id}`, participanteData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error actualizando participante:', error);
    return {
      data: null,
      error: {
        message: error.message || 'Error al actualizar participante'
      }
    };
  }
}

// Eliminar participante
async deleteParticipante(id) {
  try {
    const response = await dashboardClient.delete(`/participantes/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error eliminando participante:', error);
    return {
      data: null,
      error: {
        message: error.message || 'Error al eliminar participante'
      }
    };
  }
}
```

## Implementation Steps

1. **Fix PDF Export Function** - Update the `handleExportPDF` function in [`Participantes.jsx`](src/pages/Dashboard/Participantes.jsx:140)
2. **Add Missing API Methods** - Add CRUD operations to [`api.js`](src/shared/services/api.js)
3. **Test PDF Export** - Verify all data displays correctly
4. **Verify Statistics** - Ensure active/inactive counts are accurate

## Expected Results After Fix

- **Names**: Should show combined `nombres + apellidos` instead of "N/A"
- **Ages**: Should calculate from `fecha_nacimiento` instead of showing "N/A"
- **Sedes**: Should show `sede.direccion` instead of `[object Object]`
- **Statistics**: Should correctly count "ACTIVO"/"INACTIVO" participants
- **CRUD Operations**: Should work without errors

## Files to Modify

1. [`src/pages/Dashboard/Participantes.jsx`](src/pages/Dashboard/Participantes.jsx) - PDF export function
2. [`src/shared/services/api.js`](src/shared/services/api.js) - Add missing CRUD methods