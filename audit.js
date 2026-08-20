document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const form = document.getElementById("auditForm");

    if (!form) {
        console.error("Audit form not found.");
        return;
    }

    const steps = Array.from(
        document.querySelectorAll(".form-step")
    );

    const progressSteps = Array.from(
        document.querySelectorAll(".progress-step")
    );

    const nextButtons = document.querySelectorAll(
        ".form-next"
    );

    const backButtons = document.querySelectorAll(
        ".form-back"
    );

    const submitButton =
        form.querySelector(".form-submit");

    const formSuccess =
        document.querySelector(".form-success");

    let currentStep = 0;


    /* =====================================================
       SHOW STEP
       ===================================================== */

    function showStep(stepIndex) {

        if (stepIndex < 0) {
            stepIndex = 0;
        }

        if (stepIndex >= steps.length) {
            stepIndex = steps.length - 1;
        }

        currentStep = stepIndex;

        steps.forEach((step, index) => {

            step.classList.toggle(
                "active",
                index === currentStep
            );

        });

        progressSteps.forEach((step, index) => {

            step.classList.toggle(
                "active",
                index === currentStep
            );

            step.classList.toggle(
                "completed",
                index < currentStep
            );

        });

        window.scrollTo({
            top: form.offsetTop - 100,
            behavior: "smooth"
        });
    }


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateStep(stepIndex) {

        const step = steps[stepIndex];

        if (!step) {
            return true;
        }

        let valid = true;

        const requiredFields =
            step.querySelectorAll(
                "input[required], textarea[required], select[required]"
            );

        requiredFields.forEach(field => {

            if (!field.value.trim()) {

                field.classList.add("error");

                valid = false;

            } else {

                field.classList.remove("error");

            }

        });


        /* -----------------------------------------------
           SERVICE VALIDATION
           ----------------------------------------------- */

        const serviceInputs =
            step.querySelectorAll(
                'input[name="services"]'
            );

        if (serviceInputs.length) {

            const serviceSelected =
                Array.from(serviceInputs)
                    .some(input => input.checked);

            const serviceError =
                step.querySelector(
                    ".service-error"
                );

            if (!serviceSelected) {

                valid = false;

                if (serviceError) {
                    serviceError.classList.add("show");
                }

            } else {

                if (serviceError) {
                    serviceError.classList.remove("show");
                }

            }

        }


        /* -----------------------------------------------
           GOAL RADIO VALIDATION
           ----------------------------------------------- */

        const goalInputs =
            step.querySelectorAll(
                'input[name="goal"]'
            );

        if (goalInputs.length) {

            const goalSelected =
                Array.from(goalInputs)
                    .some(input => input.checked);

            if (!goalSelected) {

                valid = false;

                const goalError =
                    step.querySelector(
                        ".goal-error"
                    );

                if (goalError) {
                    goalError.classList.add("show");
                }

            } else {

                const goalError =
                    step.querySelector(
                        ".goal-error"
                    );

                if (goalError) {
                    goalError.classList.remove("show");
                }

            }

        }


        return valid;
    }


    /* =====================================================
       REMOVE INPUT ERRORS
       ===================================================== */

    form.querySelectorAll(
        "input, textarea, select"
    ).forEach(field => {

        field.addEventListener(
            "input",
            () => {
                field.classList.remove("error");
            }
        );

        field.addEventListener(
            "change",
            () => {
                field.classList.remove("error");
            }
        );

    });


    /* =====================================================
       NEXT BUTTON
       ===================================================== */

    nextButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!validateStep(currentStep)) {
                    return;
                }

                showStep(currentStep + 1);

            }
        );

    });


    /* =====================================================
       BACK BUTTON
       ===================================================== */

    backButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showStep(currentStep - 1);

            }
        );

    });


    /* =====================================================
       FORM SUBMISSION — NETLIFY
       ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* -------------------------------------------
               FINAL VALIDATION
               ------------------------------------------- */

            if (!validateStep(currentStep)) {
                return;
            }


            /* -------------------------------------------
               BUTTON LOADING
               ------------------------------------------- */

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.classList.add(
                    "loading"
                );

            }


            /* -------------------------------------------
               FORM DATA
               ------------------------------------------- */

            const formData =
                new FormData(form);


            /*
             * Netlify requires this value
             * when submitting through fetch().
             */

            formData.set(
                "form-name",
                "digital-growth-audit"
            );


            try {

                const response =
                    await fetch(
                        window.location.pathname,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body:
                                new URLSearchParams(
                                    formData
                                ).toString()
                        }
                    );


                /* ---------------------------------------
                   CHECK RESPONSE
                   --------------------------------------- */

                if (!response.ok) {

                    throw new Error(
                        "Netlify submission failed."
                    );

                }


                /* ---------------------------------------
                   HIDE FORM
                   --------------------------------------- */

                steps.forEach(step => {

                    step.style.display = "none";

                });


                /* ---------------------------------------
                   HIDE PROGRESS
                   --------------------------------------- */

                const progress =
                    document.querySelector(
                        ".form-progress"
                    );

                if (progress) {

                    progress.style.display =
                        "none";

                }


                /* ---------------------------------------
                   SHOW SUCCESS
                   --------------------------------------- */

                if (formSuccess) {

                    formSuccess.classList.add(
                        "show"
                    );

                }


                /* ---------------------------------------
                   REMOVE LOADING
                   --------------------------------------- */

                if (submitButton) {

                    submitButton.classList.remove(
                        "loading"
                    );

                }

            } catch (error) {

                console.error(
                    "TMG Audit Submission Error:",
                    error
                );


                alert(
                    "Something went wrong while submitting your audit. Please try again."
                );


                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.classList.remove(
                        "loading"
                    );

                }

            }

        }
    );


    /* =====================================================
       CLEAR SERVICE ERROR
       ===================================================== */

    const serviceInputs =
        form.querySelectorAll(
            'input[name="services"]'
        );

    serviceInputs.forEach(input => {

        input.addEventListener(
            "change",
            () => {

                const serviceError =
                    document.querySelector(
                        ".service-error"
                    );

                const selected =
                    Array.from(serviceInputs)
                        .some(
                            item => item.checked
                        );

                if (
                    selected &&
                    serviceError
                ) {

                    serviceError.classList.remove(
                        "show"
                    );

                }

            }
        );

    });


    /* =====================================================
       CLEAR GOAL ERROR
       ===================================================== */

    const goalInputs =
        form.querySelectorAll(
            'input[name="goal"]'
        );

    goalInputs.forEach(input => {

        input.addEventListener(
            "change",
            () => {

                const goalError =
                    document.querySelector(
                        ".goal-error"
                    );

                if (goalError) {

                    goalError.classList.remove(
                        "show"
                    );

                }

            }
        );

    });


    /* =====================================================
       DARK / LIGHT MODE TOGGLE
       ===================================================== */

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    const root =
        document.documentElement;


    function applyTheme(theme) {

        const lightMode =
            theme === "light";


        root.classList.toggle(
            "light-mode",
            lightMode
        );


        if (!themeToggle) {
            return;
        }


        themeToggle.setAttribute(
            "aria-pressed",
            String(lightMode)
        );


        themeToggle.setAttribute(
            "aria-label",
            lightMode
                ? "Switch to dark mode"
                : "Switch to light mode"
        );


        const themeIcon =
            themeToggle.querySelector(
                ".theme-icon"
            );


        if (themeIcon) {

            themeIcon.textContent =
                lightMode
                    ? "☾"
                    : "☀";

        }

    }


    /* -----------------------------------------------
       LOAD SAVED THEME
       ----------------------------------------------- */

    const savedTheme =
        localStorage.getItem(
            "tmg-audit-theme"
        );


    applyTheme(
        savedTheme === "light"
            ? "light"
            : "dark"
    );


    /* -----------------------------------------------
       TOGGLE THEME
       ----------------------------------------------- */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const lightMode =
                    root.classList.contains(
                        "light-mode"
                    );


                const newTheme =
                    lightMode
                        ? "dark"
                        : "light";


                applyTheme(
                    newTheme
                );


                localStorage.setItem(
                    "tmg-audit-theme",
                    newTheme
                );

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    showStep(0);

});