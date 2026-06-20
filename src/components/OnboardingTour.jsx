import React, { useEffect } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./OnboardingTour.css";

export const startTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        nextBtnText: 'Siguiente &rarr;',
        prevBtnText: '&larr; Anterior',
        doneBtnText: '¡Comenzar!',
        progressText: '{{current}} de {{total}}',
        onDestroyStarted: () => {
            localStorage.setItem("hasSeenTour", "true");
            driverObj.destroy();
        },
        steps: [
            {
                popover: { 
                    title: '¡Bienvenido a CV Builders! 🎉', 
                    description: 'Te daremos un recorrido para que domines nuestro editor premium. ¡Comencemos!',
                    side: "over",
                    align: 'center'
                }
            },
            {
                element: '#cv-preview',
                popover: { 
                    title: '✏️ Edición Fácil e Intuitiva', 
                    description: 'Todo el currículum es interactivo. Haz clic en cualquier texto para editarlo directamente.',
                    side: "left", 
                    align: 'start' 
                }
            },
            {
                element: '.profile-img',
                popover: { 
                    title: '📸 Agrega tu Fotografía', 
                    description: 'Para personalizar tu perfil, simplemente haz clic sobre la silueta o imagen actual para subir tu propia fotografía.',
                    side: "right", 
                    align: 'start' 
                }
            },
            {
                element: '.sidebar',
                popover: { 
                    title: '➕ Añadir y ✖ Eliminar', 
                    description: 'Puedes borrar cualquier elemento con la "✖" roja. Si eliminas todos los ítems de una categoría (ej. Proyectos), la sección entera se ocultará y no saldrá en el PDF. Para agregar más, usa el botón azul "+ Añadir".',
                    side: "right", 
                    align: 'start' 
                }
            },
            {
                element: '#tour-themes',
                popover: { 
                    title: '🎨 Diseños y Colores', 
                    description: 'Cambia el color de tu currículum con un solo clic. También puedes usar el tema "Personalizado" para elegir tus propios colores exactos.',
                    side: "left", 
                    align: 'start' 
                }
            },
            {
                element: '#tour-reset',
                popover: { 
                    title: '🔄 Restaurar CV', 
                    description: 'Si quieres borrar todo tu progreso actual y volver a empezar desde cero con la plantilla por defecto, usa este botón.',
                    side: "bottom", 
                    align: 'start' 
                }
            },
            {
                element: '#tour-save',
                popover: { 
                    title: '💾 Guardar en la Nube', 
                    description: 'Guarda tus avances actuales de forma segura en la nube para no perder tu progreso.',
                    side: "bottom", 
                    align: 'start' 
                }
            },
            {
                element: '#tour-drafts',
                popover: { 
                    title: '📂 Gestionar Borradores', 
                    description: 'Desde aquí puedes acceder a tus borradores guardados, cargar uno anterior o editar sus nombres. Tienes un límite de 10 borradores.',
                    side: "bottom", 
                    align: 'start' 
                }
            },
            {
                element: '#tour-credits',
                popover: { 
                    title: '🪙 Tus Créditos', 
                    description: 'Cada vez que descargues tu CV en PDF, se consumirá un crédito. Aquí puedes revisar cuántos te quedan y adquirir más.',
                    side: "bottom", 
                    align: 'end' 
                }
            },
            {
                element: '#tour-export',
                popover: { 
                    title: '📄 Descargar PDF', 
                    description: '¡El paso final! Cuando tu CV esté perfecto, expórtalo a un PDF de alta resolución listo para enviar a los reclutadores.',
                    side: "bottom", 
                    align: 'start' 
                }
            }
        ]
    });

    driverObj.drive();
};

const OnboardingTour = () => {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("hasSeenTour");
        if (!hasSeenTour) {
            setTimeout(() => {
                startTour();
            }, 1000);
        }
    }, []);

    return null;
};

export default OnboardingTour;
