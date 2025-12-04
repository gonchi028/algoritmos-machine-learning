# Algoritmos de Machine Learning - Regresión Lineal

Aplicación web moderna para análisis y visualización de datos mediante regresión lineal, construida con React y TypeScript. Este proyecto es parte de la asignatura **Tecnologías Emergentes** del programa de Ingeniería en Sistemas Informáticos de la Universidad del Valle (2025).

## 📋 Descripción del Proyecto

Esta aplicación implementa un análisis completo de **regresión lineal paso a paso**, permitiendo a los usuarios:
- Ingresar datos de pares (X, Y) de forma manual o mediante carga de archivos Excel
- Visualizar los datos mediante gráficos de dispersión
- Calcular automáticamente los parámetros de la regresión lineal
- Obtener resultados detallados incluyendo la ecuación de la recta, coeficientes y correlación
- Realizar predicciones basadas en el modelo generado
- Ver la línea de regresión ajustada a los datos

## ✨ Características Principales

- **Ingreso Flexible de Datos**
  - Entrada manual de datos mediante área de texto
  - Carga de archivos Excel (.xlsx)
  - Validación en tiempo real
  - Visualización inmediata de los datos cargados

- **Análisis de Regresión Lineal**
  - Cálculo automático de parámetros (pendiente e intersección)
  - Tabla detallada de cálculos paso a paso
  - Coeficiente de correlación de Pearson
  - Coeficiente de determinación (R²)
  - Generación automática de la ecuación de la recta

- **Visualizaciones Interactivas**
  - Gráfico de dispersión de datos originales
  - Línea de regresión ajustada
  - Gráfico de predicción con punto estimado

- **Predicciones**
  - Formulario para ingresar valores X
  - Cálculo automático de valores Y predichos
  - Visualización del punto predicho en el gráfico

## 🛠️ Stack Tecnológico

- **Framework Frontend**: React 19 con TypeScript
- **Herramienta de Build**: Vite
- **Estilización**: Tailwind CSS 4 con tema personalizado
- **Gestión de Estado**: Zustand
- **Manejo de Formularios**: React Hook Form con validación Zod
- **Componentes UI**: Radix UI + shadcn/ui
- **Gráficos**: Recharts
- **Iconografía**: Lucide React
- **Precisión Numérica**: Decimal.js
- **Notificaciones**: Sonner

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (versión LTS recomendada)
- npm o bun como gestor de paquetes

### Instalación

1. Clonar el repositorio:
```bash
git clone [repository-url]
cd algoritmos-machine-learning
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
algoritmos-machine-learning/
├── src/
│   ├── components/
│   │   ├── forms/              # Componentes de formularios
│   │   │   ├── calculate-form.tsx
│   │   │   ├── excel-upload-form.tsx
│   │   │   ├── text-area-data-form.tsx
│   │   │   └── upload-data-form.tsx
│   │   ├── ui/                 # Componentes UI reutilizables
│   │   ├── regression-data-display.tsx
│   │   ├── regression-results-display.tsx
│   │   ├── scatter-charts.tsx
│   │   └── prediction-form.tsx
│   ├── store/                  # Gestión de estado (Zustand)
│   │   ├── regression-store.ts
│   │   └── data-store.ts
│   ├── hooks/                  # Hooks personalizados
│   ├── lib/                    # Funciones utilitarias
│   │   ├── linear-regression.ts # Algoritmo de regresión lineal
│   │   ├── calculations.ts
│   │   └── utils.ts
│   └── App.tsx
├── public/                     # Activos estáticos
└── [archivos de configuración]
```

## 💡 Detalles de las Características

### Sistema de Ingreso de Datos
- Entrada de datos manual mediante área de texto (formato: X,Y por línea)
- Carga de archivos Excel con pares de datos
- Validación automática de formato
- Mensajes de error claros para datos inválidos
- Visualización inmediata en tabla

### Algoritmo de Regresión Lineal
El algoritmo implementa el método de **mínimos cuadrados** que calcula:
- **n**: Número de observaciones
- **ΣX, ΣY**: Sumas de valores
- **ΣX², ΣY², ΣXY**: Sumas de productos
- **X̄, Ȳ**: Medias de X e Y
- **b₁** (pendiente): Coeficiente angular de la recta
- **b₀** (intersección): Punto de corte con el eje Y
- **r** (coeficiente de Pearson): Medida de correlación lineal
- **R²** (coeficiente de determinación): Bondad de ajuste

### Interfaz de Usuario
- Diseño moderno y limpio
- Responsive para todos los tamaños de pantalla
- Componentes accesibles
- Tema personalizado con Tailwind CSS

## 🧑‍💻 Desarrollo

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo (puerto 3000)
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Vista previa del build de producción
- `npm run lint` - Ejecuta ESLint para verificar la calidad del código

## 🎓 Información Académica

**Asignatura**: Tecnologías Emergentes  
**Programa**: Ingeniería en Sistemas Informáticos  
**Institución**: Universidad del Valle  
**Semestre**: 6to Semestre  
**Año**: 2025

## 👥 Integrantes

Los integrantes del proyecto se muestran en la interfaz principal de la aplicación.

## 📋 Requisitos Cumplidos

✅ Implementación de algoritmo de regresión lineal  
✅ Interfaz gráfica interactiva  
✅ Entrada flexible de datos (texto y Excel)  
✅ Visualización de datos mediante gráficos  
✅ Cálculos paso a paso con precisión numérica  
✅ Predicciones basadas en el modelo  
✅ Código limpio y bien estructurado  
✅ Validación de datos en tiempo real  

## 📝 Notas de Implementación

- Se utiliza **Decimal.js** para garantizar precisión en cálculos numéricos
- La aplicación maneja casos especiales y valida los datos de entrada
- Los gráficos son interactivos y se actualizan automáticamente
- El estado global se gestiona con Zustand para mantenibilidad
- Los formularios utilizan React Hook Form para mejor manejo y validación

## 📄 Licencia

Este proyecto es una práctica académica universitaria.

---

**Nota**: Para más información sobre regresión lineal y sus aplicaciones en machine learning, consulte los recursos académicos en la documentación del curso de Tecnologías Emergentes.

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
