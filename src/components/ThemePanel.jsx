// src/components/ThemePanel.jsx
import React, { useEffect } from 'react';

// Estilos para el tooltip y el botón
const style = `
.theme-panel-glass {
    position: fixed;
    top: 50px;
    right: 30px;
    z-index: 1000;
    padding: 15px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 60px;
    align-items: center;
    transition: all 0.3s ease;
}

.theme-panel-title {
    color: #4b5563;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
    font-weight: 700;
    text-align: center;
}

.theme-button-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
}

.theme-button-wrapper .tooltip {
    visibility: hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    color: #1f2937;
    text-align: center;
    border-radius: 6px;
    padding: 6px 12px;
    position: absolute;
    z-index: 1;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    right: 120%;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.theme-button-wrapper .tooltip::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0.95);
}

.theme-button-wrapper:hover .tooltip {
    visibility: visible;
    opacity: 1;
    right: 130%;
}

.color-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.color-dot:hover {
    transform: scale(1.15);
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.color-dot.active {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    transform: scale(1.1);
}

/* Input custom styles */
.custom-input-wrapper input[type="color"] {
    -webkit-appearance: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
    padding: 0;
    background: transparent;
}
.custom-input-wrapper input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}
.custom-input-wrapper input[type="color"]::-webkit-color-swatch {
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
}
.custom-input-wrapper:hover input[type="color"]::-webkit-color-swatch {
    border-color: rgba(0, 0, 0, 0.3);
}
`;

// Definición de los temas disponibles
const themes = [
    { name: 'Predeterminado', class: 'theme-default', color: '#3498db' },
    { name: 'Negro', class: 'theme-black', color: '#000000ff' },
    { name: 'Zafiro', class: 'theme-sapphire', color: '#1abc9c' },
    { name: 'Durazno', class: 'theme-peach', color: '#ad9378' },
    { name: 'Carbón', class: 'theme-charcoal', color: '#df5343ff' },
    { name: 'Noche', class: 'theme-night', color: '#8e44ad' },
    { name: 'Bosque', class: 'theme-forest', color: '#1e8449' },
    { name: 'Dorado', class: 'theme-gold', color: '#f1c40f' },
    { name: 'Personalizado', class: 'theme-custom', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
];

function ThemePanel({ onThemeChange, currentTheme, customTheme, onCustomThemeChange }) {

    useEffect(() => {
        if (currentTheme === 'theme-custom') {
            const cv = document.getElementById("cv-preview");
            if (cv) {
                for (const [variable, value] of Object.entries(customTheme)) {
                    cv.style.setProperty(variable, value);
                }
            }
        }
    }, [customTheme, currentTheme]);

    const handleCustomColorChange = (variable) => (e) => {
        const color = e.target.value;
        onCustomThemeChange(variable, color);
    };

    // Para generar gradient con 2 colores
    const handleGradientChange = (index) => (e) => {
        const color = e.target.value;

        const current = customTheme['--accent-gradient'];

        // Extraer colores
        const matches = current.match(/#([0-9A-F]{3,8})/gi) || ["#3498db", "2980b9"];
        matches[index] = color;

        const newGradient = `linear-gradient(90deg, ${matches[0]}, ${matches[1]})`;

        onCustomThemeChange('--accent-gradient', newGradient);
    };

    return (
        <>
            <style>{style}</style>
            <div id="tour-themes" className="theme-panel-glass no-print">
                <span className="theme-panel-title">TEMA</span>

                {themes.map((theme) => (
                    <div key={theme.class} className="theme-button-wrapper">
                        <div
                            className={`color-dot ${currentTheme === theme.class ? 'active' : ''}`}
                            onClick={() => onThemeChange(theme.class)}
                            style={{ background: theme.color }}
                        />
                        <span className="tooltip">{theme.name}</span>
                    </div>
                ))}

                {currentTheme === "theme-custom" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "15px", width: "100%", alignItems: "center" }}>
                        <span className="theme-panel-title" style={{marginBottom: "2px"}}>CUSTOM</span>
                        
                        <div className="theme-button-wrapper custom-input-wrapper">
                            <input type="color" value={customTheme['--primary-color']} onChange={handleCustomColorChange("--primary-color")} />
                            <span className="tooltip">Color Primario</span>
                        </div>
                        <div className="theme-button-wrapper custom-input-wrapper">
                            <input type="color" value={customTheme['--sidebar-text-color']} onChange={handleCustomColorChange("--sidebar-text-color")} />
                            <span className="tooltip">Color Texto Barra Lateral</span>
                        </div>
                        <div className="theme-button-wrapper custom-input-wrapper">
                            <input type="color" value={customTheme['--sidebar-bg']} onChange={handleCustomColorChange("--sidebar-bg")} />
                            <span className="tooltip">Fondo Barra Lateral</span>
                        </div>
                        <div className="theme-button-wrapper custom-input-wrapper">
                            <input type="color" value={customTheme['--text-color-dark']} onChange={handleCustomColorChange("--text-color-dark")} />
                            <span className="tooltip">Color Títulos Principales</span>
                        </div>
                        <div className="theme-button-wrapper custom-input-wrapper">
                            <input type="color" onChange={handleGradientChange(0)} />
                            <span className="tooltip">Degradado Títulos (Inicio)</span>
                        </div>
                        <div className="theme-button-wrapper custom-input-wrapper">
                            <input type="color" onChange={handleGradientChange(1)} />
                            <span className="tooltip">Degradado Títulos (Fin)</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ThemePanel;