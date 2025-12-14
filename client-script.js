// Project Submission Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form functionality
    initFormSteps();
    initFileUpload();
    initFormValidation();
    initFormSubmission();
    
    // Add animation to form elements
    animateFormElements();
});

// Form Step Navigation
let currentStep = 1;
const totalSteps = 3;

function initFormSteps() {
    // Update step indicator on load
    updateStepIndicator();
    
    // Add click events to step indicators
    document.querySelectorAll('.step-indicator').forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            if (stepNumber < currentStep || this.classList.contains('completed')) {
                goToStep(stepNumber);
            }
        });
    });
}

function updateStepIndicator() {
    document.querySelectorAll('.step-indicator').forEach(step => {
        const stepNumber = parseInt(step.getAttribute('data-step'));
        
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show target step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update current step
    currentStep = step;
    
    // Update step indicator
    updateStepIndicator();
    
    // Scroll to top of form
    document.querySelector('.project-form').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function nextStep(next) {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
        goToStep(next);
    }
}

function prevStep(prev) {
    goToStep(prev);
}

// Step Validation
function validateStep(step) {
    let isValid = true;
    
    if (step === 1) {
        const projectType = document.querySelector('input[name="projectType"]:checked');
        if (!projectType) {
            showError('Please select a project type');
            isValid = false;
        }
    } else if (step === 2) {
        // Validate required fields in step 2
        const requiredFields = ['projectName', 'clientName', 'clientEmail', 'projectDescription'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(`${fieldId}Error`) || createErrorElement(fieldId);
            
            if (!field.value.trim()) {
                field.classList.add('error');
                errorElement.textContent = 'This field is required';
                errorElement.classList.add('show');
                isValid = false;
            } else if (fieldId === 'clientEmail' && !isValidEmail(field.value)) {
                field.classList.add('error');
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.classList.add('show');
                isValid = false;
            } else {
                field.classList.remove('error');
                errorElement.classList.remove('show');
            }
        });
    }
    
    return isValid;
}

function createErrorElement(fieldId) {
    const errorElement = document.createElement('div');
    errorElement.id = `${fieldId}Error`;
    errorElement.className = 'error-message';
    document.getElementById(fieldId).parentNode.appendChild(errorElement);
    return errorElement;
}

function showError(message) {
    // Create temporary error notification
    const errorNotification = document.createElement('div');
    errorNotification.className = 'error-notification';
    errorNotification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error-color);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
    `;
    
    document.body.appendChild(errorNotification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorNotification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => errorNotification.remove(), 300);
    }, 5000);
}

// File Upload Functionality
function initFileUpload() {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('referenceFiles');
    const fileList = document.getElementById('fileList');
    
    // Click to browse
    dropArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // Handle selected files
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        [...files].forEach(file => {
            if (validateFile(file)) {
                addFileToList(file);
            }
        });
    }
    
    function validateFile(file) {
        const maxSize = 50 * 1024 * 1024; // 50MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'application/pdf', 'application/zip', 'application/x-zip-compressed'];
        
        if (file.size > maxSize) {
            showError(`File ${file.name} is too large (max 50MB)`);
            return false;
        }
        
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.zip')) {
            showError(`File type not supported for ${file.name}`);
            return false;
        }
        
        return true;
    }
    
    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileSize = formatFileSize(file.size);
        const fileIcon = getFileIcon(file.type);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="${fileIcon}"></i>
                </div>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button class="file-remove" onclick="removeFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
    }
}

function removeFile(button) {
    button.closest('.file-item').remove();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType.startsWith('video/')) return 'fas fa-video';
    if (fileType === 'application/pdf') return 'fas fa-file-pdf';
    if (fileType.includes('zip')) return 'fas fa-file-archive';
    return 'fas fa-file';
}

// Form Validation
function initFormValidation() {
    // Real-time email validation
    const emailField = document.getElementById('clientEmail');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
                const errorElement = document.getElementById('clientEmailError') || createErrorElement('clientEmail');
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.classList.add('show');
            } else {
                this.classList.remove('error');
                const errorElement = document.getElementById('clientEmailError');
                if (errorElement) errorElement.classList.remove('show');
            }
        });
    }
    
    // Real-time required field validation
    document.querySelectorAll('.form-input, .form-textarea').forEach(field => {
        if (field.hasAttribute('required')) {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form Submission
function initFormSubmission() {
    const form = document.getElementById('projectForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all steps
        let isValid = true;
        for (let i = 1; i <= totalSteps; i++) {
            if (!validateStep(i)) {
                isValid = false;
                goToStep(i);
                break;
            }
        }
        
        if (!isValid) {
            showError('Please fill in all required fields correctly');
            return;
        }
        
        // Check terms agreement
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            showError('Please agree to the terms and conditions');
            return;
        }
        
        // Disable submit button
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            form.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            // Here you would typically send data to your server
            // Example: sendFormData();
        }, 1500);
    });
}

// Function to collect and send form data (example)
function sendFormData() {
    const formData = {
        projectType: document.querySelector('input[name="projectType"]:checked')?.value,
        projectName: document.getElementById('projectName').value,
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        companyName: document.getElementById('companyName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        projectDescription: document.getElementById('projectDescription').value,
        timeline: document.getElementById('timeline').value,
        budget: document.getElementById('budget').value,
        additionalInfo: document.getElementById('additionalInfo').value,
        howFound: document.getElementById('howFound').value,
        submittedAt: new Date().toISOString()
    };
    
    console.log('Form data to send:', formData);
    // In production: Send this to your backend API
    // fetch('/api/submit-project', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    // .catch(error => console.error('Error:', error));
}

// Animation for form elements
function animateFormElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe form elements
    document.querySelectorAll('.form-group, .type-option, .form-navigation').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s var(--animation-timing), transform 0.5s var(--animation-timing)';
        observer.observe(el);
    });
}

// Add CSS for animations
const animationCSS = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.error-notification {
    font-family: 'Poppins', sans-serif;
}
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);