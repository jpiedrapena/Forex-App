# Generador de Ejercicios — Forex & Finanzas Internacionales

Aplicación web para generar ejercicios prácticos de mercados de divisas y finanzas internacionales con datos en tiempo real. Desarrollada para uso docente en el curso de **Relaciones Económicas Internacionales**.

## Uso

Abre `index.html` directamente en el navegador, o accede a la versión en línea:

**[→ Abrir aplicación](https://jpiedrapena.github.io/Forex-App/)**

## Ejercicios disponibles

**Tema 5 — Mercado de Divisas**
- Arbitraje simple (dos plazas)
- Arbitraje triangular (tres divisas)
- Arbitraje con criptomonedas (Bitcoin/Ethereum)
- Paridad Cubierta de Intereses (PCI)
- Paridad Descubierta de Intereses (PDI)

**Tema 6 — Tipos de Cambio C/P y L/P**
- Política monetaria a corto plazo (modelo BCE/Fed)
- Paridad del Poder Adquisitivo (PPA)
- Tipo de Cambio Real (TCR)

**Ejercicio Personalizable con IA**
- Genera ejercicios complejos y multitemáticos a partir de un contexto económico real
- Preguntas de aclaración interactivas (temática, dificultad, activos, horizonte temporal)
- Solución completa con errores frecuentes de estudiantes

## Datos en tiempo real

- **Tipos de cambio**: [Frankfurter API](https://www.frankfurter.app) (datos del BCE)
- **Criptomonedas**: [CoinGecko API](https://www.coingecko.com/en/api)
- **Ejercicios IA**: [Anthropic API](https://www.anthropic.com) (claude-sonnet)

## Exportación LaTeX

Cada ejercicio se puede exportar a `.tex` en dos versiones:
- **Versión alumno**: enunciado sin solución
- **Versión profesor**: enunciado + solución completa con fórmulas

Los documentos usan el mismo estilo que los materiales del curso (`tcolorbox`, `booktabs`, `enumitem`).

## Uso en clase

La aplicación está diseñada para usarse en el navegador en paralelo con la presentación de Beamer:

1. Abre la URL de GitHub Pages en el navegador del aula
2. Selecciona la temática correspondiente a la sesión
3. Genera el ejercicio en tiempo real delante de los estudiantes
4. Exporta el `.tex` si quieres distribuir el ejercicio después de clase
