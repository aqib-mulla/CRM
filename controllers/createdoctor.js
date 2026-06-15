import doctorDetail from "../models/CreateDoctor.js"
import doctorSchedule from "../models/doctorSchedule.js";

import Appointment from "../models/appointment.js";
import PatientReg from "../models/PatientReg.js";


export const createdoctor = async(req, res) => {

    try {
        console.log(req.body)
        const { doctorDetails } = req.body;
        const {docId, drName, drGender, drEmail, drNum, drAddress  } = doctorDetails;
        const doctor = new doctorDetail({docId, drName, drGender, drEmail, drNum, drAddress});
        // console.log('Doctor object:', doctor);
        const doctorSaved = await doctor.save();
        res.status(201).json(doctorSaved);
    } catch (err) {
      res.status(500).json("error :" , err);
    }
}



export const getdoctor = async(req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const doctors = await doctorDetail.find();
        // console.log('Fetched tests:', doctors);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
}


export const updatedoctor = async(req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const doctors = await doctorDetail.find(_id);
        // console.log('Fetched tests:', doctors);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
}

export const getDoctorById = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    try {
        const doctorId = req.params.id; // Get the doctor id from the route parameter
        const doctor = await doctorDetail.findById(doctorId); // Use findById to fetch a doctor by id
        // console.log('Fetched doctor:', doctor);
        
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        res.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Failed to fetch doctor' });
    }
}


export const updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const updatedData = req.body;
    // console.log(updatedData);

    try {
        const updatedDoctor = await doctorDetail.findByIdAndUpdate(
            doctorId,
            updatedData,
            { new: true }
        );

        res.json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ error: 'Error updating doctor' });
    }
};


export const deleteDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const deletedDoctor = await doctorDetail.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor' });
  }
};



export const savePatient = async (req, res) => {
    try {

        const lastPatient =
            await PatientReg.findOne()
                .sort({ pId: -1 });

        const pId =
            lastPatient
                ? lastPatient.pId + 1
                : 1;

        const patient =
            await PatientReg.create({
                ...req.body,
                pId
            });

        res.json(patient);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

export const searchPatient = async (req, res) => {
    try {
        const { search } = req.query;

        const patients = await PatientReg.find({
            $or: [
                {
                    pName: { $regex: search, $options: "i" }
                },
                {
                    pNum: Number(search) || 0
                }
            ]
        })
        .populate("doctorName")   // 🔥 IMPORTANT FIX
        .limit(20);

        res.json(patients);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const saveDoctorSchedule = async (req, res) => {
  try {

    const { doctorId, schedule } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor is required"
      });
    }

    const existingSchedule =
      await doctorSchedule.findOne({
        doctorId
      });

    if (existingSchedule) {

      existingSchedule.schedule = schedule;

      await existingSchedule.save();

      return res.status(200).json({
        success: true,
        message: "Schedule Updated Successfully"
      });
    }

    await doctorSchedule.create({
      doctorId,
      schedule
    });

    res.status(201).json({
      success: true,
      message: "Schedule Saved Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



export const getAvailableSlots = async (req, res) => {

    try {

        const { doctorId, date } = req.params;
        const schedule =
            await doctorSchedule.findOne({
                doctorId
            });

        if (!schedule)
            return res.json([]);

        const dayName =
            new Date(date)
                .toLocaleDateString(
                    "en-US",
                    { weekday: "long" }
                );

        const daySchedule =
            schedule.schedule.find(
                x =>
                    x.day === dayName &&
                    x.isActive
            );

        if (!daySchedule)
            return res.json([]);

        const slots = [];

        let current =
            new Date(
                `2000-01-01 ${daySchedule.startTime}`
            );

        let end =
            new Date(
                `2000-01-01 ${daySchedule.endTime}`
            );

        while (current < end) {

            slots.push(
                current.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }
                )
            );

            current.setMinutes(
                current.getMinutes() +
                daySchedule.slotDuration
            );
        }

        const booked =
            await Appointment.find({
                doctorId,
                appointmentDate: date
            });

        const bookedSlots =
            booked.map(
                x => x.appointmentTime
            );

        const available =
            slots.filter(
                x => !bookedSlots.includes(x)
            );

        res.json(available);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }
};

export const bookAppointment = async (req, res) => {

    try {

        console.log("Request Body:", req.body);

        const exists = await Appointment.findOne({
            doctorId: req.body.doctorId,
            appointmentDate: req.body.appointmentDate,
            appointmentTime: req.body.appointmentTime
        });

        console.log("Existing Appointment:", exists);

        if (exists) {
            return res.status(400).json({
                message: "Slot already booked"
            });
        }

        const appointment =
            await Appointment.create(req.body);

        res.status(200).json({
            message: "Appointment Booked",
            appointment
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }
};

// export const getAppointmentsCalendar = async (req, res) => {

//     try {

//         const appointments =
//             await Appointment
//                 .find()
//                 .populate("doctorId")
//                 .populate("patientId");

//         res.json(appointments);

//     } catch (error) {

//         console.log(error);

//         res.status(500).json(error);

//     }
// };

export const getAppointmentsCalendar = async (req, res) => {

    try {

        const { doctorId } = req.params;

        const filter = {};

        if (
            doctorId &&
            doctorId !== "all"
        ) {
            filter.doctorId = doctorId;
        }

        const appointments =
            await Appointment
                .find(filter)
                .populate("doctorId")
                .populate("patientId");

        res.json(appointments);

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};


export const getAppointments = async (req, res) => {
  try {
    const data = await Appointment.find()
      .populate("doctorId")
      .populate("patientId")
      .sort({ appointmentDate: 1 });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { appointmentDate, appointmentTime },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const downloadAppointmentReport = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { fromDate, toDate } = req.query;

    const filter = {};

    // ---------------- DOCTOR FILTER ----------------
    if (doctorId && doctorId !== "all") {
      filter.doctorId = doctorId;
    }

    // ---------------- DATE FILTER (FIXED) ----------------
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      filter.appointmentDate = {
        $gte: start,
        $lte: end,
      };
    }

    const data = await Appointment.find(filter)
      .populate("doctorId")
      .populate("patientId")
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

    return res.status(200).json(data);

  } catch (error) {
    console.error("Appointment Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

export default createdoctor