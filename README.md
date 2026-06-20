<div align="center">
  <img src="src/assets/logo.png" alt="CV Builders Logo" width="200" />
  <h1>CV Builders</h1>
  <p>La plataforma interactiva definitiva para la construcción, personalización y exportación de Currículums Profesionales en tiempo real.</p>
</div>

---

## 🚀 Sobre el Proyecto

**CV Builders** es una aplicación Web (SPA) que elimina la fricción y la complejidad al crear un currículum vitae. Con una filosofía *What You See Is What You Get* (WYSIWYG), los usuarios pueden editar textos, barras de progreso y fotografías haciendo clic directamente en el documento. Todo mientras cambian de tema de color dinámicamente y guardan borradores en la nube.

Este proyecto está construido para la web moderna bajo **React + Vite** y apoyado por el ecosistema de **Firebase**.

## 📖 Documentación Completa

Para garantizar un mantenimiento sostenible y un uso impecable, toda la documentación oficial está centralizada en la carpeta **`Mantenimiento/`**:

- 👤 [**Manual de Uso**](./Mantenimiento/MANUAL_DE_USO.md): Guía paso a paso sobre cómo interactuar con el editor, manejar la cuenta y gestionar borradores.
- ⚙️ [**Manual Técnico y Arquitectura**](./Mantenimiento/MANUAL_TECNICO.md): Profundidad en el código fuente, la lógica detrás del renderizado dinámico del PDF, Firebase y estructura del proyecto.

---

## ✨ Características Principales

*   **🎨 Editor WYSIWYG en Tiempo Real:** Haz clic y edita cualquier texto al instante, sin formularios separados aburridos.
*   **🧩 Secciones Inteligentes:** Agrega o elimina componentes libremente. Si una sección queda vacía, se oculta automáticamente en el PDF para no dejar espacios en blanco.
*   **☁️ Guardado en la Nube (Drafts):** Un gestor estilo *Glassmorphism* que permite guardar, renombrar y recuperar hasta 10 versiones diferentes de tu CV.
*   **🌈 Theming Dinámico:** Panel lateral para intercambiar de forma rápida las paletas de color con soporte para "Modo Personalizado".
*   **🖨️ Exportación a PDF (A4):** Generación milimétrica de PDF a partir del DOM utilizando `html2canvas` y `jsPDF`.
*   **🔐 Autenticación Robusta:** Login por email o Google, y recuperación segura de contraseña soportada nativamente por Firebase.
*   **🎓 Tutorial Interactivo (Onboarding):** Un tour automatizado de bienvenida que guía al usuario por la interfaz al crear una cuenta por primera vez.

---

## 🗂️ Estructura del Proyecto

El código está estructurado para ser predecible y altamente escalable:

```
mi-cv-designer/
├── Mantenimiento/         # Manuales, arquitectura y guías oficiales de la app
├── public/                # Archivos estáticos accesibles globalmente
├── src/
│   ├── assets/            # Imágenes, iconos, logos
│   ├── components/        # Componentes UI reutilizables (Modales, Editor, Barras)
│   ├── data/              # Modelos de datos iniciales en JSON
│   ├── hooks/             # Lógica de estado custom (ej. useDraft)
│   ├── pages/             # Contenedores de vista (Login, Register, CVBuilder)
│   ├── services/          # Conexiones externas y APIs (Firebase Auth, Firestore)
│   └── styles/            # Archivos CSS localizados
└── vite.config.js         # Configuración del bundler de Vite
```

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, Vite.
- **Estilos:** Vanilla CSS moderno (Variables, Flexbox, Glassmorphism).
- **Backend/DB:** Firebase (Auth, Firestore).
- **Librerías Clave:** 
  - `sweetalert2` (Modales de alerta premium).
  - `driver.js` (Tour onboarding interactivo).
  - `html2canvas` y `jspdf` (Motor de renderizado de PDF).

---

## 💻 Instalación y Desarrollo

Sigue estos pasos para correr CV Builders en tu entorno local:

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd mi-cv-designer
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el Entorno**
   - Asegúrate de tener tu archivo `firebase.js` configurado con tus credenciales.

4. **Correr servidor en modo Desarrollo**
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible típicamente en `http://localhost:5173`.*

5. **Compilar para Producción**
   ```bash
   npm run build
   ```

---
<div align="center">
  <small>© 2025 CV Builders Team. Todos los derechos reservados.</small>
</div>