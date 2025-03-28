document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModal");
  const modal = document.getElementById("reminderModal");
  const eventTypeBtns = document.querySelectorAll(".event-type-btn");
  const customEventContainer = document.getElementById("customEventContainer");
  const addReminderBtn = document.getElementById("addReminderBtn");
  const reminderForm = document.getElementById("reminderForm");
  let reminderCount = 0;
  const MAX_REMINDERS = 3;
  const savedReminders = [];

  openModalBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
    resetForm();
    reminderCount = 0;
    updateStepIndicator();
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      resetForm();
      reminderCount = 0;
      updateStepIndicator();
    }
  });

  eventTypeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      eventTypeBtns.forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");
      if (this.dataset.type === "Other") {
        customEventContainer.classList.add("show");
        setTimeout(() => {
          document.querySelector('input[name="customEvent"]').focus();
        }, 300);
      } else {
        customEventContainer.classList.remove("show");
      }

      validateForm();
    });
  });

  addReminderBtn.addEventListener("click", function (event) {
    if (validateForm()) {
      event.preventDefault();

      const formData = new FormData(reminderForm);
      const selectedEventType = document.querySelector(
        ".event-type-btn.selected"
      ).dataset.type;

      const reminderData = {
        name: formData.get("name"),
        eventType:
          selectedEventType === "Other"
            ? formData.get("customEvent")
            : selectedEventType,
        day: formData.get("day"),
        month: formData.get("month"),
        email: formData.get("email"),
      };
      reminderData.month = convertMonthToNumber(reminderData.month);
      console.log("Sending Reminder Data:", reminderData);

      fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          savedReminders.push(reminderData);
          reminderCount++;
          updateStepIndicator();

          // console.log("hello1")
          addReminderBtn.textContent = "Event added";
          addReminderBtn.classList.remove("reminder-btn");
          addReminderBtn.classList.add(
            "bg-green-500",
            "text-white",
            "py-3",
            "px-4",
            "rounded",
            "text-center",
            "w-full"
          );

          addReminderBtn.disabled = true;

          setTimeout(() => {
            resetForm();
            addReminderBtn.textContent = "Add reminder";
            addReminderBtn.classList.add("reminder-btn");
            addReminderBtn.classList.remove(
              "bg-green-500",
              "text-white",
              "py-3",
              "px-4",
              "rounded"
            );
            addReminderBtn.disabled = false;
            if (reminderCount >= MAX_REMINDERS) {
              modal.style.display = "none";
              console.log("All reminders data:", savedReminders);
              reminderCount = 0;
              updateStepIndicator();
            }
          }, 1800);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to add reminder. Please try again.");
        });
    }
  });

  function convertMonthToNumber(month) {
    const months = {
      jan: 1,
      january: 1,
      feb: 2,
      february: 2,
      mar: 3,
      march: 3,
      apr: 4,
      april: 4,
      may: 5,
      jun: 6,
      june: 6,
      jul: 7,
      july: 7,
      aug: 8,
      august: 8,
      sep: 9,
      september: 9,
      oct: 10,
      october: 10,
      nov: 11,
      november: 11,
      dec: 12,
      december: 12,
    };
    return months[month.toLowerCase()] || month;
  }

  function updateStepIndicator() {
    const steps = document.querySelectorAll(".step");

    steps.forEach((step, index) => {
      if (index < reminderCount) {
        step.classList.remove("inactive-step");
        step.classList.add("active-step");
      } else {
        step.classList.remove("active-step");
        step.classList.add("inactive-step");
      }
    });
  }

  function validateForm() {
    let isValid = true;
    const inputs = reminderForm.querySelectorAll("input[required]");

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    const otherSelected = document.querySelector(
      '.event-type-btn.selected[data-type="Other"]'
    );
    if (otherSelected) {
      const customInput = document.querySelector('input[name="customEvent"]');
      if (!customInput.value.trim()) {
        isValid = false;
      }
    }

    return isValid;
  }
  function validateEmailField(emailInput) {
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let errorMsg = emailInput.parentElement.querySelector(".error-message");
    if (!errorMsg) {
      errorMsg = document.createElement("div");
      errorMsg.className = "error-message text-red-500 text-xs mt-1 hidden";
      emailInput.parentElement.appendChild(errorMsg);
    }

    if (!emailValue) {
      errorMsg.textContent = "";
      errorMsg.classList.add("hidden");
    } else if (!emailPattern.test(emailValue)) {
      errorMsg.textContent = "Please enter a valid email address";
      errorMsg.classList.remove("hidden");
      return false;
    } else {
      errorMsg.textContent = "";
      errorMsg.classList.add("hidden");
      return true;
    }
  }

  function resetForm() {
    reminderForm.reset();

    eventTypeBtns.forEach((btn, index) => {
      if (index === 0) {
        btn.classList.add("selected");
      } else {
        btn.classList.remove("selected");
      }
    });

    customEventContainer.classList.remove("show");

    clearAllErrorMessages();
  }

  const formInputs = reminderForm.querySelectorAll("input");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      validateForm();

      if (input.name === "day") {
        validateDayField(input);
      } else if (input.name === "month") {
        validateMonthField(input);
      } else if (input.name === "email") {
        validateEmailField(input);
      }
    });
  });

  function validateDayField(dayInput) {
    const dayValue = dayInput.value.trim();
    const dayNum = parseInt(dayValue);

    let errorMsg = dayInput.parentElement.querySelector(".error-message");
    if (!errorMsg) {
      errorMsg = document.createElement("div");
      errorMsg.className = "error-message text-red-500 text-xs mt-1 hidden";
      dayInput.parentElement.appendChild(errorMsg);
    }

    if (!dayValue) {
      errorMsg.textContent = "";
      errorMsg.classList.add("hidden");
    } else if (isNaN(dayNum) || !Number.isInteger(dayNum)) {
      errorMsg.textContent = "Day must be a number";
      errorMsg.classList.remove("hidden");
      return false;
    } else if (dayNum < 1 || dayNum > 31) {
      errorMsg.textContent = "Day must be between 1-31";
      errorMsg.classList.remove("hidden");
      return false;
    } else {
      errorMsg.textContent = "";
      errorMsg.classList.add("hidden");
      return true;
    }
  }

  function validateMonthField(monthInput) {
    const monthValue = monthInput.value.trim().toLowerCase();
    const monthNum = parseInt(monthValue);
    const validMonthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    let errorMsg = monthInput.parentElement.querySelector(".error-message");
    if (!errorMsg) {
      errorMsg = document.createElement("div");
      errorMsg.className = "error-message text-red-500 text-xs mt-1 hidden";
      monthInput.parentElement.appendChild(errorMsg);
    }

    if (!monthValue) {
      errorMsg.textContent = "";
      errorMsg.classList.add("hidden");
    } else if (!isNaN(monthNum)) {
      if (monthNum < 1 || monthNum > 12) {
        errorMsg.textContent = "Month must be between 1-12";
        errorMsg.classList.remove("hidden");
        return false;
      } else {
        errorMsg.textContent = "";
        errorMsg.classList.add("hidden");
        return true;
      }
    } else if (!validMonthNames.includes(monthValue)) {
      errorMsg.textContent = "Enter a valid month name or number";
      errorMsg.classList.remove("hidden");
      return false;
    } else {
      errorMsg.textContent = "";
      errorMsg.classList.add("hidden");
      return true;
    }
  }

  function clearAllErrorMessages() {
    const errorMessages = reminderForm.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => {
      msg.textContent = "";
      msg.classList.add("hidden");
    });
  }

  function validateForm() {
    let isValid = true;
    const inputs = reminderForm.querySelectorAll("input[required]");

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    const otherSelected = document.querySelector(
      '.event-type-btn.selected[data-type="Other"]'
    );
    if (otherSelected) {
      const customInput = document.querySelector('input[name="customEvent"]');
      if (!customInput.value.trim()) {
        isValid = false;
      }
    }

    const dayInput = reminderForm.querySelector('input[name="day"]');
    const monthInput = reminderForm.querySelector('input[name="month"]');
    const emailInput = reminderForm.querySelector('input[name="email"]');

    if (dayInput.value.trim() && !validateDayField(dayInput)) {
      isValid = false;
    }

    if (monthInput.value.trim() && !validateMonthField(monthInput)) {
      isValid = false;
    }

    if (emailInput.value.trim() && !validateEmailField(emailInput)) {
      isValid = false;
    }

    if (isValid) {
      addReminderBtn.classList.add("active");
    } else {
      addReminderBtn.classList.remove("active");
    }

    return isValid;
  }
});
