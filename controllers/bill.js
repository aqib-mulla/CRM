import Bill from "../models/Bill.js";
import BillDetail from "../models/BillDetails.js";
import GroupTest from "../models/GroupTest.js";
import Test from "../models/Tests.js";
import CreateProfile from "../models/CreateProfile.js";
import labResultDetail from "../models/labResultDetail.js";
import labResult from "../models/labResult.js";
import PatientReg from "../models/PatientReg.js";
import Fees from "../models/fees.js";
import HTMLToPDF from './htmlPf.js';
import { PDFDocument, rgb } from 'pdf-lib';

export const bill = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const { date } = req.query; // Get the date parameter from the query string

        async function getBillsWithDetails() {
            let query = Bill.find();

            // If a date parameter is provided, add a filter to the query
            if (date) {
                // Assuming date is in the format 'YYYY-MM-DD'
                const startDate = new Date(date);
                const endDate = new Date(date);
                endDate.setDate(endDate.getDate() + 1); // Set end date to the next day
                query = query.where('createdAt').gte(startDate).lt(endDate);
            }

            const billsWithDetails = await query
                .populate('refId', 'pName pNum pAge pGender pSalutation _id')
                .populate('doctorName', 'drName')
                .exec();

            const formattedBills = billsWithDetails.map((bill) => ({
                objbillId: bill._id,
                pName: bill.refId.pName,
                pSal: bill.refId.pSalutation,
                pNum: bill.refId.pNum,
                drName: bill.doctorName.drName,
                billId: bill.billId,
                _id: bill.refId._id,
                billDate: formatDate(bill.createdAt),
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                discountAmount: bill.discountAmount,
                // ... other bill details
            }));

            res.status(200).json({ bills: formattedBills });
        }

        await getBillsWithDetails();

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
};

export const reports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const { date } = req.query; // Get the date parameter from the query string

        async function getBillsWithDetails() {
            let billDetailQuery = BillDetail.find({ department: 'Lab' }).select('refBillId');

            // If a date parameter is provided, add a filter to the query
            if (date) {
                // Assuming date is in the format 'YYYY-MM-DD'
                const startDate = new Date(date);
                const endDate = new Date(date);
                endDate.setDate(endDate.getDate() + 1); // Set end date to the next day
                billDetailQuery = billDetailQuery.where('createdAt').gte(startDate).lt(endDate);
            }

            const billDetails = await billDetailQuery.exec();
            const refBillIds = billDetails.map(detail => detail.refBillId);

            // Now query Bill with the filtered refBillIds
            const billsWithDetails = await Bill.find({ _id: { $in: refBillIds } })
                .populate('refId', 'pName pNum pAge pGender pSalutation')
                .populate('doctorName', 'drName')
                .exec();

            const formattedBills = billsWithDetails.map((bill) => ({
                objbillId: bill._id,
                pName: bill.refId.pName,
                pSal: bill.refId.pSalutation,
                pNum: bill.refId.pNum,
                drName: bill.doctorName.drName,
                billId: bill.billId,
                billDate: formatDate(bill.createdAt),
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                discountAmount: bill.discountAmount,
                // ... other bill details
            }));

            res.status(200).json({ bills: formattedBills });
        }

        await getBillsWithDetails();

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
};




export const billDetails = async (req, res) => {
    try {
        const id = req.params.id;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation') // Reference to the PatientReg model, selecting only pName and pNum fields
            .populate('doctorName', 'drName') // Reference to the Doctor model, selecting only doctorName field
            .exec();

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        function formatDates(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based index
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }


        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pSal: bill.refId.pSalutation,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                discountAmount: bill.discountAmount,
                billDate: formatDates(bill.createdAt),
                // Add other properties from the bill and populated models
            },
            feesData: [],
        };

        const feesData = await BillDetail.find({ refBillId: id });
        for (const fee of feesData) {
            const feesType = await getFeesType(fee.testId, fee.type);
            if (feesType) {
                let feesTypeName;
                if (fee.type === 'Profile') {
                    feesTypeName = feesType.profileName;
                } else if (fee.type === 'Group') {
                    const group = await GroupTest.findById(fee.testId, 'groupName');
                    feesTypeName = group.groupName;
                }else if (fee.type === 'OtherFees') {
                    const fees = await Fees.findById(fee.testId, 'feesName');
                    feesTypeName = fees.feesName;
                } else {
                    feesTypeName = feesType.name;
                }

                data.feesData.push({
                    id: fee._id,
                    type: fee.type,
                    id: fee.testId,
                    feesType: feesTypeName,
                    fees: fee.fees,
                    discount: fee.discount,
                });
            }
        }

        res.json(data);
        // return data;
    } catch (error) {
        console.error('Error fetching bill details:', error);
        res.status(500).json({ error: 'Failed to fetch bill details' });
    }
};

// Helper function to get fees type
async function getFeesType(id, type) {
    try {
        switch (type) {
            case 'Test':
                return await Test.findById(id, 'name');
            case 'Group':
                return await GroupTest.findById(id, 'groupName');
            case 'Profile':
                return await CreateProfile.findById(id, 'profileName');
            case 'OtherFees':
                return await Fees.findById(id, 'feesName');
            default:
                return null;
        }
    } catch (error) {
        console.error('Error fetching fees type:', error);
        return null;
    }
}


// export const collectDueAmount = async (req, res) => {

//     const billId = req.params.id;
//     const { dueAmount } = req.body;

//     try {
//         // Find the bill by its ID
//         const bill = await Bill.findById(billId);

//         if (!bill) {
//             return res.status(404).json({ error: 'Bill not found' });
//         }

//         if (dueAmount > bill.amountDue) {
//             return res.status(400).json({ error: 'Collected amount cannot be greater than the due amount' });
//         }

//         // Subtract the collected amount from the due amount
//         bill.amountDue -= dueAmount;

//         bill.amountPaid += dueAmount;


//         // Save the updated bill
//         await bill.save();


//         return res.json({ message: 'Due amount updated successfully' });
//     } catch (error) {
//         console.error('Error updating due amount:', error);
//         return res.status(500).json({ error: 'An error occurred while updating due amount' });
//     }
// }

export const collectDueAmount = async (req, res) => {
    const billId = req.params.id;
    const { dueAmount } = req.body;

    try {
        // Find the bill by its ID
        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        if (dueAmount > bill.amountDue) {
            return res.status(400).json({ error: 'Collected amount cannot be greater than the due amount' });
        }

        // Subtract the collected amount from the due amount
        bill.amountDue -= dueAmount;
        bill.amountPaid += dueAmount;

        // Save the updated bill
        await bill.save();

        // Send the updated bill details in the response
        const updatedBillDetails = {
            billAmount: bill.billAmount,
            amountPaid: bill.amountPaid,
            amountDue: bill.amountDue
        };

        return res.json({ message: 'Due amount collected successfully', updatedBillDetails });
    } catch (error) {
        console.error('Error updating due amount:', error);
        return res.status(500).json({ error: 'An error occurred while updating due amount' });
    }
};

// export const updatebillTest = async (req, res) => {

//     const billId = req.params.id;

//     try {
//         const { selectedTests } = req.body;

//         // Find the Bill document by ID
//         const bill = await Bill.findById(billId);

//         if (!bill) {
//             return res.status(404).json({ error: 'Bill not found' });
//         }


//         // Calculate the total fees of selected tests
//         let totalFees = 0;
//         selectedTests.forEach((test) => {
//             if (test.fees) {
//                 totalFees += parseFloat(test.fees); // Parse fees as a float
//             } else if (test.profilePrice) {
//                 totalFees += parseFloat(test.profilePrice); // Parse profilePrice as a float
//             } else if (test.groupPrice) {
//                 totalFees += parseFloat(test.groupPrice); // Parse groupPrice as a float
//             }
//         });

//         // Update the amountDue field with the calculated total fees
//         bill.amountDue += totalFees;
//         bill.billAmount += totalFees;


//         // Create an array to store BillDetail entries for selected tests
//         const billDetailPromises = selectedTests.map(async (test) => {
//             const { _id, type, fees, profilePrice, groupPrice /* ... */ } = test;

//             const billDetail = new BillDetail({
//                 refBillId: billId,
//                 testId: _id,
//                 type,
//                 fees: fees || profilePrice || groupPrice,
//                 // ... other properties
//             });
//             return await billDetail.save();
//         });

//         // Wait for all BillDetail promises to resolve
//         await Promise.all(billDetailPromises);

//         // Save the updated Bill with the new amountDue
//         await bill.save();

//         // Respond with saved data
//         res.status(201).json({ message: 'Bill and BillDetail updated successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

export const updatebillTest = async (req, res) => {
    const billId = req.params.id;

    try {
        const { selectedTests } = req.body;

        // Find the Bill document by ID
        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        // Calculate the total fees of selected tests
        let totalFees = 0;
        selectedTests.forEach((test) => {
            if (test.fees) {
                totalFees += parseFloat(test.fees); // Parse fees as a float
            } else if (test.profilePrice) {
                totalFees += parseFloat(test.profilePrice); // Parse profilePrice as a float
            } else if (test.groupPrice) {
                totalFees += parseFloat(test.groupPrice); // Parse groupPrice as a float
            }else if (test.opFees) {
                totalFees += parseFloat(test.opFees); // Parse groupPrice as a float
            }
        });

        // Update the amountDue field with the calculated total fees
        bill.amountDue += totalFees;
        bill.billAmount += totalFees;

        // Create an array to store BillDetail entries for selected tests
        const billDetailPromises = selectedTests.map(async (test) => {
            const { _id, type, fees, profilePrice, groupPrice,opFees, department } = test;

            const billDetail = new BillDetail({
                refBillId: billId,
                testId: _id,
                type,
                department,
                fees: fees || profilePrice || groupPrice || opFees,
                feesType: test.name, // Rename 'name' to 'feesType'
                // ... other properties
            });

            return await billDetail.save();
        });

        // Wait for all BillDetail promises to resolve
        await Promise.all(billDetailPromises);

        // Save the updated Bill with the new amountDue
        await bill.save();

        // Create the updatedSelectedTests array with feesType instead of name
        const updatedSelectedTests = selectedTests.map((test) => ({
            ...test,
            feesType: test.name || test.groupName || test.feesName,
            fees: test.fees || test.groupPrice || test.opFees,
        }));

        // Respond with saved data, including updatedSelectedTests, billAmount, and amountDue
        res.status(201).json({
            message: 'Bill and BillDetail updated successfully',
            updatedSelectedTests,
            billAmount: bill.billAmount,
            amountDue: bill.amountDue,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// export const deleteBill = async (req, res) => {
//     try {
//         // Extract the billId from the request parameters
//         const billId = req.params.id;

//         // First, find and delete related BillDetail documents
//         const billDetailsToDelete = await BillDetail.find({ refBillId: billId });

//         // Delete related LabResultDetails documents based on objbillId
//         const labResultDetailsIdsToDelete = billDetailsToDelete.map((detail) => detail.refBillId);
//         await labResultDetail.deleteMany({ objbillId: { $in: labResultDetailsIdsToDelete } });

//         // Now, delete related LabResult documents based on objbillId
//         await labResult.deleteMany({ objbillId: { $in: labResultDetailsIdsToDelete } });



//         // Finally, delete the Bill and BillDetail documents
//         await BillDetail.deleteMany({ refBillId: billId });

//         // Find the Bill document by _id
//         const billToDelete = await Bill.findById(billId);

//         if (!billToDelete) {
//             return res.status(404).json({ error: 'Bill not found' });
//         }

//         // Find the associated PatientReg document by _id from the refId field in Bill
//         const patientRegIdToDelete = billToDelete.refId;

//         if (patientRegIdToDelete) {
//             // Delete the PatientReg document
//             await PatientReg.findByIdAndDelete(patientRegIdToDelete);
//         }

//         await Bill.findByIdAndDelete(billId);

//         res.status(200).json({ message: 'Bill and its details deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting bill and details:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

export const deleteBill = async (req, res) => {
    try {
        // Extract the billId from the request parameters
        const billId = req.params.id;

        // First, find and delete related BillDetail documents
        const billDetailsToDelete = await BillDetail.find({ refBillId: billId });

        // Delete related LabResultDetails documents based on objbillId
        const labResultDetailsIdsToDelete = billDetailsToDelete.map((detail) => detail.refBillId);
        await labResultDetail.deleteMany({ objbillId: { $in: labResultDetailsIdsToDelete } });

        // Now, delete related LabResult documents based on objbillId
        await labResult.deleteMany({ objbillId: { $in: labResultDetailsIdsToDelete } });

        // Finally, delete the Bill and BillDetail documents
        await BillDetail.deleteMany({ refBillId: billId });

        // Find the Bill document by _id
        const billToDelete = await Bill.findById(billId);

        if (!billToDelete) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        await Bill.findByIdAndDelete(billId);

        res.status(200).json({ message: 'Bill and its details deleted successfully' });
    } catch (error) {
        console.error('Error deleting bill and details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getBillDetails = async (id) => {
    try {
        // const id = req.params.id;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation') // Reference to the PatientReg model, selecting only pName and pNum fields
            .populate('doctorName', 'drName') // Reference to the Doctor model, selecting only doctorName field
            .exec();

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        function formatDates(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based index
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }


        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pSal: bill.refId.pSalutation,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                discountAmount: bill.discountAmount,
                billDate: formatDates(bill.createdAt),
                // Add other properties from the bill and populated models
            },
            feesData: [],
        };

        const feesData = await BillDetail.find({ refBillId: id });
        for (const fee of feesData) {
            const feesType = await getFeesType(fee.testId, fee.type);
            if (feesType) {
                let feesTypeName;
                if (fee.type === 'Profile') {
                    feesTypeName = feesType.profileName;
                } else if (fee.type === 'Group') {
                    const group = await GroupTest.findById(fee.testId, 'groupName');
                    feesTypeName = group.groupName;
                } else if (fee.type === 'OtherFees') {
                    const fees = await Fees.findById(fee.testId, 'feesName');
                    feesTypeName = fees.feesName;
                }
                else {
                    feesTypeName = feesType.name;
                }

                data.feesData.push({
                    id: fee._id,
                    type: fee.type,
                    id: fee.testId,
                    feesType: feesTypeName,
                    fees: fee.fees,
                    discount: fee.discount,
                });
            }
        }

        return data;
    } catch (error) {
        console.error('Error fetching bill details:', error);
        res.status(500).json({ error: 'Failed to fetch bill details' });
    }
};


export const billPrint = async (req, res) => {

    try {

        const id = req.params.id;

        // Assuming you have the billData available
        const billData = await getBillDetails(id);

        // Generate the PDF for the bill
        const pdfBuffer = await generateBillPDF(billData);

        // Set response headers to indicate PDF content
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=bill.pdf');

        // Send the PDF as a response
        //   res.send(pdfBuffer);
        res.status(200).end(pdfBuffer);

    } catch (error) {
        console.error('Error printing bill:', error);
        res.status(500).json({ error: 'Failed to print bill' });
    }
};

// const generateBillPDF = async (data) => {
//     const browser = await puppeteer.launch({
//         executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe',
//     });

//     const page = await browser.newPage();

//     // Create an HTML template with the lab report data
//     let serialNumber = 1; // Initialize the serial number

//     const billDetailsHTML = `
//       <h5 style="text-align:center">BILL RECEIPT</h5>
//       <div style="display: inline-block; width: 48%;">

//       <table>
//       <tr>
//           <td>Patient Name:</td>
//           <td>${data.data.pSal}. ${data.data.pName}</td>
//       </tr>
//       <tr>
//           <td>Sex / Age:</td>
//           <td>${data.data.pGender} / ${data.data.pAge}</td>
//       </tr>
//       <tr>
//           <td>Referred By:</td>
//           <td>${data.data.drName}</td>
//       </tr>
//   </table>
// </div>

// <div style="display: inline-block; width: 48%;">
//   <table>
//       <tr>
//           <td>Bill ID:</td>
//           <td>${data.data.billId}</td>
//       </tr>
//       <tr>
//           <td>Bill Date:</td>
//           <td>${data.data.billDate}</td>
//       </tr>
//   </table>
// </div>
//       <div class="row">
//         <div class="col-12">
//           <table style="width: 100%;">
//             <thead>
//               <tr>
//                 <th style="width: 10%; border-bottom: 1px solid #000;text-align:left">Sl No.</th>
//                 <th style="width: 60%;border-bottom: 1px solid #000;text-align:left">Test Name</th>
//                 <th style="width: 30%; border-bottom: 1px solid #000;text-align:right">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${data.feesData.map((details) => (
//         `<tr>
//                   <td style="text-align:left;font-size:13px">${serialNumber++}</td>
//                   <td style="text-align:left;font-size:13px">${details.feesType}</td>
//                   <td style="text-align:right;font-size:13px">${details.fees}</td>
//                 </tr>`
//     )).join('')}
//             </tbody>
//           </table>
//           <!-- Underline -->
//           <div style="border-bottom: 1px solid #000; margin-top: 10px;"></div>
//         </div>
//       </div>
//       <div class="row" style="margin-top: 10px;">
//         <div class="col-6">
       
//         </div>
//         <div class="col-6" style="text-align:right">
//           <span> Grand Total: ${data.data.billAmount}</span><br>
//           <span> Paid: ${data.data.amountPaid}</span><br>
//           <span> Due: ${data.data.amountDue}</span><br>
//         </div>
//       </div>
//       <!-- Include any additional bill details content here -->
//     `;
//     await page.setContent(billDetailsHTML);

//     // Generate a PDF with custom margin options
//     const pdfBuffer = await page.pdf({
//         format: 'A4',
//         margin: {
//             top: '30mm',    // Specify the top margin
//             bottom: '10mm', // Specify the bottom margin
//             left: '10mm',   // Specify the left margin
//             right: '10mm',  // Specify the right margin
//         },
//     });

//     // Close the browser
//     await browser.close();

//     return pdfBuffer;
// }

const generateBillPDF = async (data) => {
    let serialNumber = 1; // Initialize the serial number

    const billDetailsHTML = `
            <div style="text-align: center;">
            <span style="font-weight: bold; font-size: 30px;">LASER & LAPROSCOPIC HOSPITALS</span> <br> <br>
            <span> 121, Gopathy Narayana Rd, opposite Jeeva Park & Sangeetha Hotel,</span><br>
            <span>T. Nagar, Chennai, Tamil Nadu 600017</span><br>
            <span>Email: info@laserhospital.com</span><br>
            <span>PH: 044-25540704 </span>
            <h5 style="text-align:center">BILL RECEIPT</h5>
            <hr style="border-top: 1px solid #000; margin: 0;">
        </div>
      <div style="display: inline-block; width: 48%;">
      <table>
        <tr>
            <td>Patient Name:</td>
            <td>${data.data.pSal}. ${data.data.pName}</td>
        </tr>
        <tr>
            <td>Sex / Age:</td>
            <td>${data.data.pGender} / ${data.data.pAge}</td>
        </tr>
        <tr>
            <td>Referred By:</td>
            <td>${data.data.drName}</td>
        </tr>
      </table>
      </div>
      <div style="display: inline-block; width: 48%;">
        <table>
            <tr>
                <td>Bill ID:</td>
                <td>${data.data.billId}</td>
            </tr>
            <tr>
                <td>Bill Date:</td>
                <td>${data.data.billDate}</td>
            </tr>
        </table>
      </div>
      <div class="row">
        <div class="col-12">
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="width: 10%; border-bottom: 1px solid #000;text-align:left">Sl No.</th>
                <th style="width: 60%;border-bottom: 1px solid #000;text-align:left">Test Name</th>
                <th style="width: 30%; border-bottom: 1px solid #000;text-align:right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${data.feesData.map((details) => (
                `<tr>
                  <td style="text-align:left;font-size:13px">${serialNumber++}</td>
                  <td style="text-align:left;font-size:13px">${details.feesType}</td>
                  <td style="text-align:right;font-size:13px">${details.fees}</td>
                </tr>`
              )).join('')}
            </tbody>
          </table>
          <div style="border-bottom: 1px solid #000; margin-top: 10px;"></div>
        </div>
      </div>
      <div class="row" style="margin-top: 10px;">
        <div class="col-6"></div>
        <div class="col-6" style="text-align:right">
          <span>Grand Total: ${data.data.billAmount}</span><br>
          <span>Paid: ${data.data.amountPaid}</span><br>
          <span>Due: ${data.data.amountDue}</span><br>
        </div>
      </div>
    `;

    // Instantiate WHHTMLToPDF and generate the PDF
    const pdfGenerator = new HTMLToPDF();
    const pdfBuffer = await pdfGenerator.generatePDF(billDetailsHTML);

    return pdfBuffer;
};

// const generateBillPDF = async (data) => {
//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([595, 842]); // A4 size: 595 x 842 units

//     // Create a custom font
//     const font = await pdfDoc.embedFont('Helvetica');

//     // Set up the drawing context
//     const { width, height } = page.getSize();

//     // Function to add text with the specified position and align it to the left
//     const addLeftAlignedText = (x, y, text) => {
//       page.drawText(String(text), {
//         x,
//         y,
//         size: 12,
//         font,
//         color: rgb(0, 0, 0), // Black color
//         align: 'left', // Align text to the left
//       });
//     };

//     // Function to add text with the specified position and align it to the right
//     const addRightAlignedText = (x, y, text) => {
//       page.drawText(String(text), {
//         x,
//         y,
//         size: 12,
//         font,
//         color: rgb(0, 0, 0), // Black color
//         align: 'right', // Align text to the right
//       });
//     };

//     // Add Patient Information and Bill Information side by side
//     let y = height - 50;

//     // Patient Information (First Column)
//     addLeftAlignedText(50, y, 'Patient Name:');
//     addLeftAlignedText(50, y - 20, 'Sex / Age:');
//     addLeftAlignedText(50, y - 40, 'Referred By:');

//     // Bill Information (Second Column)
//     addRightAlignedText(300, y, 'Bill ID:');
//     addRightAlignedText(300, y - 20, 'Bill Date:');

//     // Add Patient Details (First Column)
//     addLeftAlignedText(150, y, `${data.data.pSal}. ${data.data.pName}`);
//     addLeftAlignedText(150, y - 20, `${data.data.pGender} / ${data.data.pAge}`);
//     addLeftAlignedText(150, y - 40, data.data.drName);

//     // Add Bill Details (Second Column)
//     addRightAlignedText(350, y, data.data.billId);
//     addRightAlignedText(350, y - 20, data.data.billDate);

//     // Adjust y coordinate to leave space for the table headers
//     y -= 60;

//     // Function to add a line separator
//     const addLineSeparator = (y) => {
//       page.drawLine({
//         start: { x: 50, y },
//         end: { x: 545, y },
//         thickness: 1,
//         color: rgb(0, 0, 0), // Black color
//       });
//     };

//     // Add content to the PDF
//     addLeftAlignedText(50, y, 'Sl No.');
//     addLeftAlignedText(250, y, 'Test Name');
//     addRightAlignedText(545, y, 'Price');
//     addLineSeparator(y - 10);
//     y -= 10;

//     // Iterate through feesData and add rows to the table
//     let serialNumber = 1;
//     for (const details of data.feesData) {
//       y -= 25;
//       addLeftAlignedText(50, y, serialNumber.toString());
//       addLeftAlignedText(250, y, details.feesType);
//       addRightAlignedText(545, y, details.fees);
//       serialNumber++;
//     }

//     // Add Grand Total, Paid, and Due
//     y -= 25;
//     addLeftAlignedText(450, y, 'Grand Total:');
//     addRightAlignedText(545, y, data.data.billAmount);
//     y -= 25;
//     addLeftAlignedText(450, y, 'Paid:');
//     addRightAlignedText(545, y, data.data.amountPaid);
//     y -= 25;
//     addLeftAlignedText(450, y, 'Due:');
//     addRightAlignedText(545, y, data.data.amountDue);

//     // Serialize the PDF document to a buffer
//     const pdfBytes = await pdfDoc.save();

//     return pdfBytes;
//   };

export const downloadBackup = async (req, res) => {
    const backupDir = 'backup'; // Specify the backup directory
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Create a timestamp for the backup
    const backupFileName = `backup-${timestamp}`;

    // Replace <your_connection_string> with your MongoDB cluster connection string
    const backupCommand = `mongodump --uri "mongodb+srv://aqibmulla456:aqib1234@cluster0.xpvhvm4.mongodb.net/LMS?retryWrites=true&w=majority" --out ${backupDir}/${backupFileName}`;

    // Use the full path to the zip executable, e.g., "C:\\Program Files\\7-Zip\\7z.exe"
    const zipExecutablePath = 'C:\\Program Files\\WinRAR\\WinRAR.exe';

    exec(backupCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Backup failed: ${error}`);
            return res.status(500).json({ error: 'Backup failed' });
        }

        // Compress the backup files into a .zip archive using the full path to the zip executable
        exec(`${zipExecutablePath} a -r ${backupDir}/${backupFileName}.zip ${backupDir}/${backupFileName}`, (zipError) => {
            if (zipError) {
                console.error(`Zip compression failed: ${zipError}`);
                return res.status(500).json({ error: 'Backup compression failed' });
            }

            console.log(`Backup successful: ${stdout}`);
            res.download(`${backupDir}/${backupFileName}.zip`);
        });
    });
}

export default bill