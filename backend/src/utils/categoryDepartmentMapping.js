function getDepartmentKeyForCategory(category) {
  if (!category) return null;

  const normalized = String(category).trim().toLowerCase();

  const map = {
    "garbage overflow": "Garbage Department",
    "potholes": "Road Department",
    "pothole": "Road Department",
    "water leakage": "Water Department",
    "streetlight failure": "Electrical Department",
    "streetlight issue": "Electrical Department",
    "drainage blockage": "Drainage Department",
    "road damage": "Road Department"
  };

  return map[normalized] || null;
}

module.exports = { getDepartmentKeyForCategory };
