document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Global UI Vector Icons via Lucide Engine
    lucide.createIcons();

    // 2. Interactive Modal Configuration
    const modalOverlay = document.getElementById("contactModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const openModalButtons = document.querySelectorAll(".open-modal-btn");
    const leadForm = document.getElementById("leadForm");

    // Open Modal Function
    const openModal = () => {
        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background body scroll
    };

    // Close Modal Function
    const closeModal = () => {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable body scroll
    };

    // Attach Event Handlers to all Action Target Elements
    openModalButtons.forEach(btn => {
        btn.addEventListener("click", openModal);
    });

    closeModalBtn.addEventListener("click", closeModal);

    // Dismiss modal if user clicks anywhere outside the form container card
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // 3. Form Data Submission Controller (AJAX Web3Forms)
    leadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Extract input fields and form elements
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const formData = new FormData(leadForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // UI Feedback: Disable button and show sending state
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        // Submit data asynchronously over HTTP POST
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status === 200) {
                // Smooth browser notification instead of raw alert system popups
                alert(`Thank you! Your request has been submitted successfully. We'll be in touch shortly.`);
            } else {
                alert(`Submission error: ${res.message}`);
            }
        })
        .catch(error => {
            console.error("Submission failed:", error);
            alert("Something went wrong with the network link. Please try again later.");
        })
        .then(() => {
            // Reset fields, restore button state, and safely close modal interface
            leadForm.reset();
            submitBtn.innerText = "Submit Request";
            submitBtn.disabled = false;
            closeModal();
        });
    });
});