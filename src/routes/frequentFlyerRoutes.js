const express = require("express");

const FrequentFlyer = require("../models/FrequentFlyer");

const router = express.Router();


// =================================
// SANITIZATION
// =================================

const sanitizeText = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    )
    .replace(/<[^>]*>/g, "")
    .trim();
};


// =================================
// VALIDATION
// =================================

const VALID_TIERS = [
  "BASIC",
  "SILVER",
  "GOLD",
  "PLATINUM",
];

const VALID_STATUSES = [
  "ACTIVE",
  "INACTIVE",
];

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


// =================================
// CREATE MEMBER
// =================================

router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      membershipTier,
      miles,
    } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({
        error: "First name is required",
      });
    }

    if (!lastName || !lastName.trim()) {
      return res.status(400).json({
        error: "Last name is required",
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        error: "Valid email is required",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        error: "Phone number is required",
      });
    }

    if (
      membershipTier &&
      !VALID_TIERS.includes(membershipTier)
    ) {
      return res.status(400).json({
        error: "Invalid membership tier",
      });
    }

    if (
      miles !== undefined &&
      (typeof miles !== "number" || miles < 0)
    ) {
      return res.status(400).json({
        error: "Miles must be a non-negative number",
      });
    }

    const sanitizedFirstName =
      sanitizeText(firstName);

    const sanitizedLastName =
      sanitizeText(lastName);

    const sanitizedEmail =
      sanitizeText(email);

    const sanitizedPhone =
      sanitizeText(phone);

    const memberId =
      `FF-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    const member =
      await FrequentFlyer.create({
        memberId,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        membershipTier:
          membershipTier || "BASIC",
        miles: miles || 0,
      });

    console.log(
      "[Analytics] User interacted with End-to-End Frequent Flyer Portal"
    );

    return res.status(201).json(member);
  } catch (error) {
    console.error(
      "Create frequent flyer error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(409).json({
        error:
          "A frequent flyer with this email already exists",
      });
    }

    return res.status(500).json({
      error: "Failed to create frequent flyer",
    });
  }
});


// =================================
// GET ALL MEMBERS
// =================================

router.get("/", async (req, res) => {
  try {
    const members =
      await FrequentFlyer.find().sort({
        createdAt: -1,
      });

    return res.status(200).json(members);
  } catch (error) {
    console.error(
      "Get frequent flyers error:",
      error.message
    );

    return res.status(500).json({
      error: "Failed to retrieve frequent flyers",
    });
  }
});


// =================================
// SEARCH MEMBERS
// IMPORTANT: Keep this BEFORE /:id
// =================================

router.get("/search/:query", async (req, res) => {
  try {
    const query =
      sanitizeText(req.params.query);

    if (!query) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    const escapedQuery =
      query.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const members =
      await FrequentFlyer.find({
        $or: [
          {
            memberId: {
              $regex: escapedQuery,
              $options: "i",
            },
          },
          {
            firstName: {
              $regex: escapedQuery,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: escapedQuery,
              $options: "i",
            },
          },
          {
            email: {
              $regex: escapedQuery,
              $options: "i",
            },
          },
        ],
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json(members);
  } catch (error) {
    console.error(
      "Search frequent flyers error:",
      error.message
    );

    return res.status(500).json({
      error: "Failed to search frequent flyers",
    });
  }
});


// =================================
// GET SINGLE MEMBER
// =================================

router.get("/:id", async (req, res) => {
  try {
    const member =
      await FrequentFlyer.findById(
        req.params.id
      );

    if (!member) {
      return res.status(404).json({
        error: "Frequent flyer not found",
      });
    }

    return res.status(200).json(member);
  } catch {
    return res.status(404).json({
      error: "Frequent flyer not found",
    });
  }
});


// =================================
// UPDATE MEMBER
// =================================

router.put("/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      membershipTier,
      miles,
      status,
    } = req.body;

    if (
      membershipTier &&
      !VALID_TIERS.includes(
        membershipTier
      )
    ) {
      return res.status(400).json({
        error: "Invalid membership tier",
      });
    }

    if (
      status &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        error: "Invalid member status",
      });
    }

    if (
      email &&
      !isValidEmail(email)
    ) {
      return res.status(400).json({
        error: "Invalid email address",
      });
    }

    if (
      miles !== undefined &&
      (typeof miles !== "number" ||
        miles < 0)
    ) {
      return res.status(400).json({
        error:
          "Miles must be a non-negative number",
      });
    }

    const updateData = {};

    if (firstName !== undefined) {
      updateData.firstName =
        sanitizeText(firstName);
    }

    if (lastName !== undefined) {
      updateData.lastName =
        sanitizeText(lastName);
    }

    if (email !== undefined) {
      updateData.email =
        sanitizeText(email);
    }

    if (phone !== undefined) {
      updateData.phone =
        sanitizeText(phone);
    }

    if (membershipTier !== undefined) {
      updateData.membershipTier =
        membershipTier;
    }

    if (miles !== undefined) {
      updateData.miles = miles;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const member =
      await FrequentFlyer.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!member) {
      return res.status(404).json({
        error: "Frequent flyer not found",
      });
    }

    console.log(
      "[Analytics] User interacted with End-to-End Frequent Flyer Portal"
    );

    return res.status(200).json(member);
  } catch (error) {
    console.error(
      "Update frequent flyer error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(409).json({
        error:
          "A frequent flyer with this email already exists",
      });
    }

    return res.status(500).json({
      error: "Failed to update frequent flyer",
    });
  }
});


module.exports = router;