import Prescription from "../models/prescriptionModel.js";
import PatientReg from "../models/PatientReg.js";
import HTMLToPDF from './htmlPf.js';
import Bill from "../models/Bill.js";
import fs from 'fs';
import doctorDetail from "../models/CreateDoctor.js";

// export const savePresription = async (req, res) => {

//     try {
//         const { patientId, content } = req.body;

//         // Save the prescription to the database
//         const newPrescription = new Prescription({
//           patientId,
//           content,
//         });

//         const savedPrescription = await newPrescription.save();

//         res.json(savedPrescription);
//       } catch (error) {
//         console.error('Error saving prescription:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const { patientId, content } = req.body;

//         // Check if there is an existing prescription for the patient
//         const existingPrescription = await Prescription.findOne({ patientId });

//         if (existingPrescription) {
//             // Update the existing prescription
//             existingPrescription.content = content;
//             const updatedPrescription = await existingPrescription.save();
//             res.json(updatedPrescription);
//         } else {
//             // Save a new prescription to the database
//             const newPrescription = new Prescription({
//                 patientId,
//                 content,
//             });

//             const savedPrescription = await newPrescription.save();
//             res.json(savedPrescription);
//         }
//     } catch (error) {
//         console.error('Error saving/updating prescription:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const { patientId, billId,content } = req.body;

//         // Create a new prescription for the patient
//         const newPrescription = new Prescription({
//             patientId,
//             billId,
//             content,
//         });

//         // Save the new prescription to the database
//         const savedPrescription = await newPrescription.save();
//         res.json(savedPrescription);
//     } catch (error) {
//         console.error('Error saving prescription:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const { patientId, billId,billNO, content } = req.body;

//         // Check if a prescription already exists for the given patientId
//         const existingPrescription = await Prescription.findOne({ patientId });

//         if (existingPrescription) {
//             // Update the existing prescription
//             existingPrescription.billId = billId;
//             existingPrescription.content = content;
//             const updatedPrescription = await existingPrescription.save();
//             res.json(updatedPrescription);
//         } else {
//             // Create a new prescription for the patient
//             const newPrescription = new Prescription({
//                 patientId,
//                 billId,
//                 billNO,
//                 content,
//             });
//             const savedPrescription = await newPrescription.save();
//             res.json(savedPrescription);
//         }
//     } catch (error) {
//         console.error('Error saving prescription:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const {
//             patientId,
//             billId,
//             billNO,
//             content,
//             bloodPressure,
//             heartRate,
//             temperature,
//             respiratoryRate,
//             height,
//             weight,
//             complaints,
//             clinicalFindings,
//             diagnosis,
//             knownDiagnosis,
//         } = req.body;

//         // Check if a prescription already exists for the given patientId
//         const existingPrescription = await Prescription.findOne({ patientId });

//         if (existingPrescription) {
//             // Update the existing prescription
//             existingPrescription.billId = billId;
//             existingPrescription.billNO = billNO;
//             existingPrescription.content = content;
//             existingPrescription.bloodPressure = bloodPressure;
//             existingPrescription.heartRate = heartRate;
//             existingPrescription.temperature = temperature;
//             existingPrescription.respiratoryRate = respiratoryRate;
//             existingPrescription.height = height;
//             existingPrescription.weight = weight;
//             existingPrescription.complaints = complaints;
//             existingPrescription.clinicalFindings = clinicalFindings;
//             existingPrescription.diagnosis = diagnosis;
//             existingPrescription.knownDiagnosis = knownDiagnosis;

//             const updatedPrescription = await existingPrescription.save();
//             res.json(updatedPrescription);
//         } else {
//             // Create a new prescription for the patient
//             const newPrescription = new Prescription({
//                 patientId,
//                 billId,
//                 billNO,
//                 content,
//                 bloodPressure,
//                 heartRate,
//                 temperature,
//                 respiratoryRate,
//                 height,
//                 weight,
//                 complaints,
//                 clinicalFindings,
//                 diagnosis,
//                 knownDiagnosis,
//             });

//             const savedPrescription = await newPrescription.save();
//             res.json(savedPrescription);
//         }
//     } catch (error) {
//         console.error('Error saving prescription:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const {
//             patientId,
//             billId,
//             billNO,
//             content,
//             vitals, 
//             complaints,
//             clinicalFindings,
//             diagnosis,
//             knownDiagnosis,
//         } = req.body;

//         const {
//             bloodPressure,
//             heartRate,
//             temperature,
//             respiratoryRate,
//             height,
//             weight,
//         } = vitals; 

//         // Check if a prescription already exists for the given patientId
//         const existingPrescription = await Prescription.findOne({ patientId });

//         if (existingPrescription) {
//             // Update the existing prescription with new vitals and other data
//             existingPrescription.billId = billId;
//             existingPrescription.billNO = billNO;
//             existingPrescription.content = content;
//             existingPrescription.bloodPressure = bloodPressure;
//             existingPrescription.heartRate = heartRate;
//             existingPrescription.temperature = temperature;
//             existingPrescription.respiratoryRate = respiratoryRate;
//             existingPrescription.height = height;
//             existingPrescription.weight = weight;
//             existingPrescription.complaints = complaints;
//             existingPrescription.clinicalFindings = clinicalFindings;
//             existingPrescription.diagnosis = diagnosis;
//             existingPrescription.knownDiagnosis = knownDiagnosis;

//             const updatedPrescription = await existingPrescription.save();
//             res.json(updatedPrescription);
//         } else {
//             const newPrescription = new Prescription({
//                 patientId,
//                 billId,
//                 billNO,
//                 content,
//                 bloodPressure,
//                 heartRate,
//                 temperature,
//                 respiratoryRate,
//                 height,
//                 weight,
//                 complaints,
//                 clinicalFindings,
//                 diagnosis,
//                 knownDiagnosis,
//             });

//             const savedPrescription = await newPrescription.save();
//             res.json(savedPrescription);
//         }
//     } catch (error) {
//         console.error('Error saving prescription:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const {
//             patientId,
//             billId,
//             billNO,
//             content,
//             complaints,
//             clinicalFindings,
//             diagnosis,
//             knownDiagnosis,
//             selectedTests,
//             vitals,
//         } = req.body;

//         const {
//             bloodPressure,
//             heartRate,
//             temperature,
//             respiratoryRate,
//             height,
//             weight,
//         } = vitals;

//         // Process selectedTests to extract testName
//         const formattedTests = selectedTests.map(test => ({
//             testId: test._id,
//             testName: test.name || test.groupName // Store name or groupName
//         }));

//         // Check if a prescription already exists for the given patientId
//         const existingPrescription = await Prescription.findOne({ patientId });

//         if (existingPrescription) {
//             // Update the existing prescription
//             existingPrescription.billId = billId;
//             existingPrescription.billNO = billNO;
//             existingPrescription.content = content;
//             existingPrescription.bloodPressure = bloodPressure;
//             existingPrescription.heartRate = heartRate;
//             existingPrescription.temperature = temperature;
//             existingPrescription.respiratoryRate = respiratoryRate;
//             existingPrescription.height = height;
//             existingPrescription.weight = weight;
//             existingPrescription.complaints = complaints;
//             existingPrescription.clinicalFindings = clinicalFindings;
//             existingPrescription.diagnosis = diagnosis;
//             existingPrescription.knownDiagnosis = knownDiagnosis;

//             // Save the processed selectedTests in the prescription
//             existingPrescription.selectedTests = formattedTests;

//             const updatedPrescription = await existingPrescription.save();
//             return res.json(updatedPrescription);
//         } else {
//             // Create a new prescription for the patient
//             const newPrescription = new Prescription({
//                 patientId,
//                 billId,
//                 billNO,
//                 content,
//                 bloodPressure,
//                 heartRate,
//                 temperature,
//                 respiratoryRate,
//                 height,
//                 weight,
//                 complaints,
//                 clinicalFindings,
//                 diagnosis,
//                 knownDiagnosis,
//                 selectedTests: formattedTests, // Store formatted tests
//             });

//             const savedPrescription = await newPrescription.save();
//             return res.json(savedPrescription);
//         }
//     } catch (error) {
//         console.error('Error saving prescription:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const {
//             patientId,
//             billId,
//             billNO,
//             content,
//             complaints,
//             clinicalFindings,
//             diagnosis,
//             knownDiagnosis,
//             selectedTests,
//             vitals,
//             medicines,
//             doctorName
//         } = req.body;

//         const {
//             bloodPressure,
//             heartRate,
//             temperature,
//             respiratoryRate,
//             height,
//             weight,
//         } = vitals;

//         // Validate required medicine fields
//         if (medicines && medicines.some(med => !med.medicineName || !med.composition)) {
//             return res.status(400).json({ error: "Medicine name and composition are required" });
//         }

//         // Process selectedTests with additional fields
//         const formattedTests = selectedTests.map(test => ({
//             testId: test._id,
//             testName: test.name || test.groupName || test.profileName || test.feesName,
//         }));

//         // Find existing prescription
//         const existingPrescription = await Prescription.findOne({ patientId });

//         if (existingPrescription) {
//             // Update existing prescription
//             existingPrescription.set({
//                 billId,
//                 billNO,
//                 content,
//                 bloodPressure,
//                 heartRate,
//                 temperature,
//                 respiratoryRate,
//                 height,
//                 weight,
//                 complaints,
//                 clinicalFindings,
//                 diagnosis,
//                 knownDiagnosis,
//                 medicines,
//                 doctorName,
//                 selectedTests: formattedTests
//             });

//             const updatedPrescription = await existingPrescription.save();
//             return res.json(updatedPrescription);
//         } else {
//             // Create new prescription
//             const newPrescription = new Prescription({
//                 patientId,
//                 billId,
//                 billNO,
//                 content,
//                 bloodPressure,
//                 heartRate,
//                 temperature,
//                 respiratoryRate,
//                 height,
//                 weight,
//                 complaints,
//                 clinicalFindings,
//                 diagnosis,
//                 knownDiagnosis,
//                 medicines,
//                 doctorName,
//                 selectedTests: formattedTests
//             });

//             const savedPrescription = await newPrescription.save();
//             return res.json(savedPrescription);
//         }
//     } catch (error) {
//         console.error('Error saving prescription:', error);
//         return res.status(500).json({
//             error: 'Internal Server Error',
//             message: error.message
//         });
//     }
// };

// export const savePrescription = async (req, res) => {
//     try {
//         const {
//             patientId,
//             billId,
//             content,
//             complaints,
//             clinicalFindings,
//             diagnosis,
//             knownDiagnosis,
//             selectedTests,
//             vitals,
//             medicines,
//             doctorName
//         } = req.body;

//         const {
//             bloodPressure,
//             heartRate,
//             temperature,
//             respiratoryRate,
//             height,
//             weight,
//         } = vitals;

//         // Validate required medicine fields
//         if (medicines && medicines.some(med => !med.medicineName || !med.composition)) {
//             return res.status(400).json({ error: "Medicine name and composition are required" });
//         }

//         // Process selectedTests with additional fields
//         const formattedTests = selectedTests.map(test => ({
//             testId: test._id,
//             testName: test.name || test.groupName || test.profileName || test.feesName,
//         }));

//         // Find the last billNO
//         const lastPrescription = await Prescription.findOne().sort({ billNO: -1 }).limit(1);
//         const billNO = lastPrescription ? Number(lastPrescription.billNO) + 1 : 1; // If no prescription exists, start with 1

//         // Find existing prescription
//         const existingPrescription = await Prescription.findOne({ patientId });

//         if (existingPrescription) {
//             // Update existing prescription
//             existingPrescription.set({
//                 billId,
//                 billNO, // Use the incremented billNO
//                 content,
//                 bloodPressure,
//                 heartRate,
//                 temperature,
//                 respiratoryRate,
//                 height,
//                 weight,
//                 complaints,
//                 clinicalFindings,
//                 diagnosis,
//                 knownDiagnosis,
//                 medicines,
//                 doctorName,
//                 selectedTests: formattedTests
//             });

//             const updatedPrescription = await existingPrescription.save();
//             return res.json(updatedPrescription);
//         } else {
//             // Create new prescription
//             const newPrescription = new Prescription({
//                 patientId,
//                 billId,
//                 billNO, // Use the incremented billNO
//                 content,
//                 bloodPressure,
//                 heartRate,
//                 temperature,
//                 respiratoryRate,
//                 height,
//                 weight,
//                 complaints,
//                 clinicalFindings,
//                 diagnosis,
//                 knownDiagnosis,
//                 medicines,
//                 doctorName,
//                 selectedTests: formattedTests
//             });

//             const savedPrescription = await newPrescription.save();
//             return res.json(savedPrescription);
//         }
//     } catch (error) {
//         console.error('Error saving prescription:', error);
//         return res.status(500).json({
//             error: 'Internal Server Error',
//             message: error.message
//         });
//     }
// };

export const savePrescription = async (req, res) => {
    try {
        const {
            patientId,
            billId,
            content,
            complaints,
            clinicalFindings,
            diagnosis,
            knownDiagnosis,
            selectedTests,
            vitals,
            medicines,
            doctorName
        } = req.body;

        const {
            bloodPressure,
            heartRate,
            temperature,
            respiratoryRate,
            height,
            weight,
        } = vitals;

        // Validate required medicine fields
        if (medicines && medicines.some(med => !med.medicineName)) {
            return res.status(400).json({ error: "Medicine name and composition are required" });
        }

        // Process selectedTests with additional fields
        const formattedTests = selectedTests.map(test => ({
            testId: test._id,
            testName: test.name || test.groupName || test.profileName || test.feesName,
        }));

        // Find the last billNO
        const lastPrescription = await Prescription.findOne().sort({ billNO: -1 }).limit(1);
        const billNO = lastPrescription ? Number(lastPrescription.billNO) + 1 : 1; // If no prescription exists, start with 1

        // Find existing prescription
        const existingPrescription = await Prescription.findOne({ billNO });

        if (existingPrescription) {
            // Update existing prescription
            existingPrescription.set({
                billId,
                billNO, // Use the incremented billNO
                content,
                bloodPressure,
                heartRate,
                temperature,
                respiratoryRate,
                height,
                weight,
                complaints,
                clinicalFindings,
                diagnosis,
                knownDiagnosis,
                medicines,
                doctorName,
                selectedTests: formattedTests
            });

            const updatedPrescription = await existingPrescription.save();
            return res.json(updatedPrescription);
        } else {
            // Create new prescription
            const newPrescription = new Prescription({
                patientId,
                billId,
                billNO, // Use the incremented billNO
                content,
                bloodPressure,
                heartRate,
                temperature,
                respiratoryRate,
                height,
                weight,
                complaints,
                clinicalFindings,
                diagnosis,
                knownDiagnosis,
                medicines,
                doctorName,
                selectedTests: formattedTests
            });

            const savedPrescription = await newPrescription.save();
            return res.json(savedPrescription);
        }
    } catch (error) {
        console.error('Error saving prescription:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};


export const getPrescription = async (req, res) => {

    try {
        const patientId = req.params.patientId;

        // Fetch prescriptions based on the patient ID
        const prescriptions = await Prescription.find({ patientId });

        res.json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getPrescriptionList = async (req, res) => {

    try {

        const patientId = req.params.patientId;
        const prescriptions = await Prescription.find({ billId: patientId })
            .populate('billId', 'pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// export const printPrescription = async (req, res) => {
//     try {
//         const { patientId } = req.params;

//         // Fetch the prescription content based on patientId from the database
//         const prescription = await Prescription.findOne({ patientId });
//         const prescriptionContent = prescription.content;

//         // Launch a headless browser
//         const browser = await puppeteer.launch({
//             executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe',
//         });

//         const page = await browser.newPage();

//         // Set the content of the page to the prescription
//         await page.setContent(`<html><body>${prescriptionContent}</body></html>`);

//         // Generate PDF
//         const pdfBuffer = await page.pdf({ format: 'A4' });

//         // Close the browser
//         await browser.close();

//         // Serve the PDF as a response
//         res.contentType('application/pdf');
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating prescription PDF:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



// export const printPrescription = async (req, res) => {
//     try {
//         const { patientId } = req.params;

//         // Fetch the prescription content based on patientId from the database
//         const prescription = await Prescription.findOne({ patientId });
//         const prescriptionContent = prescription.content;

//         // Fetch clinic details (replace this with your actual logic to get clinic details)
//         const clinicDetails = {
//             logo: 'path/to/clinic-logo.png',
//             name: 'MH CLINIC',
//             address: ' 46/4, Hosur Rd, Kudlu Gate, Krishna Reddy Industrial Area, H.S, R Extension, Bengaluru, Karnataka 560068',
//         };

//         // Fetch patient details from PatientReg model
//         const patientDetails = await PatientReg.findOne({ _id: patientId })
//         .populate('doctorName', 'drName')
//         .exec();

//         // console.log(patientDetails);

//         // Launch a headless browser
//         const browser = await puppeteer.launch({
//             executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe',
//         });

//         const page = await browser.newPage();

//         // Set the content of the page with clinic, patient, and prescription details
//         await page.setContent(`
//             <html>
//                 <head>
//                 <style>
//                 /* Add any styling needed for your prescription here */
//                 table {
//                     width: 100%;
//                 }
//                 .clinic-details img {
//                     width: 100px;
//                 }
//             </style>
//                 </head>
//                 <body>
//                 <table>
//                 <tr>
//                     <td class="clinic-details" >
//                         <img src="${clinicDetails.logo}" alt="Clinic Logo">
//                     </td>
//                     <td class="clinic-details">
//                         <h2>${clinicDetails.name}</h2>
//                     </td>
//                     <td class="clinic-details">
//                         <p>${clinicDetails.address}</p>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td  style="width: 50%; text-align: left;">
//                     Patient Name: ${patientDetails.pSalutation} ${patientDetails.pName}<br>
//                     Sex / Age:  ${patientDetails.pGender} / ${patientDetails.pAge}<br>
//                     Referred By:  ${patientDetails.doctorName.drName}</p>
//                     </td>
//                     <td class="clinic-details">

//                     </td>
//                 </tr>
//                 </table>
//                     <div class="prescription-details">${prescriptionContent}</div>
//                 </body>
//             </html>`);

//         // Generate PDF
//         const pdfBuffer = await page.pdf({ format: 'A4' });

//         // Close the browser
//         await browser.close();

//         // Serve the PDF as a response
//         res.contentType('application/pdf');
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating prescription PDF:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const printPrescription = async (req, res) => {
//     try {
//         const { patientId } = req.params;
//         console.log(patientId);
//         // Fetch the prescription content based on patientId from the database
//         const prescription = await Prescription.findOne({ patientId });
//         const prescriptionContent = prescription.content;
//         const prescriptionDate = prescription.createdAt;

//         // Fetch patient details from PatientReg model
//         // const patientDetails = await PatientReg.findOne({ _id: patientId })
//         //     .populate('doctorName', 'drName')
//         //     .exec();

//         // Fetch bill details based on patientId
//         const bill = await Bill.findOne({ _id: patientId })
//             .populate('refId', 'pId pName pNum pAge pGender pSalutation')
//             .populate('doctorName', 'drName')
//             .exec();

//         const billId = bill ? bill.billId : "";

//         // Format the bill date
//         const formattedBillDate = new Date(prescriptionDate).toLocaleDateString();

//         // Define the HTML content with formatted bill date and horizontal line
//         const htmlContent = `
//          <div style="text-align: center;">
//             <span style="font-weight: bold; font-size: 30px;">Care Conquer</span> <br> <br>
//             <span>46/4, Hosur Rd, Kudlu Gate, Krishna Reddy Industrial Area, H.S</span><br>
//             <span>, R Extension, Bengaluru, Karnataka 560068</span><br>
//             <span>Email: careconqueronline@gmail.com</span><br>
//             <span>PH: 8574968523 </span>
//             <h5 style="text-align:center">PRESCRIPTION</h5>
//             <hr style="border-top: 1px solid #000; margin: 0;">
//         </div>
//             <html>
//                 <head>
//                     <style>
//                         table {
//                             width: 100%;
//                         }
//                     </style>
//                 </head>
//                 <body>
//                     <table>
//                         <tr>
//                             <td style="width: 80%; text-align: left;">
//                                 Patient Name: <strong>${bill.refId.pSalutation} ${bill.refId.pName}</strong><br>
//                                   <div style="margin-bottom: 8px;"></div>
//                                 Sex / Age:<strong> ${bill.refId.pGender} / ${bill.refId.pAge}</strong><br>
//                                   <div style="margin-bottom: 8px;"></div>
//                                 Referred By:<strong> ${bill.doctorName.drName}</strong>
//                             </td>
//                             <td style="width: 50%; text-align: left;">
//                                 Patient ID: <strong> ${bill.refId.pId} </strong><br>
//                             <div style="margin-bottom: 8px;"></div>
//                                 Bill ID: <strong>${billId}</strong><br>
//                                  <div style="margin-bottom: 8px;"></div>
//                                 Date:<strong> ${formattedBillDate}</strong>
//                             </td>
//                         </tr>
//                     </table>
//                     <hr style="border-top: 1px solid #000; margin: 0;">
//                     <div class="prescription-details">${prescriptionContent}</div>
//                 </body>
//             </html>`;

//         // Instantiate WHHTMLToPDF and generate the PDF
//         const pdfGenerator = new HTMLToPDF();
//         const pdfBuffer = await pdfGenerator.generatePDF(htmlContent);

//         // Serve the PDF as a response
//         res.contentType('application/pdf');
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating prescription PDF:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const printPrescription = async (req, res) => {
//     try {
//         const { patientId } = req.params;

//         // Fetch prescription details
//         const prescription = await Prescription.findOne({ patientId });
//         if (!prescription) {
//             return res.status(404).json({ error: 'Prescription not found' });
//         }

//         const prescriptionContent = prescription.content;
//         const prescriptionDate = prescription.createdAt;

//         // Fetch bill details based on patientId
//         const bill = await Bill.findOne({ _id: patientId })
//             .populate('refId', 'pId pName pNum pAge pGender pSalutation')
//             .populate('doctorName', 'drName')
//             .exec();

//         if (!bill) {
//             return res.status(404).json({ error: 'Bill not found' });
//         }

//         const billId = bill.billId || "";

//         // Format the bill date
//         const formattedBillDate = new Date(prescriptionDate).toLocaleDateString();

//         // Fetch vitals, diagnosis, and medicine details (assuming they are part of the prescription or bill)
//         const vitals = {
//             bloodPressure: prescription.bloodPressure || "N/A",
//             heartRate: prescription.heartRate || "N/A",
//             respiratoryRate: prescription.respiratoryRate || "N/A",
//             temperature: prescription.temperature || "N/A",
//             height: prescription.height || "N/A",
//             weight: prescription.weight || "N/A",
//         };

//         const diagnosis = {
//             complaints: prescription.complaints || "N/A",
//             clinicalFindings: prescription.clinicalFindings || "N/A",
//             diagnosis: prescription.diagnosis || "N/A",
//             knownDiagnosis: prescription.knownDiagnosis || "N/A",
//         };

//         const medicines = prescription.medicines || [];
//         const selectedTests = prescription.selectedTests || [];

//         // Define the HTML content with formatted bill date, vitals, diagnosis, medicine details, and investigation
//         const htmlContent = `
//         <div style="text-align: center;">
//             <span style="font-weight: bold; font-size: 30px;">Care Conquer</span> <br> <br>
//             <span>46/4, Hosur Rd, Kudlu Gate, Krishna Reddy Industrial Area, H.S</span><br>
//             <span>, R Extension, Bengaluru, Karnataka 560068</span><br>
//             <span>Email: careconqueronline@gmail.com</span><br>
//             <span>PH: 8574968523 </span>
//             <h5 style="text-align:center">PRESCRIPTION</h5>
//             <hr style="border-top: 1px solid #000; margin: 0;">
//         </div>
//         <html>
//             <head>
//                 <style>
//                     table {
//                         width: 100%;
//                         border-collapse: collapse;
//                     }
//                     th, td {
//                         border: 1px solid #000;
//                         padding: 8px;
//                         text-align: left;
//                     }
//                     .section {
//                         margin-top: 20px;
//                     }
//                     .section h4 {
//                         margin-bottom: 10px;
//                     }
//                     .vitals {
//                         font-weight: bold;
//                         margin-bottom: 10px;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <table>
//                     <tr>
//                         <td style="width: 80%; text-align: left;">
//                             Patient Name: <strong>${bill.refId.pSalutation} ${bill.refId.pName}</strong><br>
//                             <div style="margin-bottom: 8px;"></div>
//                             Sex / Age:<strong> ${bill.refId.pGender} / ${bill.refId.pAge}</strong><br>
//                             <div style="margin-bottom: 8px;"></div>
//                             Referred By:<strong> ${bill.doctorName.drName}</strong>
//                         </td>
//                         <td style="width: 50%; text-align: left;">
//                             Patient ID: <strong> ${bill.refId.pId} </strong><br>
//                             <div style="margin-bottom: 8px;"></div>
//                             Bill ID: <strong>${billId}</strong><br>
//                             <div style="margin-bottom: 8px;"></div>
//                             Date:<strong> ${formattedBillDate}</strong>
//                         </td>
//                     </tr>
//                 </table>
//                 <hr style="border-top: 1px solid #000; margin: 0;">

//                 <!-- Vitals Section -->
//                 <div class="section">
//                     <div class="vitals">
//                         WT: ${vitals.weight}, BP: ${vitals.bloodPressure}, HR: ${vitals.heartRate}, RR: ${vitals.respiratoryRate}, Temp: ${vitals.temperature}, HT: ${vitals.height}
//                     </div>
//                 </div>

//                 <!-- Diagnosis Section -->
//                 <div class="section">
//                     <p><strong>Complaints:</strong> ${diagnosis.complaints}</p>
//                     <p><strong>Clinical Findings:</strong> ${diagnosis.clinicalFindings}</p>
//                     <p><strong>Diagnosis:</strong> ${diagnosis.diagnosis}</p>
//                     <p><strong>Known Diagnosis:</strong> ${diagnosis.knownDiagnosis}</p>
//                 </div>

//                 <!-- Medicine Details Section -->
//                 <div class="section">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Medicine Name</th>
//                                 <th>Dosage</th>
//                                 <th>Frequency</th>
//                                 <th>Duration</th>
//                                 <th>Tablets</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             ${medicines.map((medicine) => `
//                                 <tr>
//                                     <td>${medicine.medicineName || "N/A"}</td>
//                                     <td>${medicine.foodType || "N/A"}</td>
//                                     <td>${medicine.frequency || "N/A"}</td>
//                                     <td>${medicine.duration || "N/A"}</td>
//                                     <td>${medicine.tablets || "N/A"}</td>
//                                 </tr>
//                             `).join("")}
//                         </tbody>
//                     </table>
//                 </div>

//                 <!-- Investigation Section -->
//                 <div class="section">
//                     <h4>Investigation</h4>
//                     <ul>
//                         ${selectedTests.map((test) => `
//                             <li>${test.testName || "N/A"}</li>
//                         `).join("")}
//                     </ul>
//                 </div>

//                 <!-- Prescription Content -->
//                 <div class="section">
//                     <h4>Prescription Details</h4>
//                     ${prescriptionContent}
//                 </div>
//             </body>
//         </html>`;

//         // Instantiate WHHTMLToPDF and generate the PDF
//         const pdfGenerator = new HTMLToPDF();
//         const pdfBuffer = await pdfGenerator.generatePDF(htmlContent);

//         // Serve the PDF as a response
//         res.contentType('application/pdf');
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating prescription PDF:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

export const printPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Fetch prescription details
        const prescription = await Prescription.findOne({ patientId });
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        const prescriptionContent = prescription.content;
        const prescriptionDate = prescription.createdAt;

        // Fetch bill details based on patientId
        const bill = await Bill.findOne({ _id: patientId })
            .populate('refId', 'pId pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        const billId = prescription.billNO || "";


        // Format the bill date
        const formattedBillDate = new Date(prescriptionDate).toLocaleDateString();

        // Fetch vitals, diagnosis, and medicine details (assuming they are part of the prescription or bill)
        const vitals = {
            bloodPressure: prescription.bloodPressure || "N/A",
            heartRate: prescription.heartRate || "N/A",
            respiratoryRate: prescription.respiratoryRate || "N/A",
            temperature: prescription.temperature || "N/A",
            height: prescription.height || "N/A",
            weight: prescription.weight || "N/A",
        };

        const diagnosis = {
            complaints: prescription.complaints || "N/A",
            clinicalFindings: prescription.clinicalFindings || "N/A",
            diagnosis: prescription.diagnosis || "N/A",
            knownDiagnosis: prescription.knownDiagnosis || "N/A",
        };

        const medicines = prescription.medicines || [];
        const selectedTests = prescription.selectedTests || [];

        // Define the HTML content with formatted bill date, vitals, diagnosis, medicine details, and investigation
        const htmlContent = `
        <div style="text-align: center;">
            <span style="font-weight: bold; font-size: 30px;">Care Conquer</span> <br> <br>
            <span>46/4, Hosur Rd, Kudlu Gate, Krishna Reddy Industrial Area, H.S</span><br>
            <span>, R Extension, Bengaluru, Karnataka 560068</span><br>
            <span>Email: careconqueronline@gmail.com</span><br>
            <span>PH: 8574968523 </span>
            <h5 style="text-align:center">PRESCRIPTION</h5>
            <hr style="border-top: 1px solid #000; margin: 0;">
        </div>
        <html>
            <head>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    .section {
                        margin-top: 20px;
                    }
                    .section h4 {
                        margin-bottom: 10px;
                    }
                    .vitals {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .diagnosis {
                        margin-bottom: 10px;
                    }
                    .diagnosis p {
                        margin: 0;
                    }
                    .diagnosis strong {
                        display: block;
                        margin-bottom: 5px;
                    }
                    .rx-symbol {
                        font-size: 20px;
                        font-weight: bold;
                        margin-right: 5px;
                    }
                    .composition {
                        font-size: 12px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <td style="width: 80%; text-align: left;">
                            Patient Name: <strong>${bill.refId.pSalutation} ${bill.refId.pName}</strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Sex / Age:<strong> ${bill.refId.pGender} / ${bill.refId.pAge}</strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Referred By:<strong> ${bill.doctorName.drName}</strong>
                        </td>
                        <td style="width: 50%; text-align: left;">
                            Patient ID: <strong> ${bill.refId.pId} </strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Prescriptiom ID: <strong>${billId}</strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Date:<strong> ${formattedBillDate}</strong>
                        </td>
                    </tr>
                </table>
                <hr style="border-top: 1px solid #000; margin: 0;">

                <!-- Vitals Section -->
                <div class="section">
                    <div class="vitals">
                        WT: ${vitals.weight}, BP: ${vitals.bloodPressure}, HR: ${vitals.heartRate}, RR: ${vitals.respiratoryRate}, Temp: ${vitals.temperature}, HT: ${vitals.height}
                    </div>
                </div>

                <!-- Diagnosis Section -->
              <div class="section diagnosis">
    <p><strong class="label">Complaints:</strong> ${diagnosis.complaints}</p>
    <p><strong class="label">Clinical Findings:</strong> ${diagnosis.clinicalFindings}</p>
    <p><strong class="label">Diagnosis:</strong> ${diagnosis.diagnosis}</p>
    <p><strong class="label">Known Diagnosis:</strong> ${diagnosis.knownDiagnosis}</p>
</div>


                <!-- Medicine Details Section -->
                <div class="section">
                    <table>
                        <thead>
                            <tr>
                                <th>Rx</th>
                                <th>Medicine Name</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                                <th>Tablets</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${medicines.map((medicine, index) => `
                                <tr>
                                    <td><span class="rx-symbol">&#8478;</span></td>
                                    <td>
                                        ${medicine.medicineName || "N/A"}
                                        <div class="composition">(${medicine.composition || "N/A"})</div>
                                    </td>
                                    <td>${medicine.foodType || "N/A"}</td>
                                    <td>${medicine.frequency || "N/A"}</td>
                                    <td>${medicine.duration || "N/A"}</td>
                                    <td>${medicine.tablets || "N/A"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>

                <!-- Investigation Section -->
                <div class="section">
                    <h4>Investigation</h4>
                    <ul>
                        ${selectedTests.map((test) => `
                            <li>${test.testName || "N/A"}</li>
                        `).join("")}
                    </ul>
                </div>

                <!-- Prescription Content -->
                <div class="section">
                    <h4>Advice</h4>
                    ${prescriptionContent}
                </div>
            </body>
        </html>`;

        // Instantiate WHHTMLToPDF and generate the PDF
        const pdfGenerator = new HTMLToPDF();
        const pdfBuffer = await pdfGenerator.generatePDF(htmlContent);

        // Serve the PDF as a response
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating prescription PDF:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const printPrescription = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Fetch prescription details
        const prescription = await Prescription.findOne({ _id: patientId });
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        const prescriptionContent = prescription.content;
        const prescriptionDate = prescription.createdAt;

        // Fetch bill details based on patientId
        const bill = await PatientReg.findOne({ _id: prescription.billId })
        // .populate('refId', 'pId pName pNum pAge pGender pSalutation')
        // .populate('doctorName', 'drName')
        // .exec();
        const doctor = await doctorDetail.findOne({ _id: bill.doctorName })


        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        const billId = prescription.billNO || "";

        // Format the bill date
        const formattedBillDate = new Date(prescriptionDate).toLocaleDateString();

        // Fetch vitals, diagnosis, and medicine details (assuming they are part of the prescription or bill)
        const vitals = {
            bloodPressure: prescription.bloodPressure || "N/A",
            heartRate: prescription.heartRate || "N/A",
            respiratoryRate: prescription.respiratoryRate || "N/A",
            temperature: prescription.temperature || "N/A",
            height: prescription.height || "N/A",
            weight: prescription.weight || "N/A",
        };

        const diagnosis = {
            complaints: prescription.complaints || "N/A",
            clinicalFindings: prescription.clinicalFindings || "N/A",
            diagnosis: prescription.diagnosis || "N/A",
            knownDiagnosis: prescription.knownDiagnosis || "N/A",
        };

        const medicines = prescription.medicines || [];
        const selectedTests = prescription.selectedTests || [];

        // Define the HTML content with formatted bill date, vitals, diagnosis, medicine details, and investigation
        const htmlContent = `
        <div style="text-align: center;">
            <span style="font-weight: bold; font-size: 30px;">Care Conquer</span> <br> <br>
            <span>46/4, Hosur Rd, Kudlu Gate, Krishna Reddy Industrial Area, H.S</span><br>
            <span>, R Extension, Bengaluru, Karnataka 560068</span><br>
            <span>Email: careconqueronline@gmail.com</span><br>
            <span>PH: 8574968523 </span>
            <h5 style="text-align:center">PRESCRIPTION</h5>
            <hr style="border-top: 1px solid #000; margin: 0;">
        </div>
        <html>
            <head>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    .section {
                        margin-top: 20px;
                    }
                    .section h4 {
                        margin-bottom: 10px;
                    }
                    .vitals {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .diagnosis {
                        margin-bottom: 10px;
                    }
                    .diagnosis p {
                        margin: 0;
                    }
                    .diagnosis strong {
                        display: block;
                        margin-bottom: 5px;
                    }
                    .rx-symbol {
                        font-size: 20px;
                        font-weight: bold;
                        margin-right: 5px;
                    }
                    .composition {
                        font-size: 12px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <td style="width: 80%; text-align: left;">
                            Patient Name: <strong>${bill.pSalutation} ${bill.pName}</strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Sex / Age:<strong> ${bill.pGender} / ${bill.pAge}</strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Referred By:<strong> ${doctor.drName}</strong>
                        </td>
                        <td style="width: 50%; text-align: left;">
                            Patient ID: <strong> ${bill.pId} </strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Prescriptiom ID: <strong>${billId}</strong><br>
                            <div style="margin-bottom: 8px;"></div>
                            Date:<strong> ${formattedBillDate}</strong>
                        </td>
                    </tr>
                </table>
                <hr style="border-top: 1px solid #000; margin: 0;">

                <!-- Vitals Section -->
                <div class="section">
                    <div class="vitals">
                        WT: ${vitals.weight}, BP: ${vitals.bloodPressure}, HR: ${vitals.heartRate}, RR: ${vitals.respiratoryRate}, Temp: ${vitals.temperature}, HT: ${vitals.height}
                    </div>
                </div>

                <!-- Diagnosis Section -->
              <div class="section diagnosis">
    <p><strong class="label">Complaints:</strong> ${diagnosis.complaints}</p>
    <p><strong class="label">Clinical Findings:</strong> ${diagnosis.clinicalFindings}</p>
    <p><strong class="label">Diagnosis:</strong> ${diagnosis.diagnosis}</p>
    <p><strong class="label">Known Diagnosis:</strong> ${diagnosis.knownDiagnosis}</p>
</div>


                <!-- Medicine Details Section -->
                <div class="section">
                    <table>
                        <thead>
                            <tr>
                                <th>Rx</th>
                                <th>Medicine Name</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                                <th>Tablets</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${medicines.map((medicine, index) => `
                                <tr>
                                    <td><span class="rx-symbol">&#8478;</span></td>
                                    <td>
                                        ${medicine.medicineName || "N/A"}
                                        <div class="composition">(${medicine.composition || "N/A"})</div>
                                    </td>
                                    <td>${medicine.foodType || "N/A"}</td>
                                    <td>${medicine.frequency || "N/A"}</td>
                                    <td>${medicine.duration || "N/A"}</td>
                                    <td>${medicine.tablets || "N/A"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>

                <!-- Investigation Section -->
                <div class="section">
                    <h4>Investigation</h4>
                    <ul>
                        ${selectedTests.map((test) => `
                            <li>${test.testName || "N/A"}</li>
                        `).join("")}
                    </ul>
                </div>

                <!-- Prescription Content -->
                <div class="section">
                    <h4>Advice</h4>
                    ${prescriptionContent}
                </div>
            </body>
        </html>`;

        // Instantiate WHHTMLToPDF and generate the PDF
        const pdfGenerator = new HTMLToPDF();
        const pdfBuffer = await pdfGenerator.generatePDF(htmlContent);

        // Serve the PDF as a response
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating prescription PDF:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

