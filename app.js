/* ============================================================
   Aprueba RD — Simulador para el examen teórico de licencia
   Motor de la aplicación (JavaScript vanilla, sin dependencias)
   ------------------------------------------------------------
   Todo corre en el navegador. Los datos del usuario (progreso,
   preguntas falladas, mejor puntaje) se guardan SOLO en este
   dispositivo con localStorage. Nada se envía a ningún servidor.
   ============================================================

   FUENTES / POR VERIFICAR (revisar cifras vigentes en el INTRANT
   antes de tomar el examen real — intrant.gob.do):
   - Ley 63-17 de Movilidad, Transporte Terrestre, Tránsito y
     Seguridad Vial (marco general de las preguntas).
   - Límite de alcohol en sangre para conductores particulares:
     usado aquí como 0.5 g/L (0.05%). VERIFICAR valor y categorías
     (profesionales / motociclistas suelen tener límite menor).
   - Límite de velocidad en zona urbana: usado como 60 km/h.
     VERIFICAR por tipo de vía y señalización local.
   - Límite de velocidad en zona escolar / hospitalaria: usado
     como referencia "muy reducida (aprox. 20–30 km/h)". VERIFICAR.
   - Sistema de puntos / cuantía de multas: las preguntas usan el
     CONCEPTO (existen y se aplican). VERIFICAR montos vigentes.
   Las preguntas de significado de señales se basan en la
   convención UNIVERSAL de forma y color, no en cifras.
   ============================================================ */

"use strict";

/* ---------- Categorías (etiquetas legibles) ---------- */
const CATEGORIAS = {
  senales:      { nombre: "Señales de tránsito",          emoji: "🚸" },
  circulacion:  { nombre: "Normas de circulación",        emoji: "🛣️" },
  prioridad:    { nombre: "Prioridad y derecho de paso",  emoji: "⚠️" },
  velocidad:    { nombre: "Velocidad",                     emoji: "🏁" },
  alcohol:      { nombre: "Alcohol y sanciones",           emoji: "🚫" },
  documentos:   { nombre: "Documentos y requisitos",       emoji: "📄" },
  seguridad:    { nombre: "Seguridad vial",                emoji: "🦺" },
  emergencias:  { nombre: "Emergencias y primeros auxilios", emoji: "🚑" }
};

/* ============================================================
   BANCO DE PREGUNTAS
   Cada objeto: { id, categoria, enunciado, opciones[], correcta, explicacion }
   ============================================================ */
const BANCO = [
  /* ---------- 1) SEÑALES ---------- */
  { id: 1, categoria: "senales",
    enunciado: "¿Qué debes hacer al ver una señal octagonal de color rojo con la palabra “PARE”?",
    opciones: ["Reducir un poco y seguir si no viene nadie", "Detenerte por completo antes de la línea y ceder el paso", "Tocar el claxon para avisar", "Acelerar para cruzar rápido"],
    correcta: 1,
    explicacion: "El octágono rojo (PARE/ALTO) obliga a una detención TOTAL. Solo avanzas cuando el cruce está libre y es seguro." },

  { id: 2, categoria: "senales",
    enunciado: "Una señal en forma de triángulo con la punta hacia abajo y borde rojo significa:",
    opciones: ["Prohibido girar", "Ceda el paso", "Zona escolar", "Fin de vía"],
    correcta: 1,
    explicacion: "El triángulo invertido con borde rojo es “Ceda el paso”: debes reducir y dejar pasar a los demás; te detienes solo si es necesario." },

  { id: 3, categoria: "senales",
    enunciado: "En general, las señales de forma triangular con borde rojo son:",
    opciones: ["Informativas (servicios)", "De obligación", "Preventivas (advierten un peligro)", "De destino turístico"],
    correcta: 2,
    explicacion: "El triángulo con borde rojo advierte un PELIGRO próximo (curva, cruce, niños). Anuncia que debes extremar precaución." },

  { id: 4, categoria: "senales",
    enunciado: "Las señales circulares con borde rojo generalmente indican:",
    opciones: ["Una prohibición o restricción", "Un lugar de interés", "Una recomendación opcional", "El fin de una autopista"],
    correcta: 0,
    explicacion: "El círculo con borde rojo es reglamentario: PROHÍBE o RESTRINGE algo (no entrar, no rebasar, límite de velocidad). Su cumplimiento es obligatorio." },

  { id: 5, categoria: "senales",
    enunciado: "El color amarillo o ámbar en las señales de tránsito se asocia principalmente con:",
    opciones: ["Información de servicios", "Prevención y advertencia de peligro", "Obligación", "Prohibición absoluta"],
    correcta: 1,
    explicacion: "El amarillo/ámbar es el color de la PREVENCIÓN: avisa de un riesgo adelante para que reduzcas y estés atento." },

  { id: 6, categoria: "senales",
    enunciado: "Una señal circular con borde rojo y el número “60” dentro indica:",
    opciones: ["Distancia de 60 km al próximo pueblo", "Velocidad mínima de 60 km/h", "Velocidad máxima permitida de 60 km/h", "60 metros hasta una curva"],
    correcta: 2,
    explicacion: "Es una señal reglamentaria de velocidad MÁXIMA: no debes superar los 60 km/h en ese tramo." },

  { id: 7, categoria: "senales",
    enunciado: "Ves una señal amarilla con la silueta de dos niños. Debes:",
    opciones: ["Acelerar para salir rápido de la zona", "Reducir la velocidad y extremar precaución por presencia de escolares", "Tocar el claxon continuamente", "Ignorarla si no ves niños"],
    correcta: 1,
    explicacion: "Es una señal preventiva de ZONA ESCOLAR. Reduce la velocidad y prepárate para detenerte: pueden cruzar niños en cualquier momento." },

  { id: 8, categoria: "senales",
    enunciado: "Una línea CONTINUA pintada en el centro de la vía significa que:",
    opciones: ["Puedes rebasar con cuidado", "Está prohibido rebasar o cruzarla", "La vía tiene un solo sentido", "Debes cambiar de carril"],
    correcta: 1,
    explicacion: "La línea continua PROHÍBE rebasar y cruzarla. Solo se puede adelantar donde la línea es discontinua y hay buena visibilidad." },

  { id: 9, categoria: "senales",
    enunciado: "Una señal de fondo azul con un símbolo blanco (por ejemplo, un tenedor y cuchara o una “P”) es una señal:",
    opciones: ["De peligro inminente", "Informativa o de servicios", "De prohibición", "De alto obligatorio"],
    correcta: 1,
    explicacion: "El fondo azul se usa para señales INFORMATIVAS y de servicios (estacionamiento, restaurante, hospital). Orientan, no prohíben." },

  { id: 10, categoria: "senales",
    enunciado: "Una señal circular con una “E” (o “P”) tachada con una línea roja indica:",
    opciones: ["Estación de servicio adelante", "Prohibido estacionar en ese tramo", "Entrada permitida", "Zona de parada de autobús"],
    correcta: 1,
    explicacion: "El símbolo tachado en rojo prohíbe estacionar (parquear) en ese lugar. Detenerte ahí puede acarrear multa o remolque del vehículo." },

  /* ---------- 2) CIRCULACIÓN ---------- */
  { id: 11, categoria: "circulacion",
    enunciado: "Como regla general, ¿por qué carril debes circular en una vía de varios carriles?",
    opciones: ["Por el carril izquierdo siempre", "Por el carril de la derecha, dejando el izquierdo para rebasar", "Por el centro para tener más espacio", "Por cualquiera, no hay regla"],
    correcta: 1,
    explicacion: "Se circula por la derecha. El carril izquierdo se reserva para rebasar; luego debes volver a tu carril." },

  { id: 12, categoria: "circulacion",
    enunciado: "¿Cuándo está permitido rebasar (adelantar) a otro vehículo?",
    opciones: ["En una curva sin visibilidad", "Con línea discontinua, buena visibilidad y por la izquierda", "En un puente estrecho", "Justo antes de una intersección"],
    correcta: 1,
    explicacion: "Se rebasa por la IZQUIERDA, solo con línea discontinua, suficiente visibilidad y espacio. Nunca en curvas, puentes o cruces." },

  { id: 13, categoria: "circulacion",
    enunciado: "Al aproximarte a una rotonda (redondel), la regla general es:",
    opciones: ["Tienes prioridad para entrar de inmediato", "Ceder el paso a los vehículos que ya circulan dentro de la rotonda", "Tocar el claxon y entrar", "Detenerte siempre por completo"],
    correcta: 1,
    explicacion: "En la rotonda tiene prioridad quien ya está circulando dentro. Debes ceder el paso y entrar cuando haya un espacio seguro." },

  { id: 14, categoria: "circulacion",
    enunciado: "Antes de girar o cambiar de carril debes:",
    opciones: ["Frenar de golpe", "Encender la luz direccional (intermitente) con anticipación", "Tocar el claxon", "Encender las luces altas"],
    correcta: 1,
    explicacion: "Las direccionales avisan tu intención a los demás. Señaliza ANTES de la maniobra y verifica espejos y punto ciego." },

  { id: 15, categoria: "circulacion",
    enunciado: "Circulas de noche y viene un vehículo de frente. Con las luces altas (largas) debes:",
    opciones: ["Mantenerlas para ver mejor", "Bajarlas a luces bajas para no encandilar al otro conductor", "Apagar todas las luces", "Encender las intermitentes"],
    correcta: 1,
    explicacion: "Las luces altas encandilan a quien viene de frente. Cambia a luces bajas al cruzarte con otro vehículo o al seguir a uno de cerca." },

  { id: 16, categoria: "circulacion",
    enunciado: "¿Cuál es el uso correcto del claxon (bocina)?",
    opciones: ["Para apurar a los demás en el tapón", "Para expresar molestia", "Solo para prevenir un accidente o avisar un peligro", "Para saludar constantemente"],
    correcta: 2,
    explicacion: "El claxon es un aviso de seguridad, no un desahogo. Úsalo brevemente para evitar un accidente, no para presionar o molestar." },

  { id: 17, categoria: "circulacion",
    enunciado: "El semáforo cambia a AMARILLO cuando te acercas. Lo correcto es:",
    opciones: ["Acelerar para cruzar antes del rojo", "Detenerte si puedes hacerlo con seguridad, porque viene el rojo", "Tocar el claxon y seguir", "Cerrar los ojos y pasar"],
    correcta: 1,
    explicacion: "El amarillo anuncia que viene el rojo: prepárate para detenerte. Solo continúa si frenar de golpe fuera peligroso para quien viene detrás." },

  { id: 18, categoria: "circulacion",
    enunciado: "Mantener una distancia de seguimiento adecuada con el vehículo de adelante sirve para:",
    opciones: ["Ahorrar combustible", "Tener tiempo y espacio para frenar si el de adelante se detiene", "Ir más rápido", "Que no te rebasen"],
    correcta: 1,
    explicacion: "La distancia de seguimiento te da margen de reacción y frenado. A mayor velocidad o mal clima, mayor debe ser la distancia." },

  { id: 19, categoria: "circulacion",
    enunciado: "Antes de cambiar de carril, además de la direccional, debes:",
    opciones: ["Cerrar las ventanas", "Revisar los espejos y el punto ciego girando la cabeza", "Acelerar al máximo", "Encender las luces altas"],
    correcta: 1,
    explicacion: "Los espejos no cubren el “punto ciego”. Mira por encima del hombro para confirmar que no viene otro vehículo antes de cambiar de carril." },

  { id: 20, categoria: "circulacion",
    enunciado: "En una vía de un solo sentido, ¿cómo debes circular?",
    opciones: ["En contra si hay espacio", "En el sentido indicado; nunca en contravía", "En cualquier sentido de noche", "Solo por el borde izquierdo"],
    correcta: 1,
    explicacion: "En una vía de sentido único se circula únicamente en la dirección permitida. Ir en contravía es una infracción grave y muy peligrosa." },

  /* ---------- 3) PRIORIDAD ---------- */
  { id: 21, categoria: "prioridad",
    enunciado: "Llegas a una intersección sin señales ni semáforo al mismo tiempo que otro vehículo. ¿Quién tiene prioridad?",
    opciones: ["El que va más rápido", "El vehículo que viene por tu derecha", "El vehículo más grande", "El que toque primero el claxon"],
    correcta: 1,
    explicacion: "Sin señales que indiquen otra cosa, cede el paso al vehículo que se aproxima por tu DERECHA." },

  { id: 22, categoria: "prioridad",
    enunciado: "Un peatón está cruzando por el paso de peatones (paso de cebra). Debes:",
    opciones: ["Tocar el claxon para que se apure", "Cederle el paso y esperar a que termine de cruzar", "Pasar rápido por detrás de él", "Seguir, el peatón debe esperarte"],
    correcta: 1,
    explicacion: "El peatón en el paso peatonal tiene prioridad. Detente y déjalo cruzar con seguridad; los peatones son los usuarios más vulnerables." },

  { id: 23, categoria: "prioridad",
    enunciado: "Se acerca una ambulancia con sirena y luces encendidas. ¿Qué haces?",
    opciones: ["Sigues igual, no es tu problema", "Te orillas a la derecha y le cedes el paso", "Aceleras para no estorbar", "Te detienes en medio de la vía"],
    correcta: 1,
    explicacion: "Los vehículos de emergencia tienen prioridad. Reduce, oríllate a la derecha con seguridad y déjales el paso libre." },

  { id: 24, categoria: "prioridad",
    enunciado: "Vas a girar a la izquierda en una intersección y vienen vehículos de frente. Debes:",
    opciones: ["Girar primero porque llegaste antes", "Cederles el paso a los que vienen de frente antes de girar", "Tocar el claxon y girar", "Girar por la derecha de ellos"],
    correcta: 1,
    explicacion: "Al girar a la izquierda cruzas el sentido contrario: cede el paso a los vehículos que vienen de frente y gira cuando esté despejado." },

  { id: 25, categoria: "prioridad",
    enunciado: "Vas a salir de un parqueo o de una vía privada hacia la calle. ¿Quién tiene prioridad?",
    opciones: ["Tú, porque ya estás en movimiento", "Los vehículos que ya circulan por la calle", "El que venga más lento", "Nadie, entras cuando quieras"],
    correcta: 1,
    explicacion: "Quien se incorpora desde un parqueo o vía privada debe ceder el paso a todos los que ya circulan por la vía." },

  { id: 26, categoria: "prioridad",
    enunciado: "Un autobús escolar está detenido con sus luces intermitentes encendidas mientras bajan niños. Debes:",
    opciones: ["Rebasarlo rápido por la izquierda", "Detenerte y esperar, pues pueden cruzar niños", "Tocar el claxon", "Reducir un poco y seguir"],
    correcta: 1,
    explicacion: "Cuando el transporte escolar se detiene con luces para subir o bajar niños, detente: es muy probable que crucen la vía." },

  { id: 27, categoria: "prioridad",
    enunciado: "La señal “Ceda el paso” te obliga a:",
    opciones: ["Detenerte siempre por completo aunque no venga nadie", "Reducir la velocidad y ceder a los demás, deteniéndote solo si hace falta", "Acelerar para incorporarte", "Ignorarla si no hay tráfico"],
    correcta: 1,
    explicacion: "“Ceda el paso” no siempre exige detenerse: reduces, observas y cedes; te detienes únicamente si viene otro vehículo." },

  { id: 28, categoria: "prioridad",
    enunciado: "En una intersección con semáforo en verde para ti, pero hay un peatón que aún cruza, debes:",
    opciones: ["Avanzar porque tienes verde", "Esperar a que el peatón termine de cruzar", "Tocar el claxon", "Rodearlo a alta velocidad"],
    correcta: 1,
    explicacion: "El verde te da paso, pero la seguridad del peatón está primero. Espera a que termine de cruzar antes de avanzar." },

  { id: 29, categoria: "prioridad",
    enunciado: "Circulas por una vía principal y otro vehículo espera en una calle secundaria con “PARE”. ¿Quién tiene prioridad?",
    opciones: ["El de la calle secundaria", "Tú, que vas por la vía principal", "El que arranque primero", "Ninguno, ambos se detienen"],
    correcta: 1,
    explicacion: "El vehículo con señal de PARE debe detenerse y cederte el paso. Aun así, conduce a la defensiva por si el otro no respeta la señal." },

  /* ---------- 4) VELOCIDAD ---------- */
  { id: 30, categoria: "velocidad",
    enunciado: "El principio básico sobre la velocidad al conducir es:",
    opciones: ["Ir siempre al límite máximo", "Adaptar la velocidad a las condiciones de la vía, el clima y el tráfico", "Ir lo más rápido posible si la vía está libre", "Mantener una velocidad fija sin importar el entorno"],
    correcta: 1,
    explicacion: "El límite es un máximo, no una obligación. Debes reducir con lluvia, neblina, tráfico, de noche o en zonas con peatones." },

  { id: 31, categoria: "velocidad",
    enunciado: "¿Cómo afecta el exceso de velocidad a la conducción?",
    opciones: ["Mejora los reflejos", "Aumenta la distancia de frenado y reduce el tiempo de reacción", "No afecta si eres experto", "Hace el vehículo más estable"],
    correcta: 1,
    explicacion: "A más velocidad, más distancia necesitas para frenar y menos tiempo tienes para reaccionar. Por eso el exceso agrava los accidentes." },

  { id: 32, categoria: "velocidad",
    enunciado: "Al conducir bajo lluvia intensa, lo correcto respecto a la velocidad es:",
    opciones: ["Mantener la velocidad normal", "Reducir la velocidad y aumentar la distancia con el de adelante", "Acelerar para salir rápido de la lluvia", "Frenar bruscamente a menudo"],
    correcta: 1,
    explicacion: "Con la vía mojada el vehículo tarda más en frenar y puede deslizarse (hidroplaneo). Reduce la velocidad y deja más distancia." },

  { id: 33, categoria: "velocidad",
    enunciado: "En una zona escolar u hospitalaria debes circular:",
    opciones: ["A la velocidad máxima de la vía", "A velocidad muy reducida y con máxima precaución", "Igual que en autopista", "Solo tocando el claxon"],
    correcta: 1,
    explicacion: "Las zonas escolares y hospitalarias exigen velocidad muy baja: hay peatones vulnerables y cruces frecuentes. Respeta la señalización local." },

  { id: 34, categoria: "velocidad",
    enunciado: "En una vía urbana común, cuando la señalización no indica otra cosa, la velocidad máxima de referencia suele ser:",
    opciones: ["Alrededor de 60 km/h", "120 km/h", "Sin límite", "20 km/h en todas las calles"],
    correcta: 0,
    explicacion: "En zona urbana se maneja despacio (referencia aprox. 60 km/h). Verifica siempre la señal del tramo: puede ser menor. (Cifra POR VERIFICAR en el INTRANT.)" },

  { id: 35, categoria: "velocidad",
    enunciado: "Circular demasiado LENTO en una vía rápida sin motivo justificado:",
    opciones: ["Es lo más seguro siempre", "Puede obstruir el tránsito y provocar accidentes", "Está permitido en cualquier carril", "No tiene ninguna consecuencia"],
    correcta: 1,
    explicacion: "Ir muy por debajo del flujo obliga a otros a rebasar y frenar bruscamente. Mantén un ritmo acorde al tránsito y usa el carril derecho si vas lento." },

  { id: 36, categoria: "velocidad",
    enunciado: "Con neblina densa, la conducta correcta es:",
    opciones: ["Encender luces altas y acelerar", "Reducir la velocidad, usar luces bajas y aumentar la distancia", "Apagar las luces", "Seguir a la misma velocidad"],
    correcta: 1,
    explicacion: "La neblina reduce la visibilidad. Usa luces bajas (las altas rebotan y encandilan), baja la velocidad y aumenta la distancia de seguimiento." },

  { id: 37, categoria: "velocidad",
    enunciado: "La “distancia de frenado” es:",
    opciones: ["Lo que mide el vehículo", "La distancia que recorre el vehículo desde que frenas hasta que se detiene", "La distancia entre carriles", "La velocidad máxima permitida"],
    correcta: 1,
    explicacion: "Es el espacio que necesita el vehículo para detenerse tras accionar el freno. Aumenta con la velocidad, el peso y una vía mojada." },

  /* ---------- 5) ALCOHOL Y SANCIONES ---------- */
  { id: 38, categoria: "alcohol",
    enunciado: "¿Cómo afecta el consumo de alcohol a la conducción?",
    opciones: ["Mejora la concentración", "Reduce los reflejos, la visión y la capacidad de juicio", "No afecta si comes algo", "Solo afecta a personas mayores"],
    correcta: 1,
    explicacion: "El alcohol disminuye reflejos, visión, coordinación y juicio, aunque sientas que controlas. Por eso conducir bebido es tan peligroso." },

  { id: 39, categoria: "alcohol",
    enunciado: "Si vas a beber alcohol en una reunión, lo más responsable es:",
    opciones: ["Manejar despacio de regreso", "No conducir: usar transporte, taxi o un conductor designado", "Tomar café antes de manejar", "Beber solo cerveza y manejar"],
    correcta: 1,
    explicacion: "Ni el café ni el tiempo corto eliminan el alcohol de forma segura. Si bebiste, no conduzcas: planifica otro medio para volver." },

  { id: 40, categoria: "alcohol",
    enunciado: "Sobre el nivel de alcohol y la conducción, ¿qué afirmación es correcta?",
    opciones: ["Hay un nivel totalmente seguro para todos", "Existe un límite legal de alcohol en sangre y superarlo es una infracción", "Puedes beber sin límite si comes", "El límite no aplica de noche"],
    correcta: 1,
    explicacion: "La ley fija un límite máximo de alcohol en sangre (referencia usada: 0.5 g/L para particulares) y superarlo es sancionable. Lo más seguro es cero alcohol al conducir. (Cifra POR VERIFICAR en el INTRANT.)" },

  { id: 41, categoria: "alcohol",
    enunciado: "El “sistema de puntos” asociado a la licencia funciona, en concepto, así:",
    opciones: ["Ganas puntos por conducir rápido", "Las infracciones restan puntos y puedes perder la licencia si acumulas faltas", "Los puntos son un premio en efectivo", "No existe ninguna consecuencia por infringir"],
    correcta: 1,
    explicacion: "Cada infracción resta puntos o suma faltas al historial del conductor. Acumular infracciones puede llevar a la suspensión de la licencia." },

  { id: 42, categoria: "alcohol",
    enunciado: "Conducir bajo los efectos del alcohol puede acarrear:",
    opciones: ["Solo una advertencia verbal", "Multas, suspensión de la licencia y responsabilidad penal si causas daños", "Un descuento en el seguro", "Ninguna sanción la primera vez"],
    correcta: 1,
    explicacion: "Conducir ebrio conlleva multas, retención del vehículo, suspensión de la licencia y responsabilidad penal si provocas lesiones o muertes." },

  { id: 43, categoria: "alcohol",
    enunciado: "Un agente te solicita una prueba de alcoholemia en un operativo. Negarte a realizarla:",
    opciones: ["No tiene consecuencias", "Puede considerarse una infracción y acarrear sanciones", "Es tu derecho sin costo", "Obliga al agente a dejarte ir"],
    correcta: 1,
    explicacion: "La prueba de alcoholemia es un control de seguridad vial. Negarse suele tratarse como infracción y conlleva sanciones. Verifica el procedimiento vigente." },

  { id: 44, categoria: "alcohol",
    enunciado: "Además del alcohol, ¿qué otra sustancia afecta gravemente la conducción?",
    opciones: ["El agua", "Ciertos medicamentos que dan sueño y las drogas", "Las frutas", "El jugo natural"],
    correcta: 1,
    explicacion: "Drogas y algunos medicamentos (con advertencia de somnolencia) reducen reflejos y atención. Lee el prospecto y no conduzcas si te da sueño." },

  { id: 45, categoria: "alcohol",
    enunciado: "¿Cuál es la forma más segura de decidir cuánto alcohol tomar si vas a manejar?",
    opciones: ["Calcular según tu peso", "No tomar nada de alcohol antes de conducir", "Tomar solo una copa grande", "Beber y esperar 30 minutos"],
    correcta: 1,
    explicacion: "Ningún nivel de alcohol mejora la conducción. La opción más segura y sin riesgo de multa es cero alcohol cuando vas a manejar." },

  /* ---------- 6) DOCUMENTOS Y REQUISITOS ---------- */
  { id: 46, categoria: "documentos",
    enunciado: "Para conducir legalmente un vehículo de motor necesitas, obligatoriamente:",
    opciones: ["Solo saber manejar", "Una licencia de conducir vigente de la categoría correspondiente", "Ser mayor de 30 años", "Un permiso de tus padres"],
    correcta: 1,
    explicacion: "Conducir requiere licencia vigente y de la categoría adecuada al tipo de vehículo. Conducir sin licencia es una infracción." },

  { id: 47, categoria: "documentos",
    enunciado: "El “marbete” del vehículo es:",
    opciones: ["El seguro de vida del conductor", "El adhesivo que acredita el pago del impuesto de circulación vigente", "La licencia de conducir", "La placa del vehículo"],
    correcta: 1,
    explicacion: "El marbete comprueba que el vehículo está al día con el impuesto de circulación. Debe estar vigente y visible en el parabrisas." },

  { id: 48, categoria: "documentos",
    enunciado: "El seguro obligatorio (póliza) del vehículo sirve para:",
    opciones: ["Pagar la gasolina", "Cubrir daños a terceros en caso de accidente", "Reemplazar la licencia", "Evitar el pago de impuestos"],
    correcta: 1,
    explicacion: "El seguro obligatorio responde por daños a terceros en un accidente. Circular sin seguro vigente es una infracción." },

  { id: 49, categoria: "documentos",
    enunciado: "La revista o inspección técnica vehicular tiene como objetivo:",
    opciones: ["Cobrar más impuestos", "Verificar que el vehículo está en condiciones seguras para circular", "Cambiar el color del vehículo", "Renovar la licencia del conductor"],
    correcta: 1,
    explicacion: "La inspección técnica revisa frenos, luces, gomas y emisiones para garantizar que el vehículo es seguro para transitar." },

  { id: 50, categoria: "documentos",
    enunciado: "Al conducir, ¿qué documentos debes portar?",
    opciones: ["Ninguno si conoces la vía", "Licencia vigente, y tener en regla los documentos del vehículo (seguro, marbete)", "Solo la cédula", "Una foto de la licencia en el celular basta siempre"],
    correcta: 1,
    explicacion: "Debes portar tu licencia vigente y mantener en regla los documentos del vehículo (matrícula, seguro y marbete) para presentarlos si te los piden." },

  { id: 51, categoria: "documentos",
    enunciado: "Las licencias de conducir se dividen en categorías porque:",
    opciones: ["Es solo un trámite de color", "Cada categoría autoriza a conducir cierto tipo de vehículo (motor, liviano, pesado)", "Dependen de la edad únicamente", "No tienen ninguna función"],
    correcta: 1,
    explicacion: "Cada categoría habilita un tipo de vehículo (motocicleta, liviano, carga, pasajeros). Debes tener la categoría correcta para lo que conduces." },

  { id: 52, categoria: "documentos",
    enunciado: "Cuando tu licencia de conducir está por vencer, debes:",
    opciones: ["Seguir usándola vencida", "Renovarla antes de que expire para seguir conduciendo legalmente", "Sacar una nueva cédula", "Esperar a que te multen"],
    correcta: 1,
    explicacion: "Conducir con la licencia vencida es una infracción. Renuévala a tiempo en el INTRANT para mantenerte al día." },

  { id: 53, categoria: "documentos",
    enunciado: "La placa (chapa) del vehículo debe:",
    opciones: ["Estar oculta para evitar multas", "Estar colocada, visible y legible según corresponde", "Pintarse del color que prefieras", "Retirarse de noche"],
    correcta: 1,
    explicacion: "La placa identifica el vehículo y debe estar visible y legible. Ocultarla, alterarla o circular sin ella es una infracción grave." },

  /* ---------- 7) SEGURIDAD VIAL ---------- */
  { id: 54, categoria: "seguridad",
    enunciado: "El uso del cinturón de seguridad es obligatorio para:",
    opciones: ["Solo el conductor", "El conductor y todos los pasajeros del vehículo", "Solo en autopista", "Solo de noche"],
    correcta: 1,
    explicacion: "El cinturón salva vidas y su uso es obligatorio para el conductor y todos los ocupantes, en cualquier vía y a cualquier velocidad." },

  { id: 55, categoria: "seguridad",
    enunciado: "Para transportar a un niño pequeño en el vehículo, lo correcto es:",
    opciones: ["Llevarlo en brazos adelante", "Usar una sillita o sistema de retención infantil adecuado a su edad y peso", "Sentarlo solo adelante con cinturón de adulto", "No necesita nada si vas despacio"],
    correcta: 1,
    explicacion: "Los niños deben ir en una silla de retención adecuada a su talla, en el asiento trasero. Un cinturón de adulto o los brazos no los protegen." },

  { id: 56, categoria: "seguridad",
    enunciado: "En una motocicleta, el casco es obligatorio para:",
    opciones: ["Solo el conductor", "El conductor y el pasajero (acompañante)", "Nadie si el viaje es corto", "Solo en carretera"],
    correcta: 1,
    explicacion: "El casco protege la vida en caso de caída. Es obligatorio para el conductor y el pasajero de la motocicleta, siempre y bien abrochado." },

  { id: 57, categoria: "seguridad",
    enunciado: "Usar el teléfono celular en la mano mientras conduces:",
    opciones: ["Está permitido si vas despacio", "Es peligroso y está prohibido porque distrae y quita atención de la vía", "Solo importa de noche", "Es seguro si escribes rápido"],
    correcta: 1,
    explicacion: "El celular en la mano distrae la vista y las manos. Está prohibido; si necesitas usarlo, detente en un lugar seguro o usa manos libres." },

  { id: 58, categoria: "seguridad",
    enunciado: "Sientes sueño o fatiga mientras conduces en carretera. Lo correcto es:",
    opciones: ["Acelerar para llegar antes", "Detenerte en un lugar seguro y descansar", "Subir el volumen de la música y seguir", "Tomar más café y no parar nunca"],
    correcta: 1,
    explicacion: "La fatiga reduce reflejos igual que el alcohol y puede causar microsueños. Detente, descansa o cambia de conductor: llegar cansado no vale un accidente." },

  { id: 59, categoria: "seguridad",
    enunciado: "El “punto ciego” del vehículo es:",
    opciones: ["Una avería del motor", "La zona que no se ve por los espejos y hay que revisar girando la cabeza", "El centro del volante", "Una señal de tránsito"],
    correcta: 1,
    explicacion: "El punto ciego es el área lateral-trasera que los espejos no cubren. Antes de cambiar de carril, gira la cabeza para revisarlo." },

  { id: 60, categoria: "seguridad",
    enunciado: "Antes de emprender un viaje largo, es recomendable revisar:",
    opciones: ["Solo la música", "Gomas (neumáticos), frenos, luces y niveles de fluidos", "El color del vehículo", "Nada, se revisa en el camino"],
    correcta: 1,
    explicacion: "Una revisión previa de gomas, frenos, luces, agua y aceite previene fallas peligrosas en carretera. Vale la pena hacerla antes de salir." },

  { id: 61, categoria: "seguridad",
    enunciado: "Un niño pequeño, por seguridad, debe viajar preferentemente:",
    opciones: ["En el asiento delantero", "En el asiento trasero con su sistema de retención", "En el baúl", "De pie entre los asientos"],
    correcta: 1,
    explicacion: "El asiento trasero es más seguro para los niños, y siempre con la silla de retención adecuada. El airbag delantero puede lesionarlos." },

  { id: 62, categoria: "seguridad",
    enunciado: "Las gomas (neumáticos) muy gastadas o lisas son peligrosas porque:",
    opciones: ["Hacen el carro más rápido", "Reducen el agarre y alargan la distancia de frenado, sobre todo en mojado", "Ahorran combustible", "No influyen en la seguridad"],
    correcta: 1,
    explicacion: "Sin dibujo suficiente, la goma no evacúa el agua ni agarra bien: el vehículo frena peor y puede deslizarse. Revisa el desgaste con regularidad." },

  /* ---------- 8) EMERGENCIAS Y PRIMEROS AUXILIOS ---------- */
  { id: 63, categoria: "emergencias",
    enunciado: "Presencias o tienes un accidente de tránsito. Lo PRIMERO que debes hacer es:",
    opciones: ["Discutir de quién fue la culpa", "Asegurar la zona: encender las intermitentes y señalizar para evitar otro accidente", "Mover rápido todos los vehículos", "Grabar un video para redes"],
    correcta: 1,
    explicacion: "Primero se protege el lugar para evitar un segundo accidente: intermitentes, triángulos y señalización. Luego se auxilia y se llama a emergencias." },

  { id: 64, categoria: "emergencias",
    enunciado: "En República Dominicana, el número de emergencias para pedir ayuda es:",
    opciones: ["El 411", "El 9-1-1", "El 123", "No existe un número"],
    correcta: 1,
    explicacion: "El 9-1-1 es el Sistema Nacional de Atención a Emergencias. Llámalo para reportar accidentes y solicitar ambulancia, bomberos o policía." },

  { id: 65, categoria: "emergencias",
    enunciado: "Hay un herido en un accidente. Como norma general, respecto a moverlo:",
    opciones: ["Muévelo de inmediato en cualquier caso", "No lo muevas salvo peligro inminente (fuego, riesgo), y espera a los socorristas", "Siéntalo y dale agua", "Sacúdelo para que reaccione"],
    correcta: 1,
    explicacion: "Mover a un herido puede agravar lesiones de columna. No lo muevas salvo peligro inmediato; llama al 9-1-1 y espera ayuda profesional." },

  { id: 66, categoria: "emergencias",
    enunciado: "Elementos básicos de seguridad que conviene llevar en el vehículo son:",
    opciones: ["Solo el celular", "Triángulo de señalización, botiquín y extintor", "Solo herramientas de música", "Nada en particular"],
    correcta: 1,
    explicacion: "El triángulo alerta a otros conductores, el botiquín atiende heridas menores y el extintor ayuda ante un conato de fuego. Revisa que estén en buen estado." },

  { id: 67, categoria: "emergencias",
    enunciado: "Si se te poncha (revienta) una goma a velocidad, debes:",
    opciones: ["Frenar bruscamente y girar fuerte", "Sujetar firme el volante, soltar el acelerador y reducir la velocidad de forma gradual", "Acelerar para estabilizar", "Soltar el volante"],
    correcta: 1,
    explicacion: "Ante un reventón, sujeta firme el volante, no frenes de golpe: suelta el acelerador y reduce poco a poco hasta orillarte con seguridad." },

  { id: 68, categoria: "emergencias",
    enunciado: "Si los frenos fallan mientras conduces, una acción recomendada es:",
    opciones: ["Apagar el motor de inmediato", "Reducir de marcha (motor) y usar el freno de mano de forma progresiva", "Saltar del vehículo", "Acelerar más"],
    correcta: 1,
    explicacion: "Baja de marcha para que el motor frene, aplica el freno de mano poco a poco y busca orillarte. Apagar el motor puede bloquear la dirección." },

  { id: 69, categoria: "emergencias",
    enunciado: "Ante una hemorragia visible en un herido, un primer auxilio básico es:",
    opciones: ["Darle agua para que se recupere", "Presionar directamente la herida con un paño limpio para controlar el sangrado", "Frotar la herida con tierra", "Dejarlo sangrar hasta que llegue la ayuda"],
    correcta: 1,
    explicacion: "La presión directa con un paño limpio ayuda a controlar el sangrado mientras llega la ambulancia. No des de beber a un herido grave." },

  { id: 70, categoria: "emergencias",
    enunciado: "Debes detenerte de emergencia en la carretera. Lo correcto es:",
    opciones: ["Detenerte en pleno carril sin avisar", "Orillarte fuera de la vía, encender las intermitentes y colocar el triángulo detrás", "Parar en una curva", "Dejar el vehículo y alejarte sin señalizar"],
    correcta: 1,
    explicacion: "Oríllate lo más fuera posible, enciende las intermitentes y coloca el triángulo a suficiente distancia detrás para que te vean a tiempo." },

  { id: 71, categoria: "emergencias",
    enunciado: "Si ves fuego o humo saliendo del motor de tu vehículo, debes:",
    opciones: ["Abrir el capó de inmediato y de golpe", "Detenerte, apagar el motor, salir del vehículo y alejarte; usar el extintor solo si es seguro", "Seguir conduciendo hasta un taller", "Echarle agua al tanque de gasolina"],
    correcta: 1,
    explicacion: "Detente, apaga el motor y aléjate. Abrir el capó de golpe aviva las llamas con oxígeno. Usa el extintor solo ante un conato pequeño y con seguridad." },

  { id: 72, categoria: "emergencias",
    enunciado: "Al llamar al 9-1-1 para reportar un accidente, es importante indicar:",
    opciones: ["Solo tu nombre", "La ubicación exacta, cuántos heridos hay y qué ocurrió", "Colgar rápido", "Pedir que no envíen a nadie"],
    correcta: 1,
    explicacion: "Da la ubicación lo más precisa posible, el número de heridos y qué pasó. Esa información permite enviar los recursos adecuados sin demora." }
];

/* ============================================================
   PERSISTENCIA (localStorage)
   ============================================================ */
const STORE_KEY = "apruebard_v1";

/** Estructura por defecto del progreso guardado. */
function progresoPorDefecto() {
  return { mejorPuntaje: 0, vistas: [], falladas: [] };
}

/** Lee el progreso desde localStorage con guardas ante datos corruptos. */
function leerProgreso() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return progresoPorDefecto();
    const data = JSON.parse(raw);
    return {
      mejorPuntaje: Number(data.mejorPuntaje) || 0,
      vistas: Array.isArray(data.vistas) ? data.vistas : [],
      falladas: Array.isArray(data.falladas) ? data.falladas : []
    };
  } catch (e) {
    return progresoPorDefecto();
  }
}

/** Guarda el progreso (silencioso si el navegador bloquea localStorage). */
function guardarProgreso(p) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
  catch (e) { /* modo privado / sin almacenamiento: la app sigue funcionando */ }
}

let progreso = leerProgreso();

/** Marca una pregunta como vista (sin duplicar). */
function marcarVista(id) {
  if (!progreso.vistas.includes(id)) {
    progreso.vistas.push(id);
    guardarProgreso(progreso);
  }
}

/** Agrega una pregunta al repaso de falladas. */
function agregarFallada(id) {
  if (!progreso.falladas.includes(id)) {
    progreso.falladas.push(id);
    guardarProgreso(progreso);
  }
}

/** Quita una pregunta del repaso (cuando se acierta en repaso). */
function quitarFallada(id) {
  progreso.falladas = progreso.falladas.filter(x => x !== id);
  guardarProgreso(progreso);
}

/* ============================================================
   UTILIDADES
   ============================================================ */

/** Devuelve una copia mezclada del arreglo (Fisher–Yates). */
function mezclar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Busca una pregunta por id. */
function preguntaPorId(id) { return BANCO.find(q => q.id === id); }

/** Escapa texto para insertarlo con seguridad en el HTML. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ============================================================
   NAVEGACIÓN POR PESTAÑAS (Estudio / Examen / Repaso)
   ============================================================ */
const tabs = document.querySelectorAll(".tab");
const paneles = {
  estudio: document.getElementById("panel-estudio"),
  examen: document.getElementById("panel-examen"),
  repaso: document.getElementById("panel-repaso")
};

tabs.forEach(tab => {
  tab.addEventListener("click", () => activarPestana(tab.dataset.tab));
});

function activarPestana(nombre) {
  tabs.forEach(t => {
    const activa = t.dataset.tab === nombre;
    t.classList.toggle("is-active", activa);
    t.setAttribute("aria-selected", activa ? "true" : "false");
  });
  Object.keys(paneles).forEach(k => {
    paneles[k].hidden = (k !== nombre);
  });
  if (nombre === "repaso") renderRepaso();
}

/* ============================================================
   MODO ESTUDIO
   Navega por categoría, muestra pregunta + respuesta + explicación.
   ============================================================ */
const estudio = {
  categoria: "senales",
  indice: 0,
  lista: []
};

const elCatSelect = document.getElementById("estudio-categoria");
const elEstudioSlot = document.getElementById("estudio-slot");
const elEstudioPos = document.getElementById("estudio-pos");
const btnEstudioPrev = document.getElementById("estudio-prev");
const btnEstudioNext = document.getElementById("estudio-next");

/** Rellena el selector de categorías. */
function initEstudioCategorias() {
  const frag = document.createDocumentFragment();
  Object.keys(CATEGORIAS).forEach(clave => {
    const opt = document.createElement("option");
    opt.value = clave;
    const n = BANCO.filter(q => q.categoria === clave).length;
    opt.textContent = `${CATEGORIAS[clave].emoji}  ${CATEGORIAS[clave].nombre} (${n})`;
    frag.appendChild(opt);
  });
  elCatSelect.appendChild(frag);
  elCatSelect.value = estudio.categoria;
}

function cargarCategoriaEstudio() {
  estudio.lista = BANCO.filter(q => q.categoria === estudio.categoria);
  estudio.indice = 0;
  renderEstudio();
}

function renderEstudio() {
  const q = estudio.lista[estudio.indice];
  if (!q) return;
  marcarVista(q.id);

  const opciones = q.opciones.map((op, i) => {
    const esCorrecta = i === q.correcta;
    return `<li class="study-opt ${esCorrecta ? "is-correct" : ""}">
        <span class="study-opt__mark">${esCorrecta ? "✓" : ""}</span>
        <span>${esc(op)}</span>
      </li>`;
  }).join("");

  elEstudioSlot.innerHTML = `
    <article class="qcard qcard--study enter">
      <p class="qcard__cat">${CATEGORIAS[q.categoria].emoji} ${esc(CATEGORIAS[q.categoria].nombre)}</p>
      <h3 class="qcard__q">${esc(q.enunciado)}</h3>
      <ul class="qcard__opts qcard__opts--study">${opciones}</ul>
      <div class="explica">
        <span class="explica__tag">Explicación</span>
        <p>${esc(q.explicacion)}</p>
      </div>
    </article>`;

  elEstudioPos.textContent = `Pregunta ${estudio.indice + 1} de ${estudio.lista.length}`;
  btnEstudioPrev.disabled = estudio.indice === 0;
  btnEstudioNext.disabled = estudio.indice === estudio.lista.length - 1;
}

elCatSelect.addEventListener("change", () => {
  estudio.categoria = elCatSelect.value;
  cargarCategoriaEstudio();
});
btnEstudioPrev.addEventListener("click", () => {
  if (estudio.indice > 0) { estudio.indice--; renderEstudio(); }
});
btnEstudioNext.addEventListener("click", () => {
  if (estudio.indice < estudio.lista.length - 1) { estudio.indice++; renderEstudio(); }
});

/* ============================================================
   MODO EXAMEN
   N preguntas aleatorias, temporizador, puntaje y repaso de fallos.
   ============================================================ */
const UMBRAL_APROBADO = 0.7;   // 70%
const SEGUNDOS_POR_PREGUNTA = 45;

const examen = {
  preguntas: [],
  indice: 0,
  respuestas: [],   // { id, elegida, correcta(bool) }
  bloqueado: false,
  tiempoRestante: 0,
  intervalo: null,
  activo: false
};

const elExamenConfig = document.getElementById("examen-config");
const elExamenStage = document.getElementById("examen-stage");
const elExamenResultado = document.getElementById("examen-resultado");
const elExamenSlot = document.getElementById("examen-slot");
const elExamenProgFill = document.getElementById("examen-prog-fill");
const elExamenProgText = document.getElementById("examen-prog-text");
const elExamenTimer = document.getElementById("examen-timer");
const elExamenMejor = document.getElementById("examen-mejor");
const btnExamenNext = document.getElementById("examen-next");
const selCantidad = document.getElementById("examen-cantidad");

document.getElementById("examen-start").addEventListener("click", iniciarExamen);
btnExamenNext.addEventListener("click", avanzarExamen);
document.getElementById("examen-abandonar").addEventListener("click", () => {
  detenerTimer();
  volverAConfigExamen();
});

/** Muestra el mejor puntaje guardado en la tarjeta de config. */
function pintarMejorPuntaje() {
  elExamenMejor.textContent = progreso.mejorPuntaje > 0
    ? `Tu mejor resultado: ${progreso.mejorPuntaje}%`
    : "Aún no has hecho tu primer examen.";
}

function volverAConfigExamen() {
  examen.activo = false;
  elExamenStage.hidden = true;
  elExamenResultado.hidden = true;
  elExamenConfig.hidden = false;
  pintarMejorPuntaje();
}

function iniciarExamen() {
  const cantidad = Math.min(parseInt(selCantidad.value, 10) || 20, BANCO.length);
  examen.preguntas = mezclar(BANCO).slice(0, cantidad);
  examen.indice = 0;
  examen.respuestas = [];
  examen.bloqueado = false;
  examen.activo = true;

  elExamenConfig.hidden = true;
  elExamenResultado.hidden = true;
  elExamenStage.hidden = false;

  iniciarTimer(cantidad * SEGUNDOS_POR_PREGUNTA);
  renderExamen();
}

function iniciarTimer(segundos) {
  detenerTimer();
  examen.tiempoRestante = segundos;
  pintarTimer();
  examen.intervalo = setInterval(() => {
    examen.tiempoRestante--;
    pintarTimer();
    if (examen.tiempoRestante <= 0) {
      detenerTimer();
      finalizarExamen(true);   // se acabó el tiempo
    }
  }, 1000);
}

function detenerTimer() {
  if (examen.intervalo) { clearInterval(examen.intervalo); examen.intervalo = null; }
}

function pintarTimer() {
  const m = Math.floor(examen.tiempoRestante / 60);
  const s = examen.tiempoRestante % 60;
  elExamenTimer.textContent = `${m}:${String(s).padStart(2, "0")}`;
  elExamenTimer.classList.toggle("is-low", examen.tiempoRestante <= 15);
}

function renderExamen() {
  const q = examen.preguntas[examen.indice];
  examen.bloqueado = false;
  marcarVista(q.id);

  const opciones = q.opciones.map((op, i) => `
    <button type="button" class="opt" data-i="${i}">
      <span class="opt__letra">${String.fromCharCode(65 + i)}</span>
      <span>${esc(op)}</span>
    </button>`).join("");

  elExamenSlot.innerHTML = `
    <article class="qcard enter">
      <p class="qcard__cat">${CATEGORIAS[q.categoria].emoji} ${esc(CATEGORIAS[q.categoria].nombre)}</p>
      <h3 class="qcard__q">${esc(q.enunciado)}</h3>
      <div class="qcard__opts">${opciones}</div>
      <div class="explica" id="examen-explica" hidden>
        <span class="explica__tag">Explicación</span>
        <p></p>
      </div>
    </article>`;

  elExamenSlot.querySelectorAll(".opt").forEach(btn => {
    btn.addEventListener("click", () => responderExamen(parseInt(btn.dataset.i, 10)));
  });

  const total = examen.preguntas.length;
  elExamenProgFill.style.width = `${(examen.indice / total) * 100}%`;
  elExamenProgText.textContent = `Pregunta ${examen.indice + 1} de ${total}`;
  btnExamenNext.hidden = true;
}

function responderExamen(elegida) {
  if (examen.bloqueado) return;
  examen.bloqueado = true;

  const q = examen.preguntas[examen.indice];
  const acerto = elegida === q.correcta;
  examen.respuestas.push({ id: q.id, elegida, correcta: acerto });

  if (acerto) {
    quitarFallada(q.id);   // si estaba en repaso y ahora acertó, se limpia
  } else {
    agregarFallada(q.id);
  }

  // Pinta opciones: verde la correcta, rojo la elegida si falló
  const botones = elExamenSlot.querySelectorAll(".opt");
  botones.forEach(btn => {
    const i = parseInt(btn.dataset.i, 10);
    btn.disabled = true;
    if (i === q.correcta) btn.classList.add("is-right");
    else if (i === elegida) btn.classList.add("is-wrong");
  });

  // Muestra explicación
  const exp = document.getElementById("examen-explica");
  exp.querySelector("p").textContent = q.explicacion;
  exp.hidden = false;

  // Botón siguiente / finalizar
  btnExamenNext.hidden = false;
  btnExamenNext.textContent = (examen.indice === examen.preguntas.length - 1)
    ? "Ver resultado" : "Siguiente pregunta";
}

function avanzarExamen() {
  if (examen.indice < examen.preguntas.length - 1) {
    examen.indice++;
    renderExamen();
  } else {
    detenerTimer();
    finalizarExamen(false);
  }
}

function finalizarExamen(porTiempo) {
  examen.activo = false;
  detenerTimer();

  const total = examen.preguntas.length;
  const aciertos = examen.respuestas.filter(r => r.correcta).length;
  const porcentaje = Math.round((aciertos / total) * 100);
  const aprobado = (aciertos / total) >= UMBRAL_APROBADO;

  // Guarda mejor puntaje
  if (porcentaje > progreso.mejorPuntaje) {
    progreso.mejorPuntaje = porcentaje;
    guardarProgreso(progreso);
  }

  // Preguntas falladas (incluye las no respondidas si se acabó el tiempo)
  const falladas = examen.preguntas.filter(q => {
    const r = examen.respuestas.find(x => x.id === q.id);
    return !r || !r.correcta;   // no respondida o incorrecta
  });

  elExamenStage.hidden = true;
  elExamenResultado.hidden = false;
  elExamenResultado.className = "examen-resultado " + (aprobado ? "is-pass" : "is-fail");

  const repasoHTML = falladas.length ? `
    <div class="repaso-fallos">
      <h4 class="repaso-fallos__h">Repasa lo que fallaste (${falladas.length})</h4>
      ${falladas.map(q => `
        <details class="fallo">
          <summary>${esc(q.enunciado)}</summary>
          <p class="fallo__correcta"><strong>Respuesta correcta:</strong> ${esc(q.opciones[q.correcta])}</p>
          <p class="fallo__exp">${esc(q.explicacion)}</p>
        </details>`).join("")}
    </div>` : `<p class="examen-resultado__perfecto">¡Perfecto! No fallaste ninguna pregunta. 🎉</p>`;

  elExamenResultado.innerHTML = `
    <span class="examen-resultado__badge">${aprobado ? "Aprobado" : "Reprobado"}</span>
    <div class="score">
      <span class="score__num">${porcentaje}%</span>
      <span class="score__det">${aciertos} de ${total} correctas</span>
    </div>
    <p class="examen-resultado__msg">
      ${porTiempo ? "Se acabó el tiempo. " : ""}${aprobado
        ? "¡Bien hecho! Superaste el 70% requerido. Sigue practicando para llegar seguro al examen real."
        : "Necesitas al menos 70% para aprobar. Repasa las explicaciones de abajo y vuelve a intentarlo — vas a lograrlo."}
    </p>
    ${repasoHTML}
    <div class="examen-resultado__cta">
      <button type="button" class="btn btn--primary" id="examen-otra">Hacer otro examen</button>
      <button type="button" class="btn btn--ghost" id="examen-ir-repaso">Ir a mis falladas</button>
    </div>`;

  document.getElementById("examen-otra").addEventListener("click", volverAConfigExamen);
  document.getElementById("examen-ir-repaso").addEventListener("click", () => activarPestana("repaso"));

  elExamenResultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================================
   MODO REPASO DE FALLADAS
   ============================================================ */
const repaso = {
  preguntas: [],
  indice: 0,
  bloqueado: false,
  aciertos: 0
};

const elRepasoBody = document.getElementById("repaso-body");

function renderRepaso() {
  const ids = progreso.falladas.slice();
  if (ids.length === 0) {
    elRepasoBody.innerHTML = `
      <div class="empty">
        <span class="empty__emoji">✅</span>
        <h3>No tienes preguntas pendientes</h3>
        <p>Cuando falles preguntas en un examen, aparecerán aquí para que las repases hasta dominarlas.</p>
        <button type="button" class="btn btn--ghost" id="repaso-a-examen">Hacer un examen</button>
      </div>`;
    const b = document.getElementById("repaso-a-examen");
    if (b) b.addEventListener("click", () => activarPestana("examen"));
    return;
  }

  elRepasoBody.innerHTML = `
    <div class="repaso-intro">
      <p><strong>${ids.length}</strong> pregunta(s) por dominar. Al responderlas bien, salen de tu lista.</p>
      <button type="button" class="btn btn--primary" id="repaso-start">Empezar repaso</button>
    </div>`;
  document.getElementById("repaso-start").addEventListener("click", iniciarRepaso);
}

function iniciarRepaso() {
  const preguntas = progreso.falladas.map(preguntaPorId).filter(Boolean);
  if (!preguntas.length) { renderRepaso(); return; }
  repaso.preguntas = mezclar(preguntas);
  repaso.indice = 0;
  repaso.bloqueado = false;
  repaso.aciertos = 0;
  renderRepasoPregunta();
}

function renderRepasoPregunta() {
  const q = repaso.preguntas[repaso.indice];
  repaso.bloqueado = false;

  const opciones = q.opciones.map((op, i) => `
    <button type="button" class="opt" data-i="${i}">
      <span class="opt__letra">${String.fromCharCode(65 + i)}</span>
      <span>${esc(op)}</span>
    </button>`).join("");

  elRepasoBody.innerHTML = `
    <div class="progress">
      <div class="progress__bar"><span style="width:${(repaso.indice / repaso.preguntas.length) * 100}%"></span></div>
      <span class="progress__text">Repaso ${repaso.indice + 1} de ${repaso.preguntas.length}</span>
    </div>
    <article class="qcard enter">
      <p class="qcard__cat">${CATEGORIAS[q.categoria].emoji} ${esc(CATEGORIAS[q.categoria].nombre)}</p>
      <h3 class="qcard__q">${esc(q.enunciado)}</h3>
      <div class="qcard__opts" id="repaso-opts">${opciones}</div>
      <div class="explica" id="repaso-explica" hidden>
        <span class="explica__tag">Explicación</span>
        <p></p>
      </div>
      <button type="button" class="btn btn--primary" id="repaso-next" hidden>Siguiente</button>
    </article>`;

  document.querySelectorAll("#repaso-opts .opt").forEach(btn => {
    btn.addEventListener("click", () => responderRepaso(parseInt(btn.dataset.i, 10)));
  });
}

function responderRepaso(elegida) {
  if (repaso.bloqueado) return;
  repaso.bloqueado = true;

  const q = repaso.preguntas[repaso.indice];
  const acerto = elegida === q.correcta;
  if (acerto) { repaso.aciertos++; quitarFallada(q.id); }

  document.querySelectorAll("#repaso-opts .opt").forEach(btn => {
    const i = parseInt(btn.dataset.i, 10);
    btn.disabled = true;
    if (i === q.correcta) btn.classList.add("is-right");
    else if (i === elegida) btn.classList.add("is-wrong");
  });

  const exp = document.getElementById("repaso-explica");
  exp.querySelector("p").textContent = q.explicacion;
  exp.hidden = false;

  const next = document.getElementById("repaso-next");
  next.hidden = false;
  next.textContent = (repaso.indice === repaso.preguntas.length - 1) ? "Terminar repaso" : "Siguiente";
  next.addEventListener("click", avanzarRepaso, { once: true });
}

function avanzarRepaso() {
  if (repaso.indice < repaso.preguntas.length - 1) {
    repaso.indice++;
    renderRepasoPregunta();
  } else {
    elRepasoBody.innerHTML = `
      <div class="empty">
        <span class="empty__emoji">🏁</span>
        <h3>Repaso terminado</h3>
        <p>Acertaste ${repaso.aciertos} de ${repaso.preguntas.length}. Las que acertaste salieron de tu lista.</p>
        <button type="button" class="btn btn--primary" id="repaso-otra">Seguir repasando</button>
      </div>`;
    document.getElementById("repaso-otra").addEventListener("click", renderRepaso);
  }
}

/* ============================================================
   CONTADOR DEL HERO (cantidad de preguntas)
   ============================================================ */
function pintarContadores() {
  const elTotal = document.getElementById("stat-total");
  const elCats = document.getElementById("stat-cats");
  if (elTotal) elTotal.textContent = BANCO.length;
  if (elCats) elCats.textContent = Object.keys(CATEGORIAS).length;
}

/* ============================================================
   AÑO DEL FOOTER
   ============================================================ */
function pintarAnio() {
  const el = document.getElementById("anio");
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   SERVICE WORKER (offline) — con guardas
   ============================================================ */
function registrarSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* Si falla el registro (p. ej. abierto con file://), la app sigue funcionando online. */
      });
    });
  }
}

/* ============================================================
   ARRANQUE
   ============================================================ */
function init() {
  initEstudioCategorias();
  cargarCategoriaEstudio();
  pintarMejorPuntaje();
  pintarContadores();
  pintarAnio();
  activarPestana("estudio");
  registrarSW();
}

document.addEventListener("DOMContentLoaded", init);
