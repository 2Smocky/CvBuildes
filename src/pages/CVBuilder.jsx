import React, { useState } from 'react';
import { useDraft } from "../hooks/useDraft";
import CVPreview from '../components/CVPreview';
import initialData from '../data/initialData';
import ThemePanel from '../components/ThemePanel';
import OnboardingTour from '../components/OnboardingTour';
import "./styles/CVBuilder.css";
import "../App.css";


// --- Componente Principal ---
function App() {
    const [cvData, setCvData] = useState(initialData);
    const [theme, setTheme] = useState('theme-default');
    const [customTheme, setCustomTheme] = useState({
        '--primary-color': '#3498db',
        '--sidebar-bg': '#2c3e50',
        '--text-color-dark': '#2c3e50',
        '--accent-gradient': 'linear-gradient(90deg, #3498db, #2980b9)',
        '--sidebar-text-color': '#ffffff',
    });
    const [activeDraftName, setActiveDraftName] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const {
        draftList,
        loadDrafts,
        saveDraft,
        loadDraft,
        deleteDraft,
        renameDraft,
        resetDraftId
    } = useDraft(cvData, setCvData, theme, setTheme, customTheme, setCustomTheme, setHasUnsavedChanges);

    // Cuando cargues un borrador:
    const handleLoadDraft = async (id) => {
        await loadDraft(id);
    };

    const setActiveDraft = (name) => {
        setActiveDraftName(name);
    }

    const handleCustomThemeChange = (variable, value) => {
        setCustomTheme(prev => ({ ...prev, [variable]: value }));
    };

    // Cambiar tema
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);

        if (newTheme !== "theme-custom") {
            const cv = document.getElementById("cv-preview");
            if (cv) {
                cv.style.removeProperty("--primary-color");
                cv.style.removeProperty("--sidebar-bg");
                cv.style.removeProperty("--text-color-dark");
                cv.style.removeProperty("--accent-gradient");
                cv.style.removeProperty("--sidebar-text-color");
            }
        }
    };

    // Actualizar datos del CV
    const handleDataChange = (sectionKey, field, value, itemId = null, subSection = null) => {
        setHasUnsavedChanges(true);
        setCvData(prevData => {
            // Referencias separadas
            if (subSection) {
                return {
                    ...prevData,
                    [sectionKey]: {
                        ...prevData[sectionKey],
                        [subSection]: prevData[sectionKey][subSection].map(item =>
                            item.id === itemId ? { ...item, [field]: value } : item
                        )
                    }
                };
            }

            const section = prevData[sectionKey];

            if (typeof section === "object" && !Array.isArray(section)) {
                return { ...prevData, [sectionKey]: { ...section, [field]: value } };
            }

            if (Array.isArray(section) && itemId !== null) {
                return { ...prevData, [sectionKey]: section.map(item => item.id === itemId ? { ...item, [field]: value } : item) };
            }

            console.warn(`handleDataChange: Falta itemId para actualizar "${sectionKey}"`);
            return prevData;
        });
    };

    // Añadir ítem
    const handleAddItem = (sectionKey) => {
        setHasUnsavedChanges(true);
        const newItem = { id: crypto.randomUUID() };

        // Soporte referencias separadas
        if (sectionKey.includes(".")) {
            const [parent, child] = sectionKey.split(".");
            Object.assign(newItem, { nombre: "Nuevo", cargo: "Cargo", contacto: "Contacto" });
            setCvData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: [...prev[parent][child], newItem] }
            }));
            return;
        }

        switch (sectionKey) {
            case 'experiencia': Object.assign(newItem, { puesto: "Nuevo Puesto", empresa: "Empresa", ubicacion: "Ciudad", periodo: "Fechas", descripcion: "Describe tus responsabilidades y logros aquí." }); break;
            case 'educacion_academica': Object.assign(newItem, { tipo: "Nueva", titulo: "Título académico (Ej: Técnico, Tecnólogo, Profesional)", institucion: "Nombre de la institución", ubicacion: "Ciudad - País", periodo: "Año inicio - Año fin", detalle_periodo: "", descripcion: "Descripción breve del programa o logros académicos." }); break;
            case 'educacion_complementaria': Object.assign(newItem, { tipo: "Nueva", titulo: "Título del curso o formación", institucion: "Nombre de la institución", horas: "horas de duración", descripcion: "Detalles del curso/formación." }); break;
            case 'habilidades': Object.assign(newItem, { nombre: "Nueva habilidad" }); break;
            case 'lenguajes': Object.assign(newItem, { nombre: "Nuevo Lenguaje", progreso: 50 }); break;
            case 'idiomas': Object.assign(newItem, { nombre: "Nuevo Idioma", progreso: 50 }); break;
            case 'redes': Object.assign(newItem, { nombre: "Red Social", url: "Direccion URL" }); break;
            case 'proyectos': Object.assign(newItem, { nombre: "Nuevo Proyecto", empresa: "Empresa", anio: "Año", descripcion: "Descripción del proyecto.", stack: "Tecnologías", link: "" }); break;
            default: Object.assign(newItem, { nombre: "Nuevo elemento" }); break;
        }

        setCvData(prev => ({ ...prev, [sectionKey]: [...prev[sectionKey], newItem] }));
    };

    // Eliminar ítem
    const handleRemoveItem = (sectionKey, itemId) => {
        setHasUnsavedChanges(true);
        if (sectionKey.includes(".")) {
            const [parent, child] = sectionKey.split(".");
            setCvData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: prev[parent][child].filter(item => item.id !== itemId) }
            }));
            return;
        }

        setCvData(prev => ({
            ...prev,
            [sectionKey]: prev[sectionKey].filter(item => item.id !== itemId)
        }));
    };

    const handleResetCV = () => {
        setHasUnsavedChanges(false);
        setCvData(initialData);   // ⬅️ Restaurar datos por defecto
        setTheme('theme-default'); // ⬅️ Restaurar tema por defecto
        setCustomTheme({
            '--primary-color': '#3498db',
            '--sidebar-bg': '#2c3e50',
            '--text-color-dark': '#2c3e50',
            '--accent-gradient': 'linear-gradient(90deg, #3498db, #2980b9)',
            '--sidebar-text-color': '#ffffff',
        });
        const cv = document.getElementById("cv-preview");
        if (cv) {
            cv.style.removeProperty("--primary-color");
            cv.style.removeProperty("--sidebar-bg");
            cv.style.removeProperty("--text-color-dark");
            cv.style.removeProperty("--accent-gradient");
            cv.style.removeProperty("--sidebar-text-color");
        }
        resetDraftId();
        setActiveDraftName('');
    };

    return (
        <div className="app-layout">
            <OnboardingTour />
            <main>
                <ThemePanel
                    onThemeChange={handleThemeChange}
                    currentTheme={theme}
                    customTheme={customTheme}
                    onCustomThemeChange={handleCustomThemeChange}
                />

                <CVPreview
                    cvData={cvData}
                    themeClass={theme}
                    onDataChange={handleDataChange}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}

                    onSaveDraft={saveDraft}
                    onOpenDrafts={loadDrafts}
                    draftList={draftList}
                    onLoadDraft={handleLoadDraft}
                    onDeleteDraft={deleteDraft}
                    onRenameDraft={renameDraft}

                    onResetCV={handleResetCV}
                    resetDraftId={resetDraftId}
                    activeDraftName={activeDraftName}
                    setActiveDraft={setActiveDraft}
                    hasUnsavedChanges={hasUnsavedChanges}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                />
            </main>


            <div className="p404-page">
                <h1>Error</h1>
                <span>Pagina no disponible para moviles</span>
            </div>
        </div>
    );
}


export default App;
