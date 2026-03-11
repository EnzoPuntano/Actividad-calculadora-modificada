let displayValue = '0'; 
const display = document.getElementById('display'); 

// Configuración de la API de voz
let utterance = new SpeechSynthesisUtterance();
utterance.lang = 'es-AR'; 
utterance.rate = 0.9;    
utterance.pitch = 1;     


// Función que se llama cuando se presiona un número o un operador
function press(key) {
    // Hace que al iniciar muestre "0"
    if (displayValue === '0' && (key >= '0' && key <= '9')) {
        displayValue = key; // Reemplaza '0' con el nuevo número
    } else if (displayValue === '0' && key === '.') {
        displayValue = '0.'; // Si se presiona '.' al principio, muestra '0.'
    }
    // Evita agregar múltiples puntos decimales en el mismo número
    else if (key === '.' && displayValue.includes('.')) {
        // No hace nada si ya hay un punto en el número actual (simple manejo)
    }
    else {
        displayValue += key; // Agrega la tecla al valor actual de la pantalla
    }
    display.value = displayValue; // Actualiza el valor mostrado en la pantalla

}

function clearDisplay() {
    displayValue = '0'; // Reinicia el valor de la pantalla a '0'
    display.value = '0'; // Actualiza el valor mostrado en la pantalla
    
}


function calculate() {
    try {
        
        const result = eval(displayValue);
        displayValue = result.toString(); 
        display.value = displayValue; // Muestra el resultado en la pantalla
        
        

    } catch (error) {
       
        display.value = 'Math error'; 
        displayValue = '0'; 
        setTimeout(() => {
            display.value = '0'; 
        }, 1500);
    }
}

function confetti() {
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '0';
        confetti.style.zIndex = '5';
        document.body.appendChild(confetti);

        // Animación de caída para cada confeti
        let startTime = null;
        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const top = Math.min(window.innerHeight, elapsed / 10);
            confetti.style.top = top + 'px';
            confetti.style.transform = 'rotate(' + elapsed / 10 + 'deg)';
            if (top < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(confetti); // Elimina el confeti cuando sale de la pantalla
            }
        }
        requestAnimationFrame(animate);
    }
}

// Asegura que el display se inicialice a '0' cuando la página carga
window.onload = function() {
    display.value = displayValue;
};

// Captura la tecla
document.addEventListener('keydown', function(event) {
const tecla = event.key;

// Si es un número (0-9)
if (tecla >= '0' && tecla <= '9') {
document.getElementById('display').value += tecla;
}
// Si es un operador
if (['+', '-', '*', '/'].includes(tecla)) {
document.getElementById('display').value += ' ' + tecla + ' ';
}
// Si es Enter o = para calcular
if (tecla === 'Enter' || tecla === '=') {
// Ejemplo funcional: eval(document.getElementById('display').value)
document.getElementById('display').value = eval(document.getElementById('display').value);
}
// Si es Borrar (Backspace)
if (tecla === 'Backspace') {
let valor = document.getElementById('display').value;
document.getElementById('display').value = valor.slice(0, -1);
}
// Si es ESC para limpiar todo
if (tecla === 'Escape') {
document.getElementById('display').value = '';
}
});