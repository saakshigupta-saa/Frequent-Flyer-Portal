const API_URL = "/api/frequent-flyers";

// =================================
// DOM ELEMENTS
// =================================

const connectionStatus =
  document.getElementById("connectionStatus");

const connectionText =
  document.getElementById("connectionText");

const searchInput =
  document.getElementById("searchInput");

const searchButton =
  document.getElementById("searchButton");

const addMemberButton =
  document.getElementById("addMemberButton");

const membersTableBody =
  document.getElementById("membersTableBody");

const tableWrapper =
  document.getElementById("tableWrapper");

const emptyState =
  document.getElementById("emptyState");

const memberCount =
  document.getElementById("memberCount");

const loading =
  document.getElementById("loading");

const message =
  document.getElementById("message");

const memberModal =
  document.getElementById("memberModal");

const memberForm =
  document.getElementById("memberForm");

const modalTitle =
  document.getElementById("modalTitle");

const closeModalButton =
  document.getElementById("closeModalButton");

const cancelButton =
  document.getElementById("cancelButton");

const saveMemberButton =
  document.getElementById("saveMemberButton");

const memberIdInput =
  document.getElementById("memberId");

const firstNameInput =
  document.getElementById("firstName");

const lastNameInput =
  document.getElementById("lastName");

const emailInput =
  document.getElementById("email");

const phoneInput =
  document.getElementById("phone");

const membershipTierInput =
  document.getElementById("membershipTier");

const milesInput =
  document.getElementById("miles");


// =================================
// STATE
// =================================

let members = [];
let isEditing = false;
let lastFocusedElement = null;


// =================================
// SANITIZATION
// =================================

const sanitizeText = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const temporaryElement =
    document.createElement("div");

  temporaryElement.textContent = value;

  return temporaryElement.textContent.trim();
};


// =================================
// HTML ESCAPING
// =================================

const escapeHtml = (value) => {
  const div =
    document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
};


// =================================
// UI HELPERS
// =================================

const setLoading = (isLoading) => {
  loading.hidden = !isLoading;
};

const showMessage = (text, type = "") => {
  message.textContent = text;

  message.className =
    `message ${type}`.trim();

  message.hidden = false;
};

const hideMessage = () => {
  message.hidden = true;
  message.textContent = "";
  message.className = "message";
};

const setConnectionStatus = (
  isConnected,
  text
) => {
  connectionStatus.classList.toggle(
    "connected",
    isConnected
  );

  connectionStatus.classList.toggle(
    "error",
    !isConnected
  );

  connectionText.textContent = text;
};


// =================================
// API REQUEST
// =================================

const apiRequest = async (
  url,
  options = {}
) => {
  const response = await fetch(
    url,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
      "Something went wrong. Please try again."
    );
  }

  return data;
};


// =================================
// CHECK API CONNECTION
// =================================

const checkConnection = async () => {
  try {
    const response =
      await fetch("/api/health");

    if (!response.ok) {
      throw new Error(
        "Server unavailable"
      );
    }

    setConnectionStatus(
      true,
      "Connected"
    );
  } catch {
    setConnectionStatus(
      false,
      "Connection unavailable"
    );
  }
};


// =================================
// LOAD MEMBERS
// =================================

const loadMembers = async () => {
  setLoading(true);
  hideMessage();

  try {
    const data =
      await apiRequest(API_URL);

    members =
      Array.isArray(data)
        ? data
        : [];

    renderMembers(members);

    setConnectionStatus(
      true,
      "Connected"
    );
  } catch (error) {
    members = [];

    renderMembers([]);

    showMessage(
      error.message,
      "error"
    );

    setConnectionStatus(
      false,
      "Connection unavailable"
    );
  } finally {
    setLoading(false);
  }
};


// =================================
// SEARCH MEMBERS
// =================================

const searchMembers = async () => {
  const query =
    sanitizeText(
      searchInput.value
    );

  if (!query) {
    await loadMembers();
    return;
  }

  setLoading(true);
  hideMessage();

  try {
    const data =
      await apiRequest(
        `${API_URL}/search/${encodeURIComponent(
          query
        )}`
      );

    members =
      Array.isArray(data)
        ? data
        : [];

    renderMembers(members);
  } catch (error) {
    renderMembers([]);

    showMessage(
      error.message,
      "error"
    );
  } finally {
    setLoading(false);
  }
};


// =================================
// RENDER MEMBERS
// =================================

const renderMembers = (
  memberList
) => {
  membersTableBody.innerHTML = "";

  memberCount.textContent =
    `${memberList.length} ${
      memberList.length === 1
        ? "member"
        : "members"
    }`;

  if (!memberList.length) {
    tableWrapper.hidden = true;
    emptyState.hidden = false;
    return;
  }

  tableWrapper.hidden = false;
  emptyState.hidden = true;

  const fragment =
    document.createDocumentFragment();

  memberList.forEach((member) => {
    const row =
      document.createElement("tr");

    const fullName =
      `${member.firstName} ${member.lastName}`;

    const statusClass =
      member.status === "ACTIVE"
        ? "status-active"
        : "status-inactive";

    row.innerHTML = `
      <td>
        <div class="member-name">
          ${escapeHtml(fullName)}
        </div>

        <div class="member-id">
          ${escapeHtml(member.memberId)}
        </div>
      </td>

      <td>
        <div class="contact-email">
          ${escapeHtml(member.email)}
        </div>

        <div class="contact-phone">
          ${escapeHtml(member.phone)}
        </div>
      </td>

      <td>
        <span class="tier-badge">
          ${escapeHtml(
            member.membershipTier
          )}
        </span>
      </td>

      <td>
        <span class="miles-value">
          ${Number(
            member.miles || 0
          ).toLocaleString()}
        </span>
      </td>

      <td>
        <span
          class="status-badge ${statusClass}"
        >
          ${escapeHtml(
            member.status
          )}
        </span>
      </td>

      <td>
        <button
          type="button"
          class="table-action"
          data-edit-id="${escapeHtml(
            member._id
          )}"
          aria-label="Edit ${escapeHtml(
            fullName
          )}"
        >
          Edit
        </button>
      </td>
    `;

    fragment.appendChild(row);
  });

  membersTableBody.appendChild(
    fragment
  );
};


// =================================
// MODAL
// =================================

const openModal = (
  member = null
) => {
  lastFocusedElement =
    document.activeElement;

  clearFormErrors();

  if (member) {
    isEditing = true;

    modalTitle.textContent =
      "Edit Frequent Flyer";

    saveMemberButton.textContent =
      "Update Member";

    memberIdInput.value =
      member._id;

    firstNameInput.value =
      member.firstName;

    lastNameInput.value =
      member.lastName;

    emailInput.value =
      member.email;

    phoneInput.value =
      member.phone;

    membershipTierInput.value =
      member.membershipTier;

    milesInput.value =
      member.miles;
  } else {
    isEditing = false;

    modalTitle.textContent =
      "Add Frequent Flyer";

    saveMemberButton.textContent =
      "Save Member";

    memberForm.reset();

    memberIdInput.value = "";

    milesInput.value = "0";

    membershipTierInput.value =
      "BASIC";
  }

  memberModal.hidden = false;

  document.body.style.overflow =
    "hidden";

  firstNameInput.focus();
};

const closeModal = () => {
  memberModal.hidden = true;

  document.body.style.overflow =
    "";

  clearFormErrors();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};


// =================================
// FORM VALIDATION
// =================================

const setFieldError = (
  input,
  errorId,
  text
) => {
  const errorElement =
    document.getElementById(
      errorId
    );

  input.classList.toggle(
    "input-error",
    Boolean(text)
  );

  input.setAttribute(
    "aria-invalid",
    text ? "true" : "false"
  );

  errorElement.textContent =
    text || "";
};

const clearFormErrors = () => {
  const fields = [
    [
      firstNameInput,
      "firstNameError",
    ],
    [
      lastNameInput,
      "lastNameError",
    ],
    [
      emailInput,
      "emailError",
    ],
    [
      phoneInput,
      "phoneError",
    ],
    [
      milesInput,
      "milesError",
    ],
  ];

  fields.forEach(
    ([input, errorId]) => {
      setFieldError(
        input,
        errorId,
        ""
      );
    }
  );
};

const validateForm = () => {
  clearFormErrors();

  let isValid = true;

  const firstName =
    sanitizeText(
      firstNameInput.value
    );

  const lastName =
    sanitizeText(
      lastNameInput.value
    );

  const email =
    sanitizeText(
      emailInput.value
    );

  const phone =
    sanitizeText(
      phoneInput.value
    );

  const miles =
    Number(milesInput.value);

  if (!firstName) {
    setFieldError(
      firstNameInput,
      "firstNameError",
      "First name is required."
    );

    isValid = false;
  }

  if (!lastName) {
    setFieldError(
      lastNameInput,
      "lastNameError",
      "Last name is required."
    );

    isValid = false;
  }

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    setFieldError(
      emailInput,
      "emailError",
      "Enter a valid email address."
    );

    isValid = false;
  }

  if (!phone) {
    setFieldError(
      phoneInput,
      "phoneError",
      "Phone number is required."
    );

    isValid = false;
  }

  if (
    !Number.isFinite(miles) ||
    miles < 0
  ) {
    setFieldError(
      milesInput,
      "milesError",
      "Miles must be 0 or greater."
    );

    isValid = false;
  }

  return isValid;
};


// =================================
// SAVE MEMBER
// =================================

const saveMember = async (
  event
) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const payload = {
    firstName:
      sanitizeText(
        firstNameInput.value
      ),

    lastName:
      sanitizeText(
        lastNameInput.value
      ),

    email:
      sanitizeText(
        emailInput.value
      ),

    phone:
      sanitizeText(
        phoneInput.value
      ),

    membershipTier:
      membershipTierInput.value,

    miles:
      Number(milesInput.value),
  };

  if (isEditing) {
    const currentMember =
      members.find(
        (member) =>
          member._id ===
          memberIdInput.value
      );

    if (currentMember) {
      payload.status =
        currentMember.status;
    }
  }

  saveMemberButton.disabled =
    true;

  saveMemberButton.textContent =
    isEditing
      ? "Updating..."
      : "Saving...";

  try {
    if (isEditing) {
      await apiRequest(
        `${API_URL}/${encodeURIComponent(
          memberIdInput.value
        )}`,
        {
          method: "PUT",
          body: JSON.stringify(
            payload
          ),
        }
      );

      showMessage(
        "Member updated successfully.",
        "success"
      );
    } else {
      await apiRequest(
        API_URL,
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      );

      showMessage(
        "Member added successfully.",
        "success"
      );
    }

    console.log(
      "[Analytics] User interacted with End-to-End Frequent Flyer Portal"
    );

    closeModal();

    await loadMembers();
  } catch (error) {
    showMessage(
      error.message,
      "error"
    );
  } finally {
    saveMemberButton.disabled =
      false;

    saveMemberButton.textContent =
      isEditing
        ? "Update Member"
        : "Save Member";
  }
};


// =================================
// EDIT MEMBER
// =================================

const editMember = (
  memberId
) => {
  const member =
    members.find(
      (item) =>
        item._id === memberId
    );

  if (!member) {
    showMessage(
      "Member data could not be found.",
      "error"
    );

    return;
  }

  openModal(member);
};


// =================================
// EVENT LISTENERS
// =================================

addMemberButton.addEventListener(
  "click",
  () => {
    openModal();
  }
);

closeModalButton.addEventListener(
  "click",
  closeModal
);

cancelButton.addEventListener(
  "click",
  closeModal
);

memberForm.addEventListener(
  "submit",
  saveMember
);

searchButton.addEventListener(
  "click",
  searchMembers
);

searchInput.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchMembers();
    }
  }
);

membersTableBody.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(
        "[data-edit-id]"
      );

    if (!button) {
      return;
    }

    editMember(
      button.dataset.editId
    );
  }
);

memberModal.addEventListener(
  "click",
  (event) => {
    if (
      event.target.classList.contains(
        "modal-backdrop"
      )
    ) {
      closeModal();
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      !memberModal.hidden
    ) {
      closeModal();
    }
  }
);


// =================================
// INITIALIZE
// =================================

const initializeApp = async () => {
  await checkConnection();
  await loadMembers();
};

initializeApp();