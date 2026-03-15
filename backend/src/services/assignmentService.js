const Issue = require("../models/Issue");
const Worker = require("../models/Worker");
const Notification = require("../models/Notification");

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {number} lat1 Latitude of point 1 in decimal degrees
 * @param {number} lon1 Longitude of point 1 in decimal degrees
 * @param {number} lat2 Latitude of point 2 in decimal degrees
 * @param {number} lon2 Longitude of point 2 in decimal degrees
 * @returns {number} Distance in kilometers
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Automatically assigns a newly created issue to the nearest eligible worker.
 * 
 * @param {mongoose.Types.ObjectId | string} issueId The ID of the issue to assign
 * @returns {Promise<Object>} The updated issue document
 */
async function autoAssignWorker(issueId) {
  try {
    const issue = await Issue.findById(issueId);
    if (!issue) throw new Error("Issue not found");

    if (issue.assignedWorkerId) {
       return issue; // Already assigned
    }

    // 1. Find all active workers within the identical civic department
    const candidateWorkers = await Worker.find({ departmentId: issue.departmentId });

    if (!candidateWorkers || candidateWorkers.length === 0) {
      console.log(`No workers found for department ${issue.departmentId}`);
      return issue; // Status remains Submitted
    }

    let nearestWorker = null;
    let shortestDistance = Infinity;

    // 2. Iterate and locate the closest valid worker geometry
    for (const worker of candidateWorkers) {
      const distance = getDistanceFromLatLonInKm(
        issue.location.lat,
        issue.location.lng,
        worker.location.lat,
        worker.location.lng
      );

      // 3. Check if the issue is physically within the worker's operational radius limit
      if (distance <= worker.serviceRadiusKm) {
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestWorker = worker;
        }
      }
    }

    // 4. Finalize Assignment
    if (nearestWorker) {
      issue.assignedWorkerId = nearestWorker._id;
      issue.status = "Assigned";
      await issue.save();
      
      // Dispatch Notification
      await Notification.create({
        citizenId: issue.citizenId,
        issueId: issue._id,
        message: "Your issue has been automatically assigned to a field worker in your area."
      });
      
      console.log(`Auto-assigned Issue ${issueId} to Worker ${nearestWorker._id} (Distance: ${shortestDistance.toFixed(2)}km)`);
    } else {
       console.log(`No workers within operational radius found for Issue ${issueId}. Kept unassigned.`);
    }

    return issue;

  } catch (err) {
    console.error("Auto-Assignment Error:", err);
    throw err;
  }
}

module.exports = {
  autoAssignWorker,
  getDistanceFromLatLonInKm
};
