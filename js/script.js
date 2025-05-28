document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    // Asegúrate de que el formulario existe antes de añadir el event listener
    if (form) {
        form.addEventListener('submit', function(event) {
            // Previene el envío por defecto para la validación manual
            event.preventDefault();

            // Ejecuta la validación principal
            const formIsValid = validarFormulario(form); // Guarda el resultado de la validación

            if (formIsValid) {
                // Si el formulario es válido, puedes hacer algo aquí, como enviar datos
                alert('¡Formulario enviado con éxito!');
                form.reset(); // Limpia el formulario
                // Remover clases de validación después de limpiar un formulario exitoso
                form.querySelectorAll('.form-control, .form-select').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                });
                form.classList.remove('was-validated'); // IMPORTANTE: Remover la clase para futuras interacciones
            } else {
                // Si la validación falla, Bootstrap mostrará los mensajes de error
                console.log('Formulario no válido. Revise los errores.');
            }

            // === LA SOLUCIÓN CLAVE PARA BOOTSTRAP ===
            // Añade la clase 'was-validated' al formulario. Esto le dice a Bootstrap que
            // muestre los mensajes de feedback basados en las clases 'is-invalid' o 'is-valid'.
            // Esta línea debe ejecutarse SIEMPRE que se intente enviar el formulario,
            // ya sea válido o no, para que el feedback se muestre.
            form.classList.add('was-validated');
        });

        // Eventos para validación en tiempo real (al escribir o cambiar)
        document.getElementById('nombreCompleto').addEventListener('input', () => validarCampo(document.getElementById('nombreCompleto')));
        document.getElementById('nombreUsuario').addEventListener('input', () => validarCampo(document.getElementById('nombreUsuario')));
        document.getElementById('email').addEventListener('input', validarEmail);

        // Eventos para los campos de Contraseña (input y blur para validación en tiempo real)
        document.getElementById('password').addEventListener('input', validarPassword);
        document.getElementById('password').addEventListener('blur', validarPassword);
        document.getElementById('confirmPassword').addEventListener('input', validarPasswordConfirmacion);
        document.getElementById('confirmPassword').addEventListener('blur', validarPasswordConfirmacion);

        // Eventos para Fecha de Nacimiento
        document.getElementById('fechaNacimiento').addEventListener('change', validarFechaNacimiento);
        document.getElementById('fechaNacimiento').addEventListener('blur', validarFechaNacimiento);

        // Agregando validación inmediata al cargar el DOM para los campos requeridos
        // y para mostrar el estado inicial si ya hay valores (útil para campos de fecha por ejemplo)
        form.querySelectorAll('[required]').forEach(input => {
            input.addEventListener('blur', () => validarCampo(input)); // Valida al perder el foco
        });
    }


    // Ejemplo de manipulación del DOM y CSS con JavaScript (existente)
    const footer = document.querySelector('footer');
    if (footer) {
        footer.classList.add('footer-dynamic-color');
    }

    const mainHeaderH1 = document.querySelector('header h1');
    // Asegurarse de que esta manipulación solo ocurra en la página de inicio si es deseado
    if (mainHeaderH1 && window.location.pathname.endsWith('index.html')) {
        const originalText = mainHeaderH1.textContent;
        mainHeaderH1.addEventListener('mouseover', function() {
            mainHeaderH1.textContent = "¡Explora nuestros juegos!";
            mainHeaderH1.style.color = 'yellow';
        });
        mainHeaderH1.addEventListener('mouseout', function() {
            mainHeaderH1.textContent = originalText;
            mainHeaderH1.style.color = 'white';
        });
    }
});

// --- FUNCIONES DE AYUDA PARA ENCONTRAR EL FEEDBACK ---
/**
 * Encuentra el elemento de feedback (invalid-feedback o valid-feedback) asociado a un input.
 * Se busca entre los hermanos del input, o hijos del padre del input.
 * Esto es robusto para casos donde hay iconos u otros elementos entre el input y el feedback.
 * @param {HTMLElement} inputElement El elemento input cuyo feedback se quiere encontrar.
 * @returns {HTMLElement|null} El elemento de feedback encontrado o null si no se encuentra.
 */
function getFeedbackElement(inputElement) {
    // Primero, intenta encontrarlo como un hermano posterior al input
    let currentSibling = inputElement.nextElementSibling;
    while (currentSibling) {
        if (currentSibling.classList.contains('invalid-feedback') || currentSibling.classList.contains('valid-feedback')) {
            return currentSibling;
        }
        currentSibling = currentSibling.nextElementSibling;
    }

    // Si no se encontró como hermano posterior, intenta buscarlo dentro del mismo contenedor padre
    // (Útil si el feedback es el primer hijo o está en otro lugar dentro del contenedor del input)
    if (inputElement.parentElement) {
        const feedback = inputElement.parentElement.querySelector('.invalid-feedback, .valid-feedback');
        if (feedback) return feedback;
    }

    return null; // No se encontró ningún elemento de feedback
}

// --- Funciones de Ayuda para las Validaciones y Feedback ---

// Función genérica para campos no vacíos (o para validar al blur/input)
function validarCampo(elemento) {
    // Estas funciones ya tienen su propia lógica de validación, no las re-valides aquí.
    if (elemento.id === 'password' || elemento.id === 'confirmPassword' || elemento.id === 'email' || elemento.id === 'fechaNacimiento') {
        return;
    }

    if (elemento.value.trim() === '') {
        // Solo si es un campo obligatorio
        if (elemento.hasAttribute('required')) {
            // Si el mensaje predeterminado del HTML es suficiente, no necesitas pasarlo aquí.
            mostrarError(elemento, 'Este campo es obligatorio.');
        } else {
            elemento.classList.remove('is-invalid', 'is-valid'); // Limpiar si es opcional y está vacío
        }
    } else {
        mostrarValido(elemento);
    }
}

// === FUNCIONES MODIFICADAS PARA USAR getFeedbackElement ===
function mostrarError(elemento, mensaje) {
    elemento.classList.remove('is-valid');
    elemento.classList.add('is-invalid');
    const feedbackDiv = getFeedbackElement(elemento); // <--- USANDO LA NUEVA FUNCIÓN
    if (feedbackDiv) {
        feedbackDiv.textContent = mensaje;
    }
}

function mostrarValido(elemento) {
    elemento.classList.remove('is-invalid');
    elemento.classList.add('is-valid');
    const feedbackDiv = getFeedbackElement(elemento); // <--- USANDO LA NUEVA FUNCIÓN
    if (feedbackDiv) {
        feedbackDiv.textContent = ''; // Limpia el mensaje si es válido
    }
}
// === FIN DE FUNCIONES MODIFICADAS ===


function validarEmailFormato(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarPasswordComplejidad(password) {
    const longitudValida = password.length >= 6 && password.length <= 18;
    const tieneNumero = /[0-9]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    return longitudValida && tieneNumero && tieneMayuscula;
}

function validarEdadMinima(fechaNacimientoStr, edadMinima) {
    const fechaNacimiento = new Date(fechaNacimientoStr);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad >= edadMinima;
}

// Funciones de validación específicas para el evento 'input' (validación en tiempo real)
function validarEmail() {
    const email = document.getElementById('email');
    if (email.value.trim() === '') {
        mostrarError(email, 'El correo electrónico es obligatorio.');
    } else if (!validarEmailFormato(email.value)) {
        mostrarError(email, 'Por favor, introduce un correo electrónico válido.');
    } else {
        mostrarValido(email);
    }
}

function validarPassword() {
    const password = document.getElementById('password');
    if (password.value.trim() === '') {
        mostrarError(password, 'La contraseña es obligatoria.');
    } else if (!validarPasswordComplejidad(password.value)) {
        mostrarError(password, 'La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una mayúscula.');
    } else {
        mostrarValido(password);
    }
    // Re-validar la confirmación si la contraseña principal cambia
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword && confirmPassword.value.trim() !== '') {
        validarPasswordConfirmacion();
    }
}

// === FUNCIÓN validarPasswordConfirmacion REFINADA ===
function validarPasswordConfirmacion() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (confirmPassword.value.trim() === '') {
        mostrarError(confirmPassword, 'Debes confirmar la contraseña.');
    } else if (password.value !== confirmPassword.value) {
        mostrarError(confirmPassword, 'Las contraseñas no coinciden.');
    } else {
        mostrarValido(confirmPassword);
    }
}
// === FIN DE FUNCIÓN REFINADA ===

function validarFechaNacimiento() {
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    if (fechaNacimiento.value === '') {
        mostrarError(fechaNacimiento, 'La fecha de nacimiento es obligatoria.');
    } else if (!validarEdadMinima(fechaNacimiento.value, 13)) {
        mostrarError(fechaNacimiento, 'Debes tener al menos 13 años para registrarte.');
    } else {
        mostrarValido(fechaNacimiento);
    }
}

// --- Función principal de validación del formulario ---
// Esta función permanece igual que tu versión anterior, que funciona correctamente
// para el proceso de validación en el momento del submit.
function validarFormulario(form) {
    let isValid = true;

    // Remover clases de validación previas para revalidar todo en el submit
    form.querySelectorAll('.form-control, .form-select').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
    });

    // 1. Validar Nombre Completo
    const nombreCompleto = document.getElementById('nombreCompleto');
    if (nombreCompleto.value.trim() === '') {
        mostrarError(nombreCompleto, 'El nombre completo es obligatorio.');
        isValid = false;
    } else {
        mostrarValido(nombreCompleto);
    }

    // 2. Validar Nombre de Usuario
    const nombreUsuario = document.getElementById('nombreUsuario');
    if (nombreUsuario.value.trim() === '') {
        mostrarError(nombreUsuario, 'El nombre de usuario es obligatorio.');
        isValid = false;
    } else {
        mostrarValido(nombreUsuario);
    }

    // 3. Validar Correo Electrónico
    const email = document.getElementById('email');
    if (email.value.trim() === '') {
        mostrarError(email, 'El correo electrónico es obligatorio.');
        isValid = false;
    } else if (!validarEmailFormato(email.value)) {
        mostrarError(email, 'Por favor, introduce un correo electrónico válido.');
        isValid = false;
    } else {
        mostrarValido(email);
    }

    // 4. Validar Contraseñas
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    let passwordValidoComplejidad = true; // Variable para controlar la validación de la complejidad de la contraseña
    if (password.value.trim() === '') {
        mostrarError(password, 'La contraseña es obligatoria.');
        passwordValidoComplejidad = false;
        isValid = false;
    } else if (!validarPasswordComplejidad(password.value)) {
        mostrarError(password, 'La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una mayúscula.');
        passwordValidoComplejidad = false;
        isValid = false;
    } else {
        mostrarValido(password);
    }

    if (confirmPassword.value.trim() === '') {
        mostrarError(confirmPassword, 'Debes confirmar la contraseña.');
        isValid = false;
    } else if (passwordValidoComplejidad && password.value !== confirmPassword.value) {
        mostrarError(confirmPassword, 'Las contraseñas no coinciden.');
        isValid = false;
    } else if (passwordValidoComplejidad) { // Si la primera es válida y coinciden
        mostrarValido(confirmPassword);
    } else {
        // Si la contraseña principal NO es válida por complejidad, la confirmación tampoco debería serlo visualmente
        confirmPassword.classList.remove('is-valid');
    }

    // 5. Validar Fecha de Nacimiento
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    if (fechaNacimiento.value === '') {
        mostrarError(fechaNacimiento, 'La fecha de nacimiento es obligatoria.');
        isValid = false;
    } else if (!validarEdadMinima(fechaNacimiento.value, 13)) {
        mostrarError(fechaNacimiento, 'Debes tener al menos 13 años para registrarte.');
        isValid = false;
    } else {
        mostrarValido(fechaNacimiento);
    }

    // La dirección de despacho es opcional, no necesita validación de vacío
    const direccion = document.getElementById('direccion');
    if (direccion.value.trim() !== '') {
        mostrarValido(direccion);
    } else {
        direccion.classList.remove('is-valid', 'is-invalid');
    }

    // Desplaza la vista al primer error si lo hay
    if (!isValid) {
        const firstInvalidField = form.querySelector('.is-invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}
