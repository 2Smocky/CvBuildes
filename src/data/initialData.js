// src/data/initialData.js

const initialData = {
    // === 1. DATOS PERSONALES Y CONTACTO ===
    personal: {
        nombre: "Nombre completo",
        titulo: "Profesión o Rol (Ej: Desarrollador Web / Diseñador UX)",
        cc: "Documento de identidad",
        foto: null
    },

    contacto: {
        telefono: "Número de teléfono",
        email: "Correo electrónico",
        ubicacion: "Ciudad y país",
        direccion: "Dirección de residencia"
    },

    // === 2. PERFIL PROFESIONAL ===
    perfil: {
        descripciones: [
            "Escribe aquí un resumen profesional claro y breve sobre tu experiencia, fortalezas y habilidades principales."
        ]
    },

    // === 3. HABILIDADES ===
    habilidades: [
        { id: 1, nombre: "Enfoque" },
        { id: 2, nombre: "Aprendizaje" },
        { id: 3, nombre: "Mejora" },
        { id: 4, nombre: "Creatividad" },
        { id: 5, nombre: "Adaptabilidad" },
        { id: 6, nombre: "Comunicación" },
        { id: 7, nombre: "Organización" },
        { id: 8, nombre: "Liderazgo" },
        { id: 9, nombre: "Eficiencia" },
        { id: 10, nombre: "Innovación" },
    ],

    lenguajes: [
        { id: 1, nombre: "HTML", progreso: 90 },
        { id: 2, nombre: "CSS", progreso: 80 },
        { id: 3, nombre: "JavaScript", progreso: 70 },
        { id: 4, nombre: "React", progreso: 60 },
        { id: 5, nombre: "SQL", progreso: 75 },
    ],

    idiomas: [
        { id: 1, nombre: "Español", progreso: 100 },
        { id: 2, nombre: "Inglés", progreso: 40 },
    ],

    // === 4. EDUCACIÓN ===
    
    // Formación Académica
    educacion_academica: [
        {
            id: 101,
            titulo: "Título académico (Ej: Técnico, Tecnólogo, Profesional)",
            institucion: "Nombre de la institución",
            ubicacion: "Ciudad - País",
            periodo: "Año inicio - Año fin",
            detalle_periodo: "Información adicional (Opcional)",
            descripcion: "Descripción breve del programa o logros académicos."
        }
    ],

    // Formación Complementaria
    educacion_complementaria: [
        {
            id: 102,
            titulo: "Título del  curso o formación",
            institucion: "Nombre de la institución",
            horas: "horas de duración",
            descripcion: "Descripción breve del curso o logros obtenidos."
        }
    ],

    // === 5. EXPERIENCIA LABORAL ===
    experiencia: [
        {
            id: 201,
            puesto: "Cargo desempeñado",
            empresa: "Nombre de la empresa",
            ubicacion: "Ciudad - País",
            periodo: "Fecha inicio - Fecha fin",
            descripcion: "Describe las responsabilidades, logros y funciones del cargo."
        }
    ],

    // === 6. PROYECTOS ===
    proyectos: [
        {
            id: 301,
            nombre: "Nombre del proyecto",
            empresa: "Organización o tipo de proyecto",
            anio: "Año de realización",
            descripcion: "Descripción del proyecto y su propósito.",
            stack: "Tecnologías utilizadas",
            link: "URL del proyecto (Opcional)"
        }
    ],

    // === 7. REFERENCIAS ===
    referencias: {
        personales: [
            {
                id: 401,
                nombre: "Nombre de la referencia personal",
                cargo: "Relación o cargo",
                contacto: "Número de contacto"
            }
        ],
        laborales: [
            {
                id: 501,
                nombre: "Nombre de la referencia laboral",
                cargo: "Cargo o relación profesional",
                contacto: "Número de contacto"
            }
        ]
    },

    // === 8. FIRMA Y REDES ===
    firma: {
        img: ""
    },

    redes: [
        { id: 1, nombre: "LinkedIn", url: "https://linkedin.com/" },
        { id: 2, nombre: "GitHub", url: "https://github.com/" }
    ]
};

export default initialData;
