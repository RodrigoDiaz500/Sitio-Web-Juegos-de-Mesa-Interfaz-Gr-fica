document.addEventListener('DOMContentLoaded', function() {
    // Cuando el DOM (Document Object Model) esté completamente cargado y parseado, ejecuta esta función.
    // Esto asegura que todos los elementos HTML estén disponibles antes de que el script intente interactuar con ellos.

    // --- Referencias a elementos del DOM ---
    // Obtenemos referencias a los elementos HTML por su ID.
    const registroForm = document.getElementById('registroForm'); // El formulario de registro completo
    const fullNameInput = document.getElementById('fullName'); // Campo de entrada para el nombre completo
    const usernameInput = document.getElementById('username'); // Campo de entrada para el nombre de usuario
    const emailInput = document.getElementById('email'); // Campo de entrada para el correo electrónico
    const passwordInput = document.getElementById('password'); // Campo de entrada para la contraseña
    const confirmPasswordInput = document.getElementById('confirmPassword'); // Campo de entrada para confirmar la contraseña
    const dobInput = document.getElementById('dob'); // Campo de entrada para la fecha de nacimiento (DOB - Date of Birth)
    const addressInput = document.getElementById('address'); // Campo de entrada para la dirección (opcional)
    const togglePasswordButtons = document.querySelectorAll('.toggle-password'); // Todos los botones "ojo" para mostrar/ocultar contraseña
    const mainFooter = document.getElementById('main-footer'); // El elemento footer principal
    const formMessage = document.getElementById('form-message'); // Elemento para mostrar mensajes generales al usuario (éxito/error)

    // --- Configuración inicial del formulario para Bootstrap ---
    // Asegura que la validación nativa de HTML5 no interfiera con la de Bootstrap/JavaScript.
    registroForm.setAttribute('novalidate', ''); // Deshabilita la validación por defecto del navegador
    registroForm.classList.add('needs-validation'); // Añade la clase de Bootstrap para estilos de validación

    // --- Funciones ---

    /**
     * Actualiza el color de fondo del footer.
     * @param {boolean} isValid - true si el formulario es válido, false si es inválido.
     */
    function updateFooterColor(isValid) {
        if (mainFooter) { // Verifica que el footer exista
            if (isValid) {
                mainFooter.style.backgroundColor = '#27ae60'; // Verde para indicar éxito
            } else {
                mainFooter.style.backgroundColor = '#e74c3c'; // Rojo para indicar error
            }
        }
    }

    /**
     * Restablece el color de fondo del footer a su valor por defecto (definido en CSS).
     */
    function resetFooterColor() {
        if (mainFooter) { // Verifica que el footer exista
            mainFooter.style.backgroundColor = ''; // Elimina el estilo inline para que aplique el CSS por defecto
        }
    }

    /**
     * Busca y devuelve el elemento de feedback (invalid-feedback o valid-feedback) asociado a un input.
     * @param {HTMLElement} inputElement - El elemento input al que se busca el feedback.
     * @returns {HTMLElement|null} El elemento de feedback encontrado o null si no se encuentra.
     */
    function getFeedbackElement(inputElement) {
        if (inputElement.id === 'password' && document.getElementById('passwordFeedback')) {
            return document.getElementById('passwordFeedback');
        }
        if (inputElement.id === 'confirmPassword' && document.getElementById('confirmPasswordFeedback')) {
            return document.getElementById('confirmPasswordFeedback');
        }
        if (inputElement.id === 'dob' && document.getElementById('dobFeedback')) {
            return document.getElementById('dobFeedback');
        }


        let currentSibling = inputElement.nextElementSibling;
        while (currentSibling) {
            if (currentSibling.classList.contains('invalid-feedback') || currentSibling.classList.contains('valid-feedback')) {
                return currentSibling;
            }
            currentSibling = currentSibling.nextElementSibling; 
        }

    
        if (inputElement.parentElement && inputElement.parentElement.classList.contains('input-group')) {
            let parentSibling = inputElement.parentElement.nextElementSibling;
            while (parentSibling) {
                if (parentSibling.classList.contains('invalid-feedback') || parentSibling.classList.contains('valid-feedback')) {
                    return parentSibling;
                }
                parentSibling = parentSibling.nextElementSibling;
            }
        }


        if (inputElement.parentElement) {
            const directChildFeedback = inputElement.parentElement.querySelector('.invalid-feedback, .valid-feedback');
            if (directChildFeedback) return directChildFeedback;
        }


        return null; 
    }

    /**
     * Muestra u oculta los mensajes de feedback de validación de Bootstrap y actualiza las clases del input.
     * @param {HTMLElement} input - El elemento input al que se aplica el feedback.
     * @param {string} message - El mensaje a mostrar (vacío para feedback válido).
     * @param {boolean} isValid - true para feedback válido (verde), false para feedback inválido (rojo).
     */
    function showFeedback(input, message, isValid) {
        const feedbackElement = getFeedbackElement(input); // Obtiene el elemento de feedback

        // Elimina clases de validación previas del input
        input.classList.remove('is-valid', 'is-invalid');

        if (feedbackElement) {
            // Limpia clases de feedback previas del elemento de feedback
            feedbackElement.classList.remove('d-block', 'valid-feedback', 'invalid-feedback');

            if (!isValid) {
                feedbackElement.textContent = message; // Establece el mensaje de error
                feedbackElement.classList.add('d-block', 'invalid-feedback'); // Muestra y marca como inválido
                input.classList.add('is-invalid'); // Marca el input como inválido
            } else {
                feedbackElement.textContent = ''; // Limpia el mensaje si es válido
                feedbackElement.classList.add('valid-feedback'); // Marca como válido 
                input.classList.add('is-valid'); // Marca el input como válido
            }
        }
    }

    // --- Funciones de Validación Específicas para cada Campo ---

    /**
     * Valida el campo "Nombre Completo".
     * @returns {boolean} true si es válido, false en caso contrario.
     */
    function validateFullName() {
        const fullName = fullNameInput.value.trim(); // Obtiene el valor y elimina espacios en blanco
        if (fullName === '') {
            showFeedback(fullNameInput, 'El campo Nombre Completo es obligatorio.', false);
            return false;
        } else {
            showFeedback(fullNameInput, '', true); // No se muestra mensaje para válido, solo el borde verde
            return true;
        }
    }

    /**
     * Valida el campo "Nombre de Usuario".
     * @returns {boolean} true si es válido, false en caso contrario.
     */
    function validateUsername() {
        const username = usernameInput.value.trim();
        if (username.length >= 4 && username.length <= 20) {
            showFeedback(usernameInput, '', true);
            return true;
        } else {
            showFeedback(usernameInput, 'El campo Nombre de Usuario es obligatorio y debe tener entre 4 y 20 caracteres.', false);
            return false;
        }
    }

    /**
     * Valida el campo "Correo Electrónico".
     * @returns {boolean} true si es válido, false en caso contrario.
     */
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar formato de email
        if (emailRegex.test(emailInput.value.trim())) {
            showFeedback(emailInput, '', true);
            return true;
        } else {
            showFeedback(emailInput, 'Por favor, introduce un correo electrónico válido.', false);
            return false;
        }
    }

    /**
     * Valida el campo "Contraseña".
     * @returns {boolean} true si es válido, false en caso contrario.
     */
    function validatePassword() {
        // Mínimo 6 caracteres, máximo 18, al menos un número y una letra mayúscula
        const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,18}$/;
        if (passwordRegex.test(passwordInput.value)) {
            showFeedback(passwordInput, '', true);
            return true;
        } else {
            showFeedback(passwordInput, 'La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una mayúscula.', false);
            return false;
        }
    }

    /**
     * Valida el campo "Confirmar Contraseña".
     * @returns {boolean} true si es válido, false en caso contrario.
     */
    function validateConfirmPassword() {
        // Valida solo si las contraseñas coinciden y el campo de confirmación no está vacío.
        if (confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value !== '') {
            showFeedback(confirmPasswordInput, '', true);
            return true;
        } else {
            showFeedback(confirmPasswordInput, 'Las contraseñas no coinciden.', false);
            return false;
        }
    }

    /**
     * Valida el campo "Fecha de Nacimiento" (DOB).
     * @returns {boolean} true si es válido (al menos 13 años y fecha válida), false en caso contrario.
     */
    function validateDob() {
        const dobValue = dobInput.value;
        if (!dobValue) { // Si el campo está vacío
            showFeedback(dobInput, 'Por favor, introduce una fecha de nacimiento válida.', false);
            return false;
        }

        const dob = new Date(dobValue); // Convierte la fecha de entrada a objeto Date
        const today = new Date(); // Fecha actual
        let age = today.getFullYear() - dob.getFullYear(); // Calcula la edad en años
        const m = today.getMonth() - dob.getMonth(); // Diferencia de meses
        // Ajusta la edad si el cumpleaños aún no ha pasado este año
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age >= 13) { // Verifica si tiene al menos 13 años
            showFeedback(dobInput, '', true);
            return true;
        } else {
            showFeedback(dobInput, 'Debes tener al menos 13 años para registrarte.', false);
            return false;
        }
    }

    // --- Event Listeners para Validación en Tiempo Real ---

    // Añade un listener para cada campo de entrada que valide al escribir o cambiar el valor.
    fullNameInput.addEventListener('input', validateFullName);
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    dobInput.addEventListener('change', validateDob); // Usa 'change' para fecha de nacimiento, ya que es un campo de tipo date

    // Lógica de validación para contraseña y confirmar contraseña:
    // Al escribir en contraseña, valida este campo y revalida confirmar contraseña si ya tiene un valor.
    passwordInput.addEventListener('input', function() {
        validatePassword(); // Valida la contraseña actual
        if (confirmPasswordInput.value !== '') {  // Si ya hay un valor en confirmar contraseña
            validateConfirmPassword(); // Revalida la confirmación de contraseña
        }
    });

    // Al escribir en confirmar contraseña, siempre valida este campo.
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);


    // --- Funcionalidad del Ojo para Mostrar/Ocultar Contraseña ---
    // Itera sobre todos los botones con la clase 'toggle-password'.
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target; // Obtiene el ID del input asociado desde el atributo data-target
            const targetInput = document.getElementById(targetId); // Obtiene el input de contraseña
            const icon = this.querySelector('i'); 

            if (targetInput.type === 'password') {
                targetInput.type = 'text'; // Cambia el tipo a texto para mostrar la contraseña
                icon.classList.remove('fa-eye'); // Cambia el ícono de ojo abierto
                icon.classList.add('fa-eye-slash'); // al ícono de ojo tachado
            } else {
                targetInput.type = 'password'; // Cambia el tipo a password para ocultar la contraseña
                icon.classList.remove('fa-eye-slash'); // Cambia el ícono de ojo tachado
                icon.classList.add('fa-eye'); // al ícono de ojo abierto
            }
        });
    });

    // --- Manejo del Envío del Formulario ---
    registroForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío por defecto del formulario (y recarga de la página)

        // Ejecuta todas las funciones de validación para obtener el estado final de cada campo.
        const isFullNameValid = validateFullName();
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isDobValid = validateDob();

        // Verifica si todos los campos requeridos son válidos.
        const allFieldsValid = isFullNameValid && isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isDobValid;

        if (allFieldsValid) {
            // Si todos los campos son válidos:
            registroForm.classList.add('was-validated'); // Añade la clase de Bootstrap para mostrar validación
            formMessage.textContent = '¡Registro exitoso! Tus datos han sido enviados.'; // Muestra mensaje de éxito
            formMessage.classList.remove('text-danger'); // Elimina clase de error
            formMessage.classList.add('text-success'); // Añade clase de éxito (color verde)
            updateFooterColor(true); // Cambia el color del footer a verde
            //

            // Limpia el formulario y restablece la visualización de validación después de un envío exitoso.
            setTimeout(() => { // Usa setTimeout para dar tiempo a que el usuario vea el mensaje de éxito
                registroForm.reset(); // Restablece todos los campos del formulario
                registroForm.classList.remove('was-validated'); // Elimina la clase de Bootstrap para limpiar el estado de validación
                // Itera sobre todos los inputs para quitar manualmente las clases de validación y los mensajes.
                document.querySelectorAll('.form-control, .form-check-input').forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                    const feedback = getFeedbackElement(input);
                    if (feedback) {
                        feedback.classList.remove('d-block', 'valid-feedback', 'invalid-feedback');
                        feedback.textContent = ''; // Limpia el texto del mensaje de feedback
                    }
                });
                formMessage.textContent = ''; // Limpia el mensaje de éxito/error general
                formMessage.classList.remove('text-success', 'text-danger'); // Elimina las clases de color
                resetFooterColor(); // Restablece el color del footer a su estado original
            }, 1500); // Espera 1.5 segundos antes de resetear
        } else {
            // Si alguna validación falla:
            registroForm.classList.add('was-validated'); // Añade esta clase para que Bootstrap muestre los mensajes de error
            formMessage.textContent = 'Por favor, llena la información solicitada correctamente.'; // Muestra mensaje de error general
            formMessage.classList.remove('text-success'); // Elimina clase de éxito
            formMessage.classList.add('text-danger'); // Añade clase de error (color rojo)
            updateFooterColor(false); // Cambia el color del footer a rojo
        }
    });

    // --- Manejo del Botón de Reinicio (Reset) del Formulario ---
    registroForm.addEventListener('reset', function() {
        setTimeout(() => { // Usa un pequeño retraso para permitir que el navegador realice su reset primero
            // Limpia manualmente las clases de validación y los mensajes de feedback.
            document.querySelectorAll('.form-control, .form-check-input').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
                const feedback = getFeedbackElement(input);
                if (feedback) {
                    feedback.classList.remove('d-block', 'valid-feedback', 'invalid-feedback');
                    feedback.textContent = '';
                }
            });
            registroForm.classList.remove('was-validated'); // Elimina la clase para limpiar la visualización de validación
            formMessage.textContent = ''; // Limpia cualquier mensaje general
            formMessage.classList.remove('text-success', 'text-danger'); // Elimina las clases de color
            resetFooterColor(); // Restablece el color del footer
        }, 0); // Un timeout de 0ms simplemente mueve la ejecución al final de la cola de eventos
    });

    // --- Manipulación Dinámica de CSS y HTML ---

    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) { 
            mainFooter.style.backgroundColor = '#4A90E2'; 
            mainFooter.style.transition = 'background-color 0.5s ease-in-out'; 
        } else {
            
            mainFooter.style.backgroundColor = 'var(--color-secundario)'; 
        }
    });

    
    const siteBranding = document.querySelector('.site-branding'); 
    
    if (siteBranding && !document.getElementById('header-welcome-message')) {
        const welcomeMessageElement = document.createElement('p'); 
        welcomeMessageElement.id = 'header-welcome-message'; 
        welcomeMessageElement.style.color = '#e0f2f7'; 
        welcomeMessageElement.style.fontSize = '1.1em'; 
        welcomeMessageElement.style.marginTop = '10px'; 
        welcomeMessageElement.textContent = '¡Bienvenido a nuestra tienda de juegos!'; 
        siteBranding.appendChild(welcomeMessageElement); 
    }

    resetFooterColor();
});