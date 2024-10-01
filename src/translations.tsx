interface LanguageTranslations {
  [key: string]: string;
}

interface Translations {
  [key: string]: LanguageTranslations;
}

const translations: Translations = {
    en: {
      greeting: "Building...",
      Measure: "Measure",
      Train: "Train",
      Improve: "Improve",
      FlipCardBack1: "Measure your status and define your routine daily according to your HRV.",
      FlipCardBack2: " Instead of using predefined routines, respect your physiological cycles and improve your performance with this new methodology validated in numerous scientific\u00A0trials.",
      MeasureParagraph: "Measure your Heart Rate Variability every morning at rest to check your physiological state for the day ahead.",
      TrainParagraph: "Receive a plan for your endurance training session based on your HRV, respecting your weakest days and taking advantage of the strongest ones.",
      ImproveParagraph: "Make the most of the HRV-based training method which achieve greater improvements than standard predefined planning according numerous scientific trials.",
      Day: "Day",
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday",
      Suggestion: "Suggestion",
      Rest: "Rest",
      LowIntensity: "Low Intensity",
      HighIntensity: "High Intensity",
      GetInvolved: "Get involved!",
      EnterSurvey: "Fill in our survey and get full premium access forever"
    },
    es: {
      greeting: "En construcción...",
      Measure: "Mide",
      Train: "Entrena",
      Improve: "Mejora",
      FlipCardBack1: "Mide tu estado y define tu rutina a diario según\u00A0tu\u00A0VFC.",
      FlipCardBack2: "En vez de usar rutinas predefinidas respeta tus ciclos fisiológicos y mejora tu rendimiento con esta nueva metodología validada en numerosos ensayos\u00A0científicos.",
      MeasureParagraph: "Mide tu Variabilidad de Frecuencia Cardíaca cada mañana en reposo para comprobar tu estado fisiológico para el día que comienza.",
      TrainParagraph: "Recibe una planificación de tu sesión de entrenamiento de resistencia en función de tu VFC respetando así tus días más flojos y aprovechando los más fuertes.",
      ImproveParagraph: "Aprovecha la metodología de entrenamiento basado en VFC que ha demostrado obtener mayores mejoras que la planificación predefinida estándar en numerosos ensayos científicos.",
      Day: "Día",
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
      Suggestion: "Recomendación",
      Rest: "Descanso",
      LowIntensity: "Baja Intensidad",
      HighIntensity: "Alta Intensidad",
      GetInvolved: "Participa!",
      EnterSurvey: "Responde a nuestra encuesta y obtén acceso premium gratis ¡para siempre!"
    },
    ca: {
      greeting: "En construcció...",
      Measure: "Mesura",
      Train: "Entrena",
      Improve: "Millora",
      FlipCardBack1: "Mesura el teu estat i defineix la teua rutina diàriament segons la\u00A0teua\u00A0VFC.",
      FlipCardBack2: "En compte d'utilitzar rutines predefinides respecta els teus cicles fisiològics i millora el teu rendiment amb aquesta nova metodologia validada en nombrosos assajos\u00A0científics.",
      MeasureParagraph: "Mesura la teva Variabilitat de Freqüència Cardíaca cada matí en repòs per comprovar el teu estat fisiològic per al dia que comença.",
      TrainParagraph: "Rep una planificació de la teva sessió d'entrenament de resistència en funció de la teva VFC respectant així els teus dies més fluixos i aprofitant els més forts.",
      ImproveParagraph: "Aprofita la metodologia d'entrenament basat en VFC que ha demostrat obtenir major millora del rendiment que la planificació predefinida estàndard en nombrosos estudis científics.",
      Day: "Dia",
      Monday: "Dilluns",
      Tuesday: "Dimarts",
      Wednesday: "Dimecres",
      Thursday: "Dijous",
      Friday: "Divendres",
      Saturday: "Dissabte",
      Sunday: "Diumenge",
      Suggestion: "Recomanació",
      Rest: "Descans",
      LowIntensity: "Baixa Intensitat",
      HighIntensity: "Alta Intensitat",
      GetInvolved: "Participa!",
      EnterSurvey: "Ompli la nostra enquesta i aconsegueix accés premium gratuit per a sempre!"
    }
};

export default translations;