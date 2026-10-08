import Pet from "../models/Pet.js";

// Default initial pets seed list for when database is empty
export const DEFAULT_INITIAL_PETS = [
  { petId: "DOG-101", name: "Labrador", breed: "Labrador Retriever", type: "Dog", age: "3 years", gender: "Male", size: "Large", img: "/dog1.jpg", status: "available", description: "Friendly, gentle, and loves playing fetch with balls." },
  { petId: "DOG-102", name: "German Shepherd", breed: "German Shepherd", type: "Dog", age: "2 years", gender: "Male", size: "Large", img: "/dog2.jpg", status: "available", description: "Loyal, intelligent, alert, and great family companion." },
  { petId: "DOG-103", name: "Beagle", breed: "Beagle", type: "Dog", age: "4 years", gender: "Female", size: "Medium", img: "/dog3.jpg", status: "pending", description: "Curious, cheerful, and loves social outdoor walks." },
  { petId: "DOG-104", name: "Bulldog", breed: "English Bulldog", type: "Dog", age: "3 years", gender: "Male", size: "Medium", img: "/dog4.jpg", status: "available", description: "Calm, affectionate, and happiest napping on rugs." },
  { petId: "DOG-105", name: "Poodle", breed: "Standard Poodle", type: "Dog", age: "2 years", gender: "Female", size: "Medium", img: "/dog5.jpg", status: "available", description: "Highly intelligent, hypoallergenic coat, eager to learn tricks." },
  { petId: "DOG-106", name: "Golden Retriever", breed: "Golden Retriever", type: "Dog", age: "1 year", gender: "Male", size: "Large", img: "/dog6.jpg", status: "available", description: "Playful puppy-like spirit, friendly with all kids & animals." },
  { petId: "CAT-101", name: "Persian Cat", breed: "Persian", type: "Cat", age: "2 years", gender: "Female", size: "Small", img: "/cat1.jpg", status: "available", description: "Quiet, sweet-tempered, and enjoys gentle brushing sessions." },
  { petId: "CAT-102", name: "Siamese Cat", breed: "Siamese", type: "Cat", age: "1.5 years", gender: "Male", size: "Small", img: "/cat2.jpg", status: "available", description: "Vocal, affectionate, and loves perching on high shelves." },
  { petId: "CAT-103", name: "Maine Coon", breed: "Maine Coon", type: "Cat", age: "3 years", gender: "Male", size: "Large", img: "/cat3.jpg", status: "available", description: "Gentle giant with fluffy tail, calm and friendly demeanor." },
  { petId: "CAT-104", name: "British Shorthair", breed: "British Shorthair", type: "Cat", age: "2 years", gender: "Female", size: "Medium", img: "/cat4.jpg", status: "available", description: "Easygoing, plush coat, and loves relaxing near windows." },
  { petId: "CAT-105", name: "Ragdoll", breed: "Ragdoll", type: "Cat", age: "3 years", gender: "Female", size: "Medium", img: "/cat5.jpg", status: "available", description: "Relaxed, loving, goes limp in your arms when cuddled." },
];

// @desc    Get all pets (with optional filtering by type, status, breed, search)
// @route   GET /api/pets
// @access  Public
export const getPets = async (req, res) => {
  try {
    const { type, status, search, gender, size } = req.query;
    const filter = {};

    if (type && type !== "all") {
      filter.type = new RegExp(`^${type}$`, "i");
    }
    if (status && status !== "all") {
      filter.status = status;
    }
    if (gender && gender !== "all") {
      filter.gender = gender;
    }
    if (size && size !== "all") {
      filter.size = size;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } },
        { petId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let pets = [];
    try {
      pets = await Pet.find(filter).sort({ createdAt: -1 }).lean();

      if (pets.length === 0 && Object.keys(filter).length === 0) {
        const count = await Pet.countDocuments();
        if (count === 0) {
          await Pet.insertMany(DEFAULT_INITIAL_PETS);
          pets = await Pet.find().sort({ createdAt: -1 }).lean();
        }
      }
    } catch {
      // Fallback in-memory filtering if database disconnected
      pets = DEFAULT_INITIAL_PETS.filter((p) => {
        if (type && type !== "all" && p.type.toLowerCase() !== type.toLowerCase()) return false;
        if (status && status !== "all" && p.status !== status) return false;
        if (gender && gender !== "all" && p.gender !== gender) return false;
        if (size && size !== "all" && p.size !== size) return false;
        if (search) {
          const s = search.toLowerCase();
          const match = p.name.toLowerCase().includes(s) || p.breed.toLowerCase().includes(s) || p.petId.toLowerCase().includes(s);
          if (!match) return false;
        }
        return true;
      });
    }

    return res.status(200).json({
      ok: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// @desc    Get single pet by ID or petId
// @route   GET /api/pets/:id
// @access  Public
export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    let pet = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      pet = await Pet.findById(id).lean();
    }
    if (!pet) {
      pet = await Pet.findOne({ petId: id.toUpperCase() }).lean();
    }

    if (!pet) {
      return res.status(404).json({ ok: false, error: "Pet not found" });
    }

    return res.status(200).json({ ok: true, data: pet });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// @desc    Create new pet (Admin only)
// @route   POST /api/pets
// @access  Private (Admin)
export const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, size, img, description, status, vaccinated, neutered } = req.body;

    if (!name || !type || !breed || !age) {
      return res.status(400).json({
        ok: false,
        error: "Please provide pet name, type (Dog/Cat), breed, and age.",
      });
    }

    const prefix = type.toLowerCase() === "dog" ? "DOG" : type.toLowerCase() === "cat" ? "CAT" : "PET";
    const customId = req.body.petId || `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const newPet = await Pet.create({
      petId: customId,
      name: name.trim(),
      type: type.trim(),
      breed: breed.trim(),
      age: age.trim(),
      gender: gender || "Male",
      size: size || "Medium",
      img: img || (type.toLowerCase() === "cat" ? "/cat1.jpg" : "/dog1.jpg"),
      description: description || "Looking for a loving forever home.",
      status: status || "available",
      vaccinated: vaccinated !== undefined ? vaccinated : true,
      neutered: neutered !== undefined ? neutered : true,
    });

    return res.status(201).json({
      ok: true,
      message: "Pet profile created successfully",
      data: newPet,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
};

// @desc    Update pet profile or status (Admin only)
// @route   PUT /api/pets/:id
// @access  Private (Admin)
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Pet.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ ok: false, error: "Pet not found" });
    }

    return res.status(200).json({
      ok: true,
      message: "Pet updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
};

// @desc    Delete pet profile (Admin only)
// @route   DELETE /api/pets/:id
// @access  Private (Admin)
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Pet.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Pet not found" });
    }

    return res.status(200).json({
      ok: true,
      message: "Pet profile deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};
