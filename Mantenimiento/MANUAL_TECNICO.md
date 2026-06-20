# Manual Técnico y de Mantenimiento - CV Builders

Este documento está dirigido al equipo de desarrollo, administradores y personal de mantenimiento encargado de evolucionar, depurar o mantener la plataforma de **CV Builders**.

---

## 1. Arquitectura Base del Proyecto

El proyecto está construido bajo una arquitectura modular usando **React 18** y **Vite**, lo que garantiza tiempos de carga rápidos y una excelente experiencia de desarrollo (HMR).

### Stack Tecnológico
- **Frontend Core:** React, Vite, React Router DOM.
- **Estilos:** CSS3 Puro, variables CSS (`var()`), patrones de diseño moderno (Glassmorphism, animaciones 3D).
- **Backend / BaaS:** Firebase (Authentication, Firestore).
- **Exportación a PDF:** `html2canvas` y `jspdf`.
- **UI/UX y Notificaciones:** `sweetalert2` (Swal).
- **Onboarding (Tutoriales):** `driver.js`.

---

## 2. Estructura de Directorios

```text
src/
├── admin/               # (Reservado) Panel de administración
├── assets/              # Imágenes estáticas, íconos y logo.png
├── components/          # Componentes Reutilizables y UI
│   ├── CVPreview.jsx    # Lienzo principal y lógica de interacción del CV
│   ├── DraftsModal.jsx  # Gestor de borradores (CRUD Visual)
│   ├── OnboardingTour.jsx # Lógica de tutorial interactivo (driver.js)
│   └── ThemePanel.jsx   # Barra flotante de cambio de color
├── data/
│   └── initialData.js   # JSON Base estructurado para una nueva plantilla
├── hooks/
│   └── useDraft.js      # Custom Hook para manejar CRUD de borradores con Firebase
├── pages/
│   ├── CVBuilder.jsx    # Componente contenedor de la vista de trabajo
│   ├── Login.jsx        # Lógica de inicio de sesión y recuperación de contraseña
│   ├── Register.jsx     # Registro de usuarios nuevos
│   └── styles/          # Estilos CSS de las vistas
├── services/
│   ├── authService.js   # Comunicación directa con Firebase Auth
│   ├── cvService.js     # Lógica de conversión a PDF
│   ├── draftService.js  # Lógica de consultas Firestore para borradores
│   └── userService.js   # Lógica de saldo de créditos Firestore
├── App.jsx              # Router de la aplicación
├── firebase.js          # Configuración inicial del SDK de Firebase
└── index.css            # Estilos globales y reset
```

---

## 3. Módulos Críticos y su Funcionamiento

### 3.1. Renderizado Dinámico y Ocultamiento Inteligente
El archivo principal es `CVPreview.jsx`. En él, cada sección del currículum es renderizada mapeando el estado de React (`cvData`). 
- **Ocultamiento de impresión:** Cuando un usuario borra todos los ítems de un arreglo (ej. `proyectos.length === 0`), el componente le inyecta las clases CSS `.no-print` y `.empty-section-warning`. 
- Durante la exportación, `html2canvas` ignora los elementos con la clase `.no-print`, logrando que la sección desaparezca mágicamente del PDF sin romper la UI del editor.

### 3.2. Gestión de Borradores (Drafts)
El ciclo de vida de los borradores es manejado por `useDraft.js` y `draftService.js`.
- Se requiere que cada usuario tenga una subcolección `drafts` en su documento principal de Firestore (`users/{userId}/drafts/{draftId}`).
- **Regla de negocio:** Se limitan los borradores a 10 por usuario. Esto se valida en `useDraft.js` antes de permitir la inserción en base de datos.

### 3.3. Autenticación y Recuperación de Contraseña
Centralizado en `authService.js`. 
- Durante la creación de cuenta, el sistema borra el flag de `hasSeenTour` del LocalStorage para forzar la inicialización del tutorial.
- El reseteo de contraseña utiliza la función nativa `sendPasswordResetEmail` de Firebase. El flujo de UI es inyectado desde `Login.jsx` mediante `SweetAlert2` solicitando el correo.

### 3.4. Motor de PDF (Generación)
El proceso de exportación se sitúa en `handleDownloadPDF` de `CVPreview.jsx`:
1. El DOM inyecta `display: none` temporal a todos los botones (`.no-print`).
2. `html2canvas` captura el contenedor `#cv-preview`.
3. La imagen obtenida es inyectada en un canvas de `jspdf` ajustando proporciones milimétricas (tamaño A4, ancho 210mm).

---

## 4. Guía para Despliegue e Instalación Local

1. Asegúrate de usar Node versión 16+ o 18+.
2. Clona el proyecto y corre `npm install`.
3. Copia tus variables de entorno de Firebase (crea un archivo `.env` o edita `firebase.js` según el flujo del equipo de DevOps). Las variables requeridas son típicas de un config de Firebase.
4. Para levantar en local: `npm run dev`.
5. Para producción: `npm run build`. El código minificado se volcará en el directorio `/dist`. Este directorio puede ser servido estáticamente en Vercel, Netlify o Firebase Hosting.

---

## 5. Mantenimiento y Troubleshooting Común

- **Error al cargar imágenes en el PDF:** Asegúrate de que `useCORS: true` esté siempre habilitado en la configuración de `html2canvas`. Las imágenes externas sin encabezados CORS romperán la exportación.
- **El tutorial de Driver.js no se dibuja bien:** Verifica los z-index. `driver.js` requiere que el popover tenga un z-index superior a barras estáticas y modales. Esto está corregido en `OnboardingTour.css`.
- **Límites de Lectura de Firebase:** Cuidado con poner `loadDrafts` dentro de ciclos renderizados de React sin dependencias claras en `useEffect`, esto puede agotar la capa gratuita de Firestore rápidamente. Actualmente el Hook lo controla eficientemente.
