document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registroForm');
    const fullNameInput = document.getElementById('fullName'); // Added
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const dobInput = document.getElementById('dob');
    const addressInput = document.getElementById('address'); // Added for optional check
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const mainFooter = document.getElementById('main-footer');
    const formMessage = document.getElementById('form-message'); // Element for general messages

    // Ensure Bootstrap validation is not overriden by native HTML5 validation
    registroForm.setAttribute('novalidate', '');
    registroForm.classList.add('needs-validation');

    // Function to update footer color based on form validity
    function updateFooterColor(isValid) {
        if (mainFooter) {
            if (isValid) {
                mainFooter.style.backgroundColor = '#27ae60'; // Green for valid
            } else {
                mainFooter.style.backgroundColor = '#e74c3c'; // Red for invalid
            }
        }
    }

    // Function to reset footer color to default (from CSS)
    function resetFooterColor() {
        if (mainFooter) {
            mainFooter.style.backgroundColor = ''; // Revert to CSS default
        }
    }

    // Helper function to get the feedback element (invalid-feedback/valid-feedback)
    function getFeedbackElement(inputElement) {
        // Specific feedback IDs for password fields
        if (inputElement.id === 'password' && document.getElementById('passwordFeedback')) {
            return document.getElementById('passwordFeedback');
        }
        if (inputElement.id === 'confirmPassword' && document.getElementById('confirmPasswordFeedback')) {
            return document.getElementById('confirmPasswordFeedback');
        }
        if (inputElement.id === 'dob' && document.getElementById('dobFeedback')) { // Added for DOB
            return document.getElementById('dobFeedback');
        }

        // Try to find the next sibling with feedback classes
        let currentSibling = inputElement.nextElementSibling;
        while (currentSibling) {
            if (currentSibling.classList.contains('invalid-feedback') || currentSibling.classList.contains('valid-feedback')) {
                return currentSibling;
            }
            currentSibling = currentSibling.nextElementSibling;
        }

        // If input is wrapped in a container (like .input-group), feedback might be sibling of the parent
        if (inputElement.parentElement && inputElement.parentElement.classList.contains('input-group')) {
            let parentSibling = inputElement.parentElement.nextElementSibling;
            while (parentSibling) {
                if (parentSibling.classList.contains('invalid-feedback') || parentSibling.classList.contains('valid-feedback')) {
                    return parentSibling;
                }
                parentSibling = parentSibling.nextElementSibling;
            }
        }

        // As a last resort, check within the immediate parent (useful for checkboxes/radios)
        if (inputElement.parentElement) {
            const directChildFeedback = inputElement.parentElement.querySelector('.invalid-feedback, .valid-feedback');
            if (directChildFeedback) return directChildFeedback;
        }

        return null;
    }

    // Function to show/hide Bootstrap feedback messages
    function showFeedback(input, message, isValid) {
        const feedbackElement = getFeedbackElement(input);
        if (feedbackElement) {
            // Remove previous feedback classes
            feedbackElement.classList.remove('d-block');
            input.classList.remove('is-valid', 'is-invalid');

            if (!isValid) {
                feedbackElement.textContent = message;
                feedbackElement.classList.add('d-block');
                feedbackElement.classList.remove('valid-feedback');
                feedbackElement.classList.add('invalid-feedback');
                input.classList.add('is-invalid');
            } else {
                feedbackElement.textContent = ''; // Clear message if valid
                feedbackElement.classList.remove('invalid-feedback');
                feedbackElement.classList.add('valid-feedback');
                input.classList.add('is-valid');
            }
        }
    }

    // --- Validation Functions ---
    function validateFullName() {
        const fullName = fullNameInput.value.trim();
        if (fullName === '') {
            showFeedback(fullNameInput, 'El campo Nombre Completo es obligatorio.', false);
            return false;
        } else {
            showFeedback(fullNameInput, '', true);
            return true;
        }
    }

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

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(emailInput.value.trim())) {
            showFeedback(emailInput, '', true);
            return true;
        } else {
            showFeedback(emailInput, 'Por favor, introduce un correo electrónico válido.', false);
            return false;
        }
    }

    function validatePassword() {
        // Minimum 6 characters, maximum 18, at least one number and one uppercase letter
        const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,18}$/;
        if (passwordRegex.test(passwordInput.value)) {
            showFeedback(passwordInput, '', true);
            return true;
        } else {
            showFeedback(passwordInput, 'La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una mayúscula.', false);
            return false;
        }
    }

    function validateConfirmPassword() {
        // Only validate if password field is also valid, or if it's not empty and matches
        if (confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value !== '') {
            showFeedback(confirmPasswordInput, '', true);
            return true;
        } else {
            showFeedback(confirmPasswordInput, 'Las contraseñas no coinciden.', false);
            return false;
        }
    }

    function validateDob() {
        const dobValue = dobInput.value;
        if (!dobValue) {
            showFeedback(dobInput, 'Por favor, introduce una fecha de nacimiento válida.', false);
            return false;
        }

        const dob = new Date(dobValue);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age >= 13) { // Check for at least 13 years old
            showFeedback(dobInput, '', true);
            return true;
        } else {
            showFeedback(dobInput, 'Debes tener al menos 13 años para registrarte.', false);
            return false;
        }
    }

    // Address is optional, so no specific `validateAddress` function is needed for emptiness.
    // However, if you had format rules, you'd add one.

    // --- EVENT LISTENERS ---

    // Real-time validation on input/change
    fullNameInput.addEventListener('input', validateFullName); // Added
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    dobInput.addEventListener('change', validateDob); // 'change' is better for date inputs

    // Password and Confirm Password validation logic
    passwordInput.addEventListener('input', function() {
        validatePassword();
        if (confirmPasswordInput.value !== '') { // Revalidate confirm if it already has a value
            validateConfirmPassword();
        }
    });

    confirmPasswordInput.addEventListener('input', validateConfirmPassword);


    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Handle form submission
    registroForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop default submission

        // Execute all validations
        const isFullNameValid = validateFullName(); // Added
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isDobValid = validateDob();

        // Check if all required fields are valid
        const allFieldsValid = isFullNameValid && isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isDobValid;

        if (allFieldsValid) {
            registroForm.classList.add('was-validated'); // Add Bootstrap's class for success validation display
            formMessage.textContent = '¡Registro exitoso! Tus datos han sido enviados.';
            formMessage.classList.remove('text-danger');
            formMessage.classList.add('text-success');
            updateFooterColor(true); // Change footer color to green

            // In a real application, you would send the form data to a server here.
            // console.log('Formulario enviado:', {
            //     fullName: fullNameInput.value,
            //     username: usernameInput.value,
            //     email: emailInput.value,
            //     // NEVER send plain passwords in a real app!
            //     // password: passwordInput.value,
            //     dob: dobInput.value,
            //     address: addressInput.value // Optional field value
            // });

            // Clear the form and reset validation display after successful submission
            setTimeout(() => { // Use timeout to allow message to display
                registroForm.reset();
                registroForm.classList.remove('was-validated');
                document.querySelectorAll('.form-control, .form-check-input').forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                    const feedback = getFeedbackElement(input);
                    if (feedback) {
                        feedback.classList.remove('d-block', 'valid-feedback', 'invalid-feedback');
                        feedback.textContent = '';
                    }
                });
                formMessage.textContent = ''; // Clear success message
                formMessage.classList.remove('text-success', 'text-danger');
                resetFooterColor(); // Reset footer color
            }, 1500); // Wait 1.5 seconds before resetting
        } else {
            registroForm.classList.add('was-validated'); // If failure, add Bootstrap's class to show errors
            formMessage.textContent = 'Por favor, llena la información solicitada correctamente.';
            formMessage.classList.remove('text-success');
            formMessage.classList.add('text-danger');
            updateFooterColor(false); // Change footer color to red
        }
    });

    // Handle form reset button
    registroForm.addEventListener('reset', function() {
        setTimeout(() => { // Allow browser to clear first, then reset classes
            document.querySelectorAll('.form-control, .form-check-input').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
                const feedback = getFeedbackElement(input);
                if (feedback) {
                    feedback.classList.remove('d-block', 'valid-feedback', 'invalid-feedback');
                    feedback.textContent = '';
                }
            });
            registroForm.classList.remove('was-validated');
            formMessage.textContent = ''; // Clear any messages
            formMessage.classList.remove('text-success', 'text-danger');
            resetFooterColor(); // Reset footer color
        }, 0);
    });

    // --- Dynamic CSS and HTML manipulation (Examples for requirement 6) ---

    // Example 1: Dynamic CSS manipulation (changing footer color on scroll)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) { // If scrolled down more than 150px
            mainFooter.style.backgroundColor = '#4A90E2'; // A lighter blue/purple
            mainFooter.style.transition = 'background-color 0.5s ease-in-out';
        } else {
            // Revert to original color (from CSS variable or default)
            mainFooter.style.backgroundColor = 'var(--color-secundario)';
        }
    });

    // Example 2: Dynamic HTML manipulation (adding a welcome message to the header)
    const siteBranding = document.querySelector('.site-branding');
    if (siteBranding && !document.getElementById('header-welcome-message')) { // Prevent adding multiple times
        const welcomeMessageElement = document.createElement('p');
        welcomeMessageElement.id = 'header-welcome-message';
        welcomeMessageElement.style.color = '#e0f2f7'; // Lighter color for visibility
        welcomeMessageElement.style.fontSize = '1.1em';
        welcomeMessageElement.style.marginTop = '10px';
        siteBranding.appendChild(welcomeMessageElement);
    }
    // Initial footer color set on page load
    resetFooterColor();
});