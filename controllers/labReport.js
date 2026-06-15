import Bill from "../models/Bill.js";
import Test from "../models/Tests.js";
import GroupTest from "../models/GroupTest.js";
import BillDetail from '../models/BillDetails.js';
import CreateProfile from "../models/CreateProfile.js";
import labResultDetail from "../models/labResultDetail.js";
import labResult from "../models/labResult.js";
import PatientReg from '../models/PatientReg.js';
import FormData from 'form-data';
import nodemailer from 'nodemailer';
import pkg from 'qrcode';
import fs from 'fs';
import axios from 'axios';
import QRCode from 'qrcode';
import HTMLToPDF from './reportPdf.js';
import WHHTMLToPDF from './whReportpdf.js';
import BwipJs from 'bwip-js';
import * as ftp from 'basic-ftp';


async function uploadToHostinger(localPath, remotePath) {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: '178.16.136.161',
            port: 21,
            user: 'u336422365',
            password: '#$AQ12!@a', // Replace with your Hostinger FTP password
            secure: false
        });
        console.log('Connected to FTP server');
        await client.uploadFrom(localPath, remotePath);
        console.log('File uploaded successfully');
    } catch (err) {
        console.error('Error uploading file:', err);
    }
    client.close();
}


// export const labReport = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { selectedTestsData } = req.body;

//         const bill = await Bill.findById(id)
//             .populate('refId', 'pName pNum pAge pGender pSalutation')
//             .populate('doctorName', 'drName')
//             .exec();

//         if (!bill) {
//             return res.status(404).json({ message: 'Bill not found' });
//         }

//         function formatDate(dateString) {
//             const date = new Date(dateString);
//             const day = date.getDate();
//             const month = date.getMonth() + 1;
//             const year = date.getFullYear();
//             return `${day}/${month}/${year}`;
//         }

//         const data = {
//             data: {
//                 billId: bill.billId,
//                 pName: bill.refId.pName,
//                 pAge: bill.refId.pAge,
//                 pGender: bill.refId.pGender,
//                 pSal: bill.refId.pSalutation,
//                 drName: bill.doctorName.drName,
//                 billAmount: bill.billAmount,
//                 amountDue: bill.amountDue,
//                 amountPaid: bill.amountPaid,
//                 billDate: formatDate(bill.createdAt),
//             },
//             feesData: [],
//         };

//         const feesData = await labResultDetail.find({ objbillId: id });

//         for (const fee of feesData) {
//             if (selectedTestsData.includes(fee.resultId.toString())) {
//                 let feesType = await getFeesType(fee.fieldId, fee.type);
//                 if (feesType) {
//                     let feesTypeName;
//                     let reference_range = '';
//                     let units = '';
//                     let category = '';
//                     let comments = '';
//                     let method = '';
//                     let labResultArray = [];

//                     if (fee.type === 'Profile') {
//                         // Your code for profile type tests
//                     } else if (fee.type === 'Group') {
//                         feesTypeName = feesType.groupName;
//                         if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
//                             const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory');
//                             if (group) {
//                                 const testIds = group.testFields.map(field => field.testId);
//                                 const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
//                                 if (testDetails) {
//                                     const orderedTestFields = group.testFields.map(field => {
//                                         const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
//                                         return {
//                                             _id: testDetail._id,
//                                             name: testDetail.name,
//                                             reference_range: testDetail.reference_range,
//                                             units: testDetail.units,
//                                             category: testDetail.category,
//                                             comments: testDetail.comments,
//                                             method: testDetail.method,
//                                             testid: fee.testId,
//                                             type: fee.type,
//                                         };
//                                     });

//                                     // Fetch lab results based on the test ID
//                                     const labResults = await labResultDetail.find({
//                                         objbillId: id,
//                                         id: { $in: testIds } // Filter by IDs
//                                     });

//                                     const labResultArray = orderedTestFields.map(test => {
//                                         const groupTest = group.testFields.find(field => field.testId.equals(test._id));

//                                         // Assuming that the testName is a property of the groupTest object
//                                         const testName = groupTest ? groupTest.subCat : '';

//                                         const resultsForTest = labResults.filter(result => result.id.equals(test._id));

//                                         // Extracting both result and abnormalValue
//                                         const testResults = resultsForTest.map(result => ({
//                                             testName: testName,
//                                             result: result.result,
//                                             abnormalValue: result.abnormalValue, // Assuming there's an abnormalValue field in labResultDetail
//                                         }));

//                                         return testResults;
//                                     }).flat(); // Use flat to flatten the nested arrays

//                                     data.feesData.push({
//                                         id: fee._id,
//                                         type: fee.type,
//                                         testid: fee.testId,
//                                         feesType: feesTypeName,
//                                         fees: fee.fees,
//                                         category: group.groupCategory,
//                                         discount: fee.discount,
//                                         tests: orderedTestFields,
//                                         labResults: labResultArray,
//                                     });
//                                 }
//                             }
//                         }
//                     } else {
//                         feesTypeName = feesType.name;
//                         reference_range = feesType.reference_range;
//                         units = feesType.units;
//                         category = feesType.category;
//                         comments = feesType.comments;
//                         method = feesType.method;

//                         const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });

//                         const labResultArray = labResults.map(result => ({
//                             result: result.result,
//                             abnormalValue: result.abnormalValue,
//                         }));

//                         data.feesData.push({
//                             id: fee._id,
//                             type: fee.type,
//                             testid: fee.testId,
//                             feesType: feesTypeName,
//                             fees: fee.fees,
//                             reference_range: reference_range,
//                             units: units,
//                             comments: comments,
//                             method: method,
//                             category: category,
//                             discount: fee.discount,
//                             labResults: labResultArray,
//                         });
//                     }
//                 }
//             }
//         }

//         const htmlContent = await generatePDF(data, id); // Pass id to the generatePDF function

//         const htmlToPDF = new HTMLToPDF();
//         const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

//         const pdfFilePath = `./reports/${id}.pdf`;
//         fs.writeFileSync(pdfFilePath, pdfBuffer);

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
//         res.status(200).end(pdfBuffer);
//     } catch (error) {
//         console.error('Error fetching or generating data:', error);
//         res.status(500).json({ error: 'An error occurred while processing the request' });
//     }
// };

// export const labReport = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { selectedTestsData } = req.body;

//         const bill = await Bill.findById(id)
//             .populate('refId', 'pName pNum pAge pGender pSalutation')
//             .populate('doctorName', 'drName')
//             .exec();

//         if (!bill) {
//             return res.status(404).json({ message: 'Bill not found' });
//         }

//         function formatDate(dateString) {
//             const date = new Date(dateString);
//             const day = date.getDate();
//             const month = date.getMonth() + 1;
//             const year = date.getFullYear();
//             return `${day}/${month}/${year}`;
//         }

//         const data = {
//             data: {
//                 billId: bill.billId,
//                 pName: bill.refId.pName,
//                 pAge: bill.refId.pAge,
//                 pGender: bill.refId.pGender,
//                 pSal: bill.refId.pSalutation,
//                 drName: bill.doctorName.drName,
//                 billAmount: bill.billAmount,
//                 amountDue: bill.amountDue,
//                 amountPaid: bill.amountPaid,
//                 billDate: formatDate(bill.createdAt),
//             },
//             feesData: [],
//         };

//         const feesData = await labResultDetail.find({ objbillId: id });

//         for (const fee of feesData) {
//             if (selectedTestsData.includes(fee.resultId.toString())) {
//                 let feesType = await getFeesType(fee.fieldId, fee.type);
//                 if (feesType) {
//                     let feesTypeName;
//                     let reference_range = '';
//                     let units = '';
//                     let category = '';
//                     let comments = '';
//                     let method = '';
//                     let labResultArray = [];

//                     if (fee.type === 'Profile') {
//                         feesTypeName = feesType.profileName;
//                         if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
//                             const profile = await CreateProfile.findById(fee.fieldId, 'testFields');
//                             if (profile) {
//                                 const groupTestFields = profile.testFields.filter(field => field.type === 'Group');
//                                 const singleTestFields = profile.testFields.filter(field => field.type !== 'Group');

//                                 let orderedTestFields = [];

//                                 if (groupTestFields.length > 0) {
//                                     const groupIds = groupTestFields.map(field => field.testId);
//                                     const groups = await GroupTest.find({ _id: { $in: groupIds } }, 'testFields groupCategory');
//                                     if (groups) {
//                                         for (const group of groups) {
//                                             const testIds = group.testFields.map(field => field.testId);
//                                             const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
//                                             if (testDetails) {
//                                                 const orderedGroupFields = group.testFields.map(field => {
//                                                     const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
//                                                     return {
//                                                         _id: testDetail._id,
//                                                         name: testDetail.name,
//                                                         reference_range: testDetail.reference_range,
//                                                         units: testDetail.units,
//                                                         category: testDetail.category,
//                                                         comments: testDetail.comments,
//                                                         method: testDetail.method,
//                                                         testid: fee.testId,
//                                                         type: fee.type,
//                                                     };
//                                                 });

//                                                 const labResults = await labResultDetail.find({
//                                                     objbillId: id,
//                                                     id: { $in: testIds }
//                                                 });

//                                                 const labResultArray = orderedGroupFields.map(test => {
//                                                     const groupTest = group.testFields.find(field => field.testId.equals(test._id));
//                                                     const testName = groupTest ? groupTest.subCat : '';
//                                                     const resultsForTest = labResults.filter(result => result.id.equals(test._id));
//                                                     const testResults = resultsForTest.map(result => ({
//                                                         testName: testName,
//                                                         result: result.result,
//                                                         abnormalValue: result.abnormalValue,
//                                                     }));
//                                                     return testResults;
//                                                 }).flat();

//                                                 orderedTestFields.push(...orderedGroupFields);

//                                                 data.feesData.push({
//                                                     id: fee._id,
//                                                     type: fee.type,
//                                                     testid: fee.testId,
//                                                     feesType: feesTypeName,
//                                                     fees: fee.fees,
//                                                     category: group.groupCategory,
//                                                     discount: fee.discount,
//                                                     tests: orderedGroupFields,
//                                                     labResults: labResultArray,
//                                                 });
//                                             }
//                                         }
//                                     }
//                                 }

//                                 if (singleTestFields.length > 0) {
//                                     const singleTestIds = singleTestFields.map(field => field.testId);
//                                     const singleTestDetails = await Test.find({ _id: { $in: singleTestIds } }, 'reference_range units name category comments method');
//                                     if (singleTestDetails) {
//                                         const orderedSingleTestFields = singleTestFields.map(field => {
//                                             const testDetail = singleTestDetails.find(detail => detail._id.equals(field.testId));
//                                             return {
//                                                 _id: testDetail._id,
//                                                 name: testDetail.name,
//                                                 reference_range: testDetail.reference_range,
//                                                 units: testDetail.units,
//                                                 category: testDetail.category,
//                                                 comments: testDetail.comments,
//                                                 method: testDetail.method,
//                                                 testid: fee.testId,
//                                                 type: fee.type,
//                                             };
//                                         });

//                                         const labResults = await labResultDetail.find({
//                                             objbillId: id,
//                                             id: { $in: singleTestIds }
//                                         });

//                                         const labResultArray = orderedSingleTestFields.map(test => {
//                                             const resultsForTest = labResults.filter(result => result.id.equals(test._id));
//                                             const testResults = resultsForTest.map(result => ({
//                                                 testName: test.name,
//                                                 result: result.result,
//                                                 abnormalValue: result.abnormalValue,
//                                             }));
//                                             return testResults;
//                                         }).flat();

//                                         orderedTestFields.push(...orderedSingleTestFields);

//                                         data.feesData.push({
//                                             id: fee._id,
//                                             type: fee.type,
//                                             testid: fee.testId,
//                                             feesType: feesTypeName,
//                                             fees: fee.fees,
//                                             category: '',
//                                             discount: fee.discount,
//                                             tests: orderedSingleTestFields,
//                                             labResults: labResultArray,
//                                         });
//                                     }
//                                 }
//                             }
//                         }
//                     } else if (fee.type === 'Group') {
//                         feesTypeName = feesType.groupName;
//                         if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
//                             const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory');
//                             if (group) {
//                                 const testIds = group.testFields.map(field => field.testId);
//                                 const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
//                                 if (testDetails) {
//                                     const orderedTestFields = group.testFields.map(field => {
//                                         const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
//                                         return {
//                                             _id: testDetail._id,
//                                             name: testDetail.name,
//                                             reference_range: testDetail.reference_range,
//                                             units: testDetail.units,
//                                             category: testDetail.category,
//                                             comments: testDetail.comments,
//                                             method: testDetail.method,
//                                             testid: fee.testId,
//                                             type: fee.type,
//                                         };
//                                     });

//                                     const labResults = await labResultDetail.find({
//                                         objbillId: id,
//                                         id: { $in: testIds }
//                                     });

//                                     const labResultArray = orderedTestFields.map(test => {
//                                         const groupTest = group.testFields.find(field => field.testId.equals(test._id));
//                                         const testName = groupTest ? groupTest.subCat : '';
//                                         const resultsForTest = labResults.filter(result => result.id.equals(test._id));
//                                         const testResults = resultsForTest.map(result => ({
//                                             testName: testName,
//                                             result: result.result,
//                                             abnormalValue: result.abnormalValue,
//                                         }));
//                                         return testResults;
//                                     }).flat();

//                                     data.feesData.push({
//                                         id: fee._id,
//                                         type: fee.type,
//                                         testid: fee.testId,
//                                         feesType: feesTypeName,
//                                         fees: fee.fees,
//                                         category: group.groupCategory,
//                                         discount: fee.discount,
//                                         tests: orderedTestFields,
//                                         labResults: labResultArray,
//                                     });
//                                 }
//                             }
//                         }
//                     } else {
//                         feesTypeName = feesType.name;
//                         reference_range = feesType.reference_range;
//                         units = feesType.units;
//                         category = feesType.category;
//                         comments = feesType.comments;
//                         method = feesType.method;

//                         const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });

//                         const labResultArray = labResults.map(result => ({
//                             result: result.result,
//                             abnormalValue: result.abnormalValue,
//                         }));

//                         data.feesData.push({
//                             id: fee._id,
//                             type: fee.type,
//                             testid: fee.testId,
//                             feesType: feesTypeName,
//                             fees: fee.fees,
//                             reference_range: reference_range,
//                             units: units,
//                             comments: comments,
//                             method: method,
//                             category: category,
//                             discount: fee.discount,
//                             labResults: labResultArray,
//                         });
//                     }
//                 }
//             }
//         }

//         const htmlContent = await generatePDF(data, id); // Pass id to the generatePDF function

//         const htmlToPDF = new HTMLToPDF();
//         const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

//         const pdfFilePath = `./reports/${id}.pdf`;
//         fs.writeFileSync(pdfFilePath, pdfBuffer);

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
//         res.status(200).end(pdfBuffer);
//     } catch (error) {
//         console.error('Error fetching or generating data:', error);
//         res.status(500).json({ error: 'An error occurred while processing the request' });
//     }
// };

export const labReport = async (req, res) => {
    try {
        const id = req.params.id;
        const { selectedTestsData } = req.body;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                pSal: bill.refId.pSalutation,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                billDate: formatDate(bill.createdAt),
            },
            feesData: [],
        };

        const feesData = await labResultDetail.find({ objbillId: id });

        for (const fee of feesData) {
            if (selectedTestsData.includes(fee.resultId.toString())) {
                let feesType = await getFeesType(fee.fieldId, fee.type);
                if (feesType) {
                    let feesTypeName;
                    let reference_range = '';
                    let units = '';
                    let category = '';
                    let comments = '';
                    let method = '';
                    let groupName = ''; // Initialize groupName variable
                    let labResultArray = [];

                    if (fee.type === 'Profile') {
                        console.log('profile');
                        feesTypeName = feesType.profileName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            const profile = await CreateProfile.findById(fee.fieldId, 'testFields');
                            if (profile) {
                                const groupTestFields = profile.testFields.filter(field => field.type === 'Group');
                                const singleTestFields = profile.testFields.filter(field => field.type !== 'Group');

                                let orderedTestFields = [];

                                if (groupTestFields.length > 0) {
                                    const groupIds = groupTestFields.map(field => field.testId);
                                    const groups = await GroupTest.find({ _id: { $in: groupIds } }, 'testFields groupCategory groupName'); // Fetch groupName
                                    if (groups) {
                                        for (const group of groups) {
                                            groupName = group.groupName; // Assign groupName
                                            const testIds = group.testFields.map(field => field.testId);
                                            const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
                                            if (testDetails) {
                                                const orderedGroupFields = group.testFields.map(field => {
                                                    const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                                    return {
                                                        _id: testDetail._id,
                                                        name: testDetail.name,
                                                        reference_range: testDetail.reference_range,
                                                        units: testDetail.units,
                                                        category: testDetail.category,
                                                        comments: testDetail.comments,
                                                        method: testDetail.method,
                                                        testid: fee.testId,
                                                        type: fee.type,
                                                    };
                                                });

                                                const labResults = await labResultDetail.find({
                                                    objbillId: id,
                                                    id: { $in: testIds }
                                                });

                                                const labResultArray = orderedGroupFields.map(test => {
                                                    const groupTest = group.testFields.find(field => field.testId.equals(test._id));
                                                    const testName = groupTest ? groupTest.subCat : '';
                                                    const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                                    const testResults = resultsForTest.map(result => ({
                                                        testName: testName,
                                                        result: result.result,
                                                        abnormalValue: result.abnormalValue,
                                                    }));
                                                    return testResults;
                                                }).flat();

                                                // const labResultArray = orderedTestFields.map(test => {
                                                //     // Find corresponding group test details
                                                //     const groupTest = group.testFields.find(field => field.testId.equals(test._id));
                                                //     const testName = groupTest ? groupTest.subCat : '';
                                                
                                                //     // Filter results for the current test
                                                //     const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                                
                                                //     // If no results are found, you can either skip adding an entry or add a placeholder entry
                                                //     const testResults = resultsForTest.length > 0 ? resultsForTest.map(result => ({
                                                //         testName: testName,
                                                //         result: result.result,
                                                //         abnormalValue: result.abnormalValue,
                                                //     })) : [{
                                                //         testName: testName,
                                                //         result: '',
                                                //         abnormalValue: '',
                                                //     }];
                                                
                                                //     return testResults;
                                                // }).flat();
                                                
                                                orderedTestFields.push(...orderedGroupFields);

                                                data.feesData.push({
                                                    id: fee._id,
                                                    type: fee.type,
                                                    testid: fee.testId,
                                                    feesType: feesTypeName,
                                                    fees: fee.fees,
                                                    category: group.groupCategory,
                                                    groupName: groupName, // Include groupName
                                                    discount: fee.discount,
                                                    tests: orderedGroupFields,
                                                    labResults: labResultArray,
                                                });
                                            }
                                        }
                                    }
                                }

                              
                            }
                        }
                    } else if (fee.type === 'Group') {
                        feesTypeName = feesType.groupName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory groupName');
                            if (group) {
                                groupName = group.groupName; // Assign groupName
                                const testIds = group.testFields.map(field => field.testId);
                                const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
                                if (testDetails) {
                                    const orderedTestFields = group.testFields.map(field => {
                                        const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                        return {
                                            _id: testDetail._id,
                                            name: testDetail.name,
                                            reference_range: testDetail.reference_range,
                                            units: testDetail.units,
                                            category: testDetail.category,
                                            comments: testDetail.comments,
                                            method: testDetail.method,
                                            testid: fee.testId,
                                            type: fee.type,
                                        };
                                    });

                                    const labResults = await labResultDetail.find({
                                        objbillId: id,
                                        id: { $in: testIds }
                                    });

                                    // const labResultArray = orderedTestFields.map(test => {
                                    //     const groupTest = group.testFields.find(field => field.testId.equals(test._id));
                                    //     const testName = groupTest ? groupTest.subCat : '';
                                    //     const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                    //     const testResults = resultsForTest.map(result => ({
                                    //         testName: testName,
                                    //         result: result.result,
                                    //         abnormalValue: result.abnormalValue,
                                    //     }));
                                    //     return testResults;
                                    // }).flat();

                                    const labResultArray = orderedTestFields.map(test => {
                                        // Find corresponding group test details
                                        const groupTest = group.testFields.find(field => field.testId.equals(test._id));
                                        const testName = groupTest ? groupTest.subCat : '';
                                    
                                        // Filter results for the current test
                                        const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                    
                                        // If no results are found, you can either skip adding an entry or add a placeholder entry
                                        const testResults = resultsForTest.length > 0 ? resultsForTest.map(result => ({
                                            testName: testName,
                                            result: result.result,
                                            abnormalValue: result.abnormalValue,
                                        })) : [{
                                            testName: '',
                                            result: '',
                                            abnormalValue: '',
                                        }];
                                    
                                        return testResults;
                                    }).flat();
                                    

                                    data.feesData.push({
                                        id: fee._id,
                                        type: fee.type,
                                        testid: fee.testId,
                                        feesType: feesTypeName,
                                        fees: fee.fees,
                                        category: group.groupCategory,
                                        groupName: groupName, // Include groupName
                                        discount: fee.discount,
                                        tests: orderedTestFields,
                                        labResults: labResultArray,
                                    });
                                }
                            }
                        }
                    } else {
                        feesTypeName = feesType.name;
                        reference_range = feesType.reference_range;
                        units = feesType.units;
                        category = feesType.category;
                        comments = feesType.comments;
                        method = feesType.method;

                        const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });

                        const labResultArray = labResults.map(result => ({
                            result: result.result,
                            abnormalValue: result.abnormalValue,
                        }));

                        data.feesData.push({
                            id: fee._id,
                            type: fee.type,
                            testid: fee.testId,
                            feesType: feesTypeName,
                            fees: fee.fees,
                            reference_range: reference_range,
                            units: units,
                            comments: comments,
                            method: method,
                            category: category,
                            groupName: '', // No groupName for non-profile/group tests
                            discount: fee.discount,
                            labResults: labResultArray,
                        });
                    }
                }
            }
        }

        const htmlContent = await generatePDF(data, id); // Pass id to the generatePDF function

        const htmlToPDF = new HTMLToPDF();
        const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

        const pdfFilePath = `./reports/${id}.pdf`;
        fs.writeFileSync(pdfFilePath, pdfBuffer);

          // Upload to Hostinger
          const remoteFilePath = `/public_html/labReports/${id}.pdf`; // Adjust this path as needed
          await uploadToHostinger(pdfFilePath, remoteFilePath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
        res.status(200).end(pdfBuffer);
    } catch (error) {
        console.error('Error fetching or generating data:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};


// const generatePDF = async (data, id) => {
//     const doctorImagePath = './images/doctorSign.png';
//     const doctorImageBuffer = fs.readFileSync(doctorImagePath);
//     const doctorImageBase64 = doctorImageBuffer.toString('base64');

//     const labImagePath = './images/labSign.png';
//     const labImageBuffer = fs.readFileSync(labImagePath);
//     const labImageBase64 = labImageBuffer.toString('base64');

//     // Generate the QR code
//     const qrCodeUrl = `https://memocares.com/labReports/${id}.pdf`;
//     const qrCodeData = await QRCode.toDataURL(qrCodeUrl);

//     const getPatientDetails = () => `
//         <tr class="patient-details">
//             <td colspan="2">
//                 Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Referred By: <strong>${data.data.drName}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//             </td>
//             <td colspan="2">
//                 Report ID: <strong>${data.data.billId}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Sampling Date: <strong>${data.data.billDate}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Report Date: <strong>${data.data.billDate}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//             </td>
//         </tr>
//         <tr class="table-header">
//             <th style="width: 45%;">Test Name</th>
//             <th style="width: 25%; text-align: center;">Result</th>
//             <th style="width: 30%;">Reference Range</th>
//             <th style="width: 10%;">Unit</th>
//         </tr>
//         <tr>
//             <td colspan="4">
//                 <hr style="border: 1px solid #000;">
//             </td>
//         </tr>
//     `;

//     const generateGroupSection = (details) => `
//         <table>
//             <thead>
//                 ${getPatientDetails()}
//             </thead>
//             <tbody>
//                 <tr style="height: 10px;"></tr>
//                 <tr class="group-header">
//                     <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
//                 </tr>
//                 ${details.feesType ? `<tr>
//                     <td style="text-align:left;"><strong>${details.feesType}</strong></td>
//                 </tr>` : ''}
//                 ${details.tests.map((test, testIndex) => {
//         const labResult = details.labResults[testIndex] || {};
//         const testName = labResult.testName || '';
//         const abnormalValue = labResult.abnormalValue || '';
//         const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
//             `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

//         return `
//                     ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
//                     <tr>
//                         <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
//                         <td style="text-align:center">${formattedResult}</td>
//                         <td>${test.reference_range || ''}</td>
//                         <td>${test.units || ''}</td>
//                     </tr>
//                      `;
//     }).join('')}
//             </tbody>
//         </table>
//         <div class="page-break"></div>
//     `;

//     const generateProfileSection = (details) => `
//         <table>
//             <thead>
//                 ${getPatientDetails()}
//             </thead>
//             <tbody>
//                 <tr style="height: 10px;"></tr>
//                 <tr class="profile-header">
//                     <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
//                 </tr>
//                 ${details.feesType ? `<tr>
//                     <td colspan="4" style="text-align:left;"><strong>${details.feesType}</strong></td>
//                 </tr>` : ''}
//                  ${details.groupName ? `<tr>
//                     <td style="text-align:left;"><strong>${details.groupName}</strong></td>
//                 </tr>` : ''}
//                 ${details.tests.map((test, testIndex) => {
//         const labResult = details.labResults[testIndex] || {};
//         const testName = labResult.testName || '';
//         const abnormalValue = labResult.abnormalValue || '';
//         const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
//             `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

//         return `
//                     ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
//                     <tr>
//                         <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
//                         <td style="text-align:center">${formattedResult}</td>
//                         <td>${test.reference_range || ''}</td>
//                         <td>${test.units || ''}</td>
//                     </tr>
//                      `;
//     }).join('')}
//             </tbody>
//         </table>
//         <div class="page-break"></div>
//     `;

//     // Group single tests by category
//     const groupedSingleTests = data.feesData.reduce((acc, details) => {
//         if (details.type !== 'Group' && details.type !== 'Profile') {
//             const category = details.category || 'Miscellaneous';
//             if (!acc[category]) {
//                 acc[category] = [];
//             }
//             acc[category].push(details);
//         }
//         return acc;
//     }, {});

//     // Generate HTML content
//     const htmlContent = `
//     <html>
//     <head>
//         <style>
//             @page {
//                 margin: 20mm;
//             }
//             .group-header, .profile-header {
//                 page-break-before: always;
//             }
//             .patient-details, .table-header {
//                 text-align: left;
//                 font-size: 15px;
//             }
//             .table-header th {
//                 font-size: 15px;
//                 text-align: left;
//             }
//             table {
//                 width: 100%;
//                 border-collapse: collapse;
//             }
//             th, td {
//                 padding: 5px;
//             }
//             th {
//                 background-color: #f2f2f2;
//             }
//             .end-report {
//                 margin-top: 20px;
//                 text-align: center;
//                 font-size: 16px;
//             }
//             .signatures {
//                 display: flex;
//                 justify-content: space-between;
//                 margin-top: 10px;
//             }
//             .signatures div {
//                 width: 30%;
//                 text-align: center;
//             }
//             .signatures p {
//                 margin: 0px;
//                 font-size: 14px;
//             }
//             .signatures img {
//                 width: 50%;
//                 height: auto;
//             }
//             .qr-code {
//                 text-align: center;
//                 margin-top: 20px;
//             }
//             .page-break {
//                 page-break-before: always;
//             }
//         </style>
//     </head>
//     <body>
//         ${data.feesData.map((details) => {
//         if (details.type === 'Group') {
//             return generateGroupSection(details);
//         }
//         if (details.type === 'Profile') {
//             return generateProfileSection(details);
//         }
//         return '';
//     }).join('')}

//         <table>
//     <thead>
//         <!-- Patient details row -->
//         <tr class="patient-details">
//             <td colspan="2">
//                 Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Referred By: <strong>${data.data.drName}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//             </td>
//             <td colspan="2">
//                 Report ID: <strong>${data.data.billId}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Sampling Date: <strong>${data.data.billDate}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//                 Report Date: <strong>${data.data.billDate}</strong>
//                 <div style="margin-bottom: 10px;"></div>
//             </td>
//         </tr>
//         <!-- Table header row -->
//         <tr class="table-header">
//             <th style="width: 45%;">Test Name</th>
//             <th style="width: 25%; text-align: center;">Result</th>
//             <th style="width: 30%;">Reference Range</th>
//             <th style="width: 10%;">Unit</th>
//         </tr>
//         <!-- Horizontal rule for separation -->
//         <tr>
//             <td colspan="4">
//                 <hr style="border: 1px solid #000;">
//             </td>
//         </tr>
//     </thead>
//     <tbody>
//         <!-- Rows for the tests will be added here -->
//         ${Object.keys(groupedSingleTests).map(category => `
//             <tr class="group-header">
//                 <td colspan="4" style="text-align:center;"><strong>${category}</strong></td>
//             </tr>
//             ${groupedSingleTests[category].map((details) => `
//                 <tr>
//                     <td>${details.feesType} ${details.method ? `<br>(${details.method})` : ''}</td>
//                     <td style="text-align:center;">
//                         ${details.labResults[0] ?
//                             (details.labResults[0].abnormalValue === 'L' || details.labResults[0].abnormalValue === 'H' ?
//                                 `<strong style="color: red;">${details.labResults[0].result || ''}</strong>` :
//                                 details.labResults[0].result || '') : ''}
//                     </td>
//                     <td>${details.reference_range || ''}</td>
//                     <td>${details.units || ''}</td>
//                 </tr>
//                 ${details.comments ? `
//                     <tr>
//                         <td style="padding-left: 15px; word-wrap: break-word;" colspan="4">
//                             ${details.comments}
//                         </td>
//                     </tr>` : ''}
//             `).join('')}
//         `).join('')}
//     </tbody>
// </table>

        
//         <div class="end-report">
//           <strong>  *** End of Report *** </strong>
//         </div>
//         <div class="signatures">
//             <div>
//                 <img src="data:image/png;base64,${labImageBase64}" alt="Lab Sign">
//                 <p><strong>Lab Technician</strong></p>
//             </div>
//             <div class="qr-code">
//               <img src="${qrCodeData}" alt="QR Code">
//            </div>
//             <div>
//                 <img src="data:image/png;base64,${doctorImageBase64}" alt="Doctor Sign">
//                 <p><strong>Pathologist</strong></p>
//             </div>
//         </div>
       
//     </body>
//     </html>`;

//     return htmlContent;
// };


const generatePDF = async (data, id) => {
    const doctorImagePath = './images/doctorSign.png';
    const doctorImageBuffer = fs.readFileSync(doctorImagePath);
    const doctorImageBase64 = doctorImageBuffer.toString('base64');

    const labImagePath = './images/labSign.png';
    const labImageBuffer = fs.readFileSync(labImagePath);
    const labImageBase64 = labImageBuffer.toString('base64');

    // Generate the QR code
    const qrCodeUrl = `https://demo.com/labReports/${id}.pdf`;
    const qrCodeData = await QRCode.toDataURL(qrCodeUrl);

     // Generate the barcode
     const barcodeData = await new Promise((resolve, reject) => {
        BwipJs.toBuffer({
            bcid: 'code128',       // Barcode type
            text: `${data.data.pSal} ${data.data.pName} ${data.data.pGender} ${data.data.pAge}`, // Text to encode
            scale: 3,              // 3x scaling factor
            height: 10,            // Bar height, in millimeters
            includetext: false,    // Do not show human-readable text
            textxalign: 'center',  // Align text to center (won't matter as text is not included)
        }, (err, png) => {
            if (err) {
                reject(err);
            } else {
                resolve(`data:image/png;base64,${png.toString('base64')}`);
            }
        });
    });
    

    const getPatientDetails = () => `
        <tr class="patient-details">
            <td colspan="1">
                Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong>
                <div style="margin-bottom: 10px;"></div>
                Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong>
                <div style="margin-bottom: 10px;"></div>
                Referred By: <strong>${data.data.drName}</strong>
                <div style="margin-bottom: 10px;"></div>
            </td>
             <td colspan="1">
                 <div class="barcode">
                     <img src="${barcodeData}" alt="Barcode" />
                 </div>
            </td>
            <td colspan="1">
                Report ID: <strong>${data.data.billId}</strong>
                <div style="margin-bottom: 10px;"></div>
                Sampling Date: <strong>${data.data.billDate}</strong>
                <div style="margin-bottom: 10px;"></div>
                Report Date: <strong>${data.data.billDate}</strong>
                <div style="margin-bottom: 10px;"></div>
            </td>
        </tr>
        <tr class="table-header">
            <th style="width: 45%;">Test Name</th>
            <th style="width: 25%; text-align: center;">Result</th>
            <th style="width: 30%;">Reference Range</th>
            <th style="width: 10%;">Unit</th>
        </tr>
        <tr>
            <td colspan="4">
                <hr style="border: 1px solid #000;">
            </td>
        </tr>
    `;

    const generateGroupSection = (details) => `
        <table>
            <thead>
                ${getPatientDetails()}
            </thead>
            <tbody>
                <tr style="height: 10px;"></tr>
                <tr class="group-header">
                    <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
                </tr>
                ${details.feesType ? `<tr>
                    <td style="text-align:left;"><strong>${details.feesType}</strong></td>
                </tr>` : ''}
                ${details.tests.map((test, testIndex) => {
        const labResult = details.labResults[testIndex] || {};
        const testName = labResult.testName || '';
        const abnormalValue = labResult.abnormalValue || '';
        const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
            `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

        return `
                    ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
                    <tr>
                        <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
                        <td style="text-align:center">${formattedResult}</td>
                        <td>${test.reference_range || ''}</td>
                        <td>${test.units || ''}</td>
                    </tr>
                     `;
    }).join('')}
            </tbody>
        </table>
        <div class="page-break"></div>
    `;

    const generateProfileSection = (details) => `
        <table>
            <thead>
                ${getPatientDetails()}
            </thead>
            <tbody>
                <tr style="height: 10px;"></tr>
                <tr class="profile-header">
                    <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
                </tr>
                ${details.feesType ? `<tr>
                    <td colspan="4" style="text-align:left;"><strong>${details.feesType}</strong></td>
                </tr>` : ''}
                 ${details.groupName ? `<tr>
                    <td style="text-align:left;"><strong>${details.groupName}</strong></td>
                </tr>` : ''}
                ${details.tests.map((test, testIndex) => {
        const labResult = details.labResults[testIndex] || {};
        const testName = labResult.testName || '';
        const abnormalValue = labResult.abnormalValue || '';
        const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
            `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

        return `
                    ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
                    <tr>
                        <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
                        <td style="text-align:center">${formattedResult}</td>
                        <td>${test.reference_range || ''}</td>
                        <td>${test.units || ''}</td>
                    </tr>
                     `;
    }).join('')}
            </tbody>
        </table>
        <div class="page-break"></div>
    `;

    // Group single tests by category
    const groupedSingleTests = data.feesData.reduce((acc, details) => {
        if (details.type !== 'Group' && details.type !== 'Profile') {
            const category = details.category || 'Miscellaneous';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(details);
        }
        return acc;
    }, {});

    // Generate HTML content
    const htmlContent = `
    <html>
    <head>
        <style>
            @page {
                margin: 20mm;
            }
            .group-header, .profile-header {
                page-break-before: always;
            }
            .patient-details, .table-header {
                text-align: left;
                font-size: 15px;
            }
            .table-header th {
                font-size: 15px;
                text-align: left;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 5px;
            }
            th {
                background-color: #f2f2f2;
            }
            .end-report {
                margin-top: 20px;
                text-align: center;
                font-size: 16px;
            }
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            }
            .signatures div {
                width: 30%;
                text-align: center;
            }
            .signatures p {
                margin: 0px;
                font-size: 14px;
            }
            .signatures img {
                width: 50%;
                height: auto;
            }
            .qr-code {
                text-align: center;
                margin-top: 20px;
            }
            .page-break {
                page-break-before: always;
            }
                .barcode img {
                width: 150px; /* Adjust the width as needed */
                height: 30px; /* Maintain aspect ratio */
            }
           
        </style>
    </head>
    <body>
        ${data.feesData.map((details) => {
        if (details.type === 'Group') {
            return generateGroupSection(details);
        }
        if (details.type === 'Profile') {
            return generateProfileSection(details);
        }
        return '';
    }).join('')}

        <table>
    <thead>
        <!-- Patient details row -->
        <tr class="patient-details">
            <td colspan="1">
                Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong>
                <div style="margin-bottom: 10px;"></div>
                Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong>
                <div style="margin-bottom: 10px;"></div>
                Referred By: <strong>${data.data.drName}</strong>
                <div style="margin-bottom: 10px;"></div>
            </td>
            <td colspan="1">
                 <div class="barcode">
                     <img src="${barcodeData}" alt="Barcode" />
                 </div>
            </td>
            <td colspan="1">    
                Report ID: <strong>${data.data.billId}</strong>
                <div style="margin-bottom: 10px;"></div>
                Sampling Date: <strong>${data.data.billDate}</strong>
                <div style="margin-bottom: 10px;"></div>
                Report Date: <strong>${data.data.billDate}</strong>
                <div style="margin-bottom: 10px;"></div>
            </td>
        </tr> 
        <!-- Table header row -->
        <tr class="table-header">
            <th style="width: 45%;">Test Name</th>
            <th style="width: 25%; text-align: center;">Result</th>
            <th style="width: 30%;">Reference Range</th>
            <th style="width: 10%;">Unit</th>
        </tr>
        <!-- Horizontal rule for separation -->
        <tr>
            <td colspan="4">
                <hr style="border: 1px solid #000;">
            </td>
        </tr>
    </thead>
    <tbody>
        <!-- Rows for the tests will be added here -->
        ${Object.keys(groupedSingleTests).map(category => `
            <tr class="group-header">
                <td colspan="4" style="text-align:center;"><strong>${category}</strong></td>
            </tr>
            ${groupedSingleTests[category].map((details) => `
                <tr>
                    <td>${details.feesType} ${details.method ? `<br>(${details.method})` : ''}</td>
                    <td style="text-align:center;">
                        ${details.labResults[0] ?
                            (details.labResults[0].abnormalValue === 'L' || details.labResults[0].abnormalValue === 'H' ?
                                `<strong style="color: red;">${details.labResults[0].result || ''}</strong>` :
                                details.labResults[0].result || '') : ''}
                    </td>
                    <td>${details.reference_range || ''}</td>
                    <td>${details.units || ''}</td>
                </tr>
                ${details.comments ? `
                    <tr>
                        <td style="padding-left: 15px; word-wrap: break-word;" colspan="4">
                            ${details.comments}
                        </td>
                    </tr>` : ''}
            `).join('')}
        `).join('')}
    </tbody>
</table>

        
        <div class="end-report">
          <strong>  *** End of Report *** </strong>
        </div>
        <div class="signatures">
            <div>
                <img src="data:image/png;base64,${labImageBase64}" alt="Lab Sign">
                <p><strong>Lab Technician</strong></p>
            </div>
            <div class="qr-code">
              <img src="${qrCodeData}" alt="QR Code">
           </div>
            <div>
                <img src="data:image/png;base64,${doctorImageBase64}" alt="Doctor Sign">
                <p><strong>Pathologist</strong></p>
            </div>
            
        </div>
       
    </body>
    </html>`;

    return htmlContent;
};






// export const WHlabReport = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { selectedTestsData } = req.body;

//         const bill = await Bill.findById(id)
//             .populate('refId', 'pName pNum pAge pGender pSalutation')
//             .populate('doctorName', 'drName')
//             .exec();

//         if (!bill) {
//             return res.status(404).json({ message: 'Bill not found' });
//         }

//         function formatDate(dateString) {
//             const date = new Date(dateString);
//             const day = date.getDate();
//             const month = date.getMonth() + 1;
//             const year = date.getFullYear();
//             return `${day}/${month}/${year}`;
//         }

//         const data = {
//             data: {
//                 billId: bill.billId,
//                 pName: bill.refId.pName,
//                 pAge: bill.refId.pAge,
//                 pGender: bill.refId.pGender,
//                 pSal: bill.refId.pSalutation,
//                 drName: bill.doctorName.drName,
//                 billAmount: bill.billAmount,
//                 amountDue: bill.amountDue,
//                 amountPaid: bill.amountPaid,
//                 billDate: formatDate(bill.createdAt),
//             },
//             feesData: [],
//         };

//         const feesData = await labResultDetail.find({ objbillId: id });

//         for (const fee of feesData) {
//             if (selectedTestsData.includes(fee.resultId.toString())) {
//                 let feesType = await getFeesType(fee.fieldId, fee.type);
//                 if (feesType) {
//                     let feesTypeName;
//                     let reference_range = '';
//                     let units = '';
//                     let category = '';
//                     let comments = '';
//                     let method = '';
//                     let labResultArray = [];

//                     if (fee.type === 'Profile') {
//                         // Your code for profile type tests
//                     } else if (fee.type === 'Group') {
//                         feesTypeName = feesType.groupName;
//                         if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
//                             const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory');
//                             if (group) {
//                                 const testIds = group.testFields.map(field => field.testId);
//                                 const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
//                                 if (testDetails) {
//                                     const orderedTestFields = group.testFields.map(field => {
//                                         const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
//                                         return {
//                                             _id: testDetail._id,
//                                             name: testDetail.name,
//                                             reference_range: testDetail.reference_range,
//                                             units: testDetail.units,
//                                             category: testDetail.category,
//                                             comments: testDetail.comments,
//                                             method: testDetail.method,
//                                             testid: fee.testId,
//                                             type: fee.type,
//                                         };
//                                     });

//                                     // Fetch lab results based on the test ID
//                                     const labResults = await labResultDetail.find({
//                                         objbillId: id,
//                                         id: { $in: testIds } // Filter by IDs
//                                     });

//                                     const labResultArray = orderedTestFields.map(test => {
//                                         const groupTest = group.testFields.find(field => field.testId.equals(test._id));

//                                         // Assuming that the testName is a property of the groupTest object
//                                         const testName = groupTest ? groupTest.subCat : '';

//                                         const resultsForTest = labResults.filter(result => result.id.equals(test._id));

//                                         // Extracting both result and abnormalValue
//                                         const testResults = resultsForTest.map(result => ({
//                                             testName: testName,
//                                             result: result.result,
//                                             abnormalValue: result.abnormalValue, // Assuming there's an abnormalValue field in labResultDetail
//                                         }));

//                                         return testResults;
//                                     }).flat(); // Use flat to flatten the nested arrays

//                                     data.feesData.push({
//                                         id: fee._id,
//                                         type: fee.type,
//                                         testid: fee.testId,
//                                         feesType: feesTypeName,
//                                         fees: fee.fees,
//                                         category: group.groupCategory,
//                                         discount: fee.discount,
//                                         tests: orderedTestFields,
//                                         labResults: labResultArray,
//                                     });
//                                 }
//                             }
//                         }
//                     } else {
//                         feesTypeName = feesType.name;
//                         reference_range = feesType.reference_range;
//                         units = feesType.units;
//                         category = feesType.category;
//                         comments = feesType.comments;
//                         method = feesType.method;

//                         const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });

//                         const labResultArray = labResults.map(result => ({
//                             result: result.result,
//                             abnormalValue: result.abnormalValue,
//                         }));

//                         data.feesData.push({
//                             id: fee._id,
//                             type: fee.type,
//                             testid: fee.testId,
//                             feesType: feesTypeName,
//                             fees: fee.fees,
//                             reference_range: reference_range,
//                             units: units,
//                             comments: comments,
//                             method: method,
//                             category: category,
//                             discount: fee.discount,
//                             labResults: labResultArray,
//                         });
//                     }
//                 }
//             }
//         }

//         const htmlContent = await WHgeneratePDF(data, id); // Pass id to the generatePDF function

//         const htmlToPDF = new WHHTMLToPDF();
//         const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

//         const pdfFilePath = `./reports/${id}.pdf`;
//         fs.writeFileSync(pdfFilePath, pdfBuffer);

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
//         res.status(200).end(pdfBuffer);
//     } catch (error) {
//         console.error('Error fetching or generating data:', error);
//         res.status(500).json({ error: 'An error occurred while processing the request' });
//     }
// };


export const WHlabReport = async (req, res) => {
    try {
        const id = req.params.id;
        const { selectedTestsData } = req.body;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                pSal: bill.refId.pSalutation,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                billDate: formatDate(bill.createdAt),
            },
            feesData: [],
        };

        const feesData = await labResultDetail.find({ objbillId: id });

        for (const fee of feesData) {
            if (selectedTestsData.includes(fee.resultId.toString())) {
                let feesType = await getFeesType(fee.fieldId, fee.type);
                if (feesType) {
                    let feesTypeName;
                    let reference_range = '';
                    let units = '';
                    let category = '';
                    let comments = '';
                    let method = '';
                    let groupName = ''; // Initialize groupName variable
                    let labResultArray = [];

                    if (fee.type === 'Profile') {
                        feesTypeName = feesType.profileName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            const profile = await CreateProfile.findById(fee.fieldId, 'testFields');
                            if (profile) {
                                const groupTestFields = profile.testFields.filter(field => field.type === 'Group');
                                const singleTestFields = profile.testFields.filter(field => field.type !== 'Group');

                                let orderedTestFields = [];

                                if (groupTestFields.length > 0) {
                                    const groupIds = groupTestFields.map(field => field.testId);
                                    const groups = await GroupTest.find({ _id: { $in: groupIds } }, 'testFields groupCategory groupName'); // Fetch groupName
                                    if (groups) {
                                        for (const group of groups) {
                                            groupName = group.groupName; // Assign groupName
                                            const testIds = group.testFields.map(field => field.testId);
                                            const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
                                            if (testDetails) {
                                                const orderedGroupFields = group.testFields.map(field => {
                                                    const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                                    return {
                                                        _id: testDetail._id,
                                                        name: testDetail.name,
                                                        reference_range: testDetail.reference_range,
                                                        units: testDetail.units,
                                                        category: testDetail.category,
                                                        comments: testDetail.comments,
                                                        method: testDetail.method,
                                                        testid: fee.testId,
                                                        type: fee.type,
                                                    };
                                                });

                                                const labResults = await labResultDetail.find({
                                                    objbillId: id,
                                                    id: { $in: testIds }
                                                });

                                                const labResultArray = orderedGroupFields.map(test => {
                                                    const groupTest = group.testFields.find(field => field.testId.equals(test._id));
                                                    const testName = groupTest ? groupTest.subCat : '';
                                                    const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                                    const testResults = resultsForTest.map(result => ({
                                                        testName: testName,
                                                        result: result.result,
                                                        abnormalValue: result.abnormalValue,
                                                    }));
                                                    return testResults;
                                                }).flat();

                                                orderedTestFields.push(...orderedGroupFields);

                                                data.feesData.push({
                                                    id: fee._id,
                                                    type: fee.type,
                                                    testid: fee.testId,
                                                    feesType: feesTypeName,
                                                    fees: fee.fees,
                                                    category: group.groupCategory,
                                                    groupName: groupName, // Include groupName
                                                    discount: fee.discount,
                                                    tests: orderedGroupFields,
                                                    labResults: labResultArray,
                                                });
                                            }
                                        }
                                    }
                                }

                                // if (singleTestFields.length > 0) {
                                //     const singleTestIds = singleTestFields.map(field => field.testId);
                                //     const singleTestDetails = await Test.find({ _id: { $in: singleTestIds } }, 'reference_range units name category comments method');
                                //     if (singleTestDetails) {
                                //         const orderedSingleTestFields = singleTestFields.map(field => {
                                //             const testDetail = singleTestDetails.find(detail => detail._id.equals(field.testId));
                                //             return {
                                //                 _id: testDetail._id,
                                //                 name: testDetail.name,
                                //                 reference_range: testDetail.reference_range,
                                //                 units: testDetail.units,
                                //                 category: testDetail.category,
                                //                 comments: testDetail.comments,
                                //                 method: testDetail.method,
                                //                 testid: fee.testId,
                                //                 type: fee.type,
                                //             };
                                //         });

                                //         const labResults = await labResultDetail.find({
                                //             objbillId: id,
                                //             id: { $in: singleTestIds }
                                //         });

                                //         const labResultArray = orderedSingleTestFields.map(test => {
                                //             const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                //             const testResults = resultsForTest.map(result => ({
                                //                 testName: test.name,
                                //                 result: result.result,
                                //                 abnormalValue: result.abnormalValue,
                                //             }));
                                //             return testResults;
                                //         }).flat();

                                //         orderedTestFields.push(...orderedSingleTestFields);

                                //         data.feesData.push({
                                //             id: fee._id,
                                //             type: fee.type,
                                //             testid: fee.testId,
                                //             feesType: feesTypeName,
                                //             fees: fee.fees,
                                //             category: '',
                                //             groupName: '', // No groupName for single tests
                                //             discount: fee.discount,
                                //             tests: orderedSingleTestFields,
                                //             labResults: labResultArray,
                                //         });
                                //     }
                                // }
                            }
                        }
                    } else if (fee.type === 'Group') {
                        feesTypeName = feesType.groupName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory groupName');
                            if (group) {
                                groupName = group.groupName; // Assign groupName
                                const testIds = group.testFields.map(field => field.testId);
                                const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
                                if (testDetails) {
                                    const orderedTestFields = group.testFields.map(field => {
                                        const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                        return {
                                            _id: testDetail._id,
                                            name: testDetail.name,
                                            reference_range: testDetail.reference_range,
                                            units: testDetail.units,
                                            category: testDetail.category,
                                            comments: testDetail.comments,
                                            method: testDetail.method,
                                            testid: fee.testId,
                                            type: fee.type,
                                        };
                                    });

                                    const labResults = await labResultDetail.find({
                                        objbillId: id,
                                        id: { $in: testIds }
                                    });

                                    const labResultArray = orderedTestFields.map(test => {
                                        const groupTest = group.testFields.find(field => field.testId.equals(test._id));
                                        const testName = groupTest ? groupTest.subCat : '';
                                        const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                        const testResults = resultsForTest.map(result => ({
                                            testName: testName,
                                            result: result.result,
                                            abnormalValue: result.abnormalValue,
                                        }));
                                        return testResults;
                                    }).flat();

                                    data.feesData.push({
                                        id: fee._id,
                                        type: fee.type,
                                        testid: fee.testId,
                                        feesType: feesTypeName,
                                        fees: fee.fees,
                                        category: group.groupCategory,
                                        groupName: groupName, // Include groupName
                                        discount: fee.discount,
                                        tests: orderedTestFields,
                                        labResults: labResultArray,
                                    });
                                }
                            }
                        }
                    } else {
                        feesTypeName = feesType.name;
                        reference_range = feesType.reference_range;
                        units = feesType.units;
                        category = feesType.category;
                        comments = feesType.comments;
                        method = feesType.method;

                        const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });

                        const labResultArray = labResults.map(result => ({
                            result: result.result,
                            abnormalValue: result.abnormalValue,
                        }));

                        data.feesData.push({
                            id: fee._id,
                            type: fee.type,
                            testid: fee.testId,
                            feesType: feesTypeName,
                            fees: fee.fees,
                            reference_range: reference_range,
                            units: units,
                            comments: comments,
                            method: method,
                            category: category,
                            groupName: '', // No groupName for non-profile/group tests
                            discount: fee.discount,
                            labResults: labResultArray,
                        });
                    }
                }
            }
        }

        const htmlContent = await WHgeneratePDF(data, id); // Pass id to the generatePDF function

        const htmlToPDF = new WHHTMLToPDF();
        const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

        const pdfFilePath = `./reports/${id}.pdf`;
        fs.writeFileSync(pdfFilePath, pdfBuffer);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
        res.status(200).end(pdfBuffer);
    } catch (error) {
        console.error('Error fetching or generating data:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};


export const cultureWHlabReport = async (req, res) => {
    try {
        const id = req.params.id;
        const { selectedTestsData } = req.body;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                pSal: bill.refId.pSalutation,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                billDate: formatDate(bill.createdAt),
            },
            feesData: [],
        };

        const feesData = await labResultDetail.find({ objbillId: id });

        for (const fee of feesData) {
            if (selectedTestsData.includes(fee.resultId.toString())) {
                const feesType = await getFeesType(fee.fieldId, fee.type);
                if (feesType) {
                    let feesTypeName;
                    let reference_range = '';
                    let units = '';
                    let category = '';
                    let comments = '';
                    let labResultArray = [];

                    if (fee.type === 'Profile') {
                        // Your code for profile type tests
                    } else if (fee.type === 'Group') {
                        feesTypeName = feesType.groupName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            // const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });
                            // labResultArray = labResults.map(result => ({
                            //     result: result.result,
                            // }));

                            const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory');
                            if (group) {
                                const testIds = group.testFields.map(field => field.testId);
                                const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments');
                                if (testDetails) {
                                    const orderedTestFields = group.testFields.map(field => {
                                        const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                        return {
                                            _id: testDetail._id,
                                            name: testDetail.name,
                                            reference_range: testDetail.reference_range,
                                            units: testDetail.units,
                                            category: testDetail.category,
                                            comments: testDetail.comments,
                                            testid: fee.testId,
                                            type: fee.type,
                                        };
                                    });

                                    // Fetch lab results based on the test ID
                                    const labResults = await labResultDetail.find({
                                        objbillId: id,
                                        id: { $in: testIds } // Filter by IDs
                                    });

                                    // console.log(labResults);


                                    // Map lab results for each test
                                    // const labResultArray = orderedTestFields.map(test => {
                                    //     const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                    //     return {
                                    //         result: resultsForTest.map(result => result.result),
                                    //     };
                                    // });

                                    const labResultArray = orderedTestFields.map(test => {
                                        const groupTest = group.testFields.find(field => field.testId.equals(test._id));

                                        // Assuming that the testName is a property of the groupTest object
                                        const testName = groupTest ? groupTest.subCat : '';

                                        const resultsForTest = labResults.filter(result => result.id.equals(test._id));

                                        return {
                                            testName: testName,
                                            result: resultsForTest.map(result => result.result),
                                        };
                                    });


                                    data.feesData.push({
                                        id: fee._id,
                                        type: fee.type,
                                        testid: fee.testId,
                                        feesType: feesTypeName,
                                        fees: fee.fees,
                                        category: group.groupCategory,
                                        discount: fee.discount,
                                        tests: orderedTestFields,
                                        labResults: labResultArray,
                                    });
                                }
                            }
                        }
                    } else {
                        feesTypeName = feesType.name;
                        reference_range = feesType.reference_range;
                        units = feesType.units;
                        category = feesType.category;
                        comments = feesType.comments;

                        const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });
                        labResultArray = labResults.map(result => ({
                            result: result.result,
                        }));

                        data.feesData.push({
                            id: fee._id,
                            type: fee.type,
                            testid: fee.testId,
                            feesType: feesTypeName,
                            fees: fee.fees,
                            reference_range: reference_range,
                            units: units,
                            comments: comments,
                            category: category,
                            discount: fee.discount,
                            labResults: labResultArray,
                        });
                    }
                }
            }
        }


        const htmlContent = await CulturegeneratePDF(data, id); // Assuming you have a generateHTML function

        const htmlToPDF = new WHHTMLToPDF();
        const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
        res.status(200).end(pdfBuffer);
    } catch (error) {
        console.error('Error fetching or generating data:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};



export const cultureNHlabReport = async (req, res) => {
    try {
        const id = req.params.id;
        const { selectedTestsData } = req.body;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                pSal: bill.refId.pSalutation,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                billDate: formatDate(bill.createdAt),
            },
            feesData: [],
        };

        const feesData = await labResultDetail.find({ objbillId: id });

        for (const fee of feesData) {
            if (selectedTestsData.includes(fee.resultId.toString())) {
                const feesType = await getFeesType(fee.fieldId, fee.type);
                if (feesType) {
                    let feesTypeName;
                    let reference_range = '';
                    let units = '';
                    let category = '';
                    let comments = '';
                    let labResultArray = [];

                    if (fee.type === 'Profile') {
                        // Your code for profile type tests
                    } else if (fee.type === 'Group') {
                        feesTypeName = feesType.groupName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            // const labResults = await labResultDetail.find({ objbillId: id, id: fee.id });
                            // labResultArray = labResults.map(result => ({
                            //     result: result.result,
                            // }));

                            const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory');
                            if (group) {
                                const testIds = group.testFields.map(field => field.testId);
                                const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments');
                                if (testDetails) {
                                    const orderedTestFields = group.testFields.map(field => {
                                        const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                        return {
                                            _id: testDetail._id,
                                            name: testDetail.name,
                                            reference_range: testDetail.reference_range,
                                            units: testDetail.units,
                                            category: testDetail.category,
                                            comments: testDetail.comments,
                                            testid: fee.testId,
                                            type: fee.type,
                                        };
                                    });

                                    // Fetch lab results based on the test ID
                                    const labResults = await labResultDetail.find({
                                        objbillId: id,
                                        id: { $in: testIds } // Filter by IDs
                                    });

                                    // console.log(labResults);


                                    // Map lab results for each test
                                    // const labResultArray = orderedTestFields.map(test => {
                                    //     const resultsForTest = labResults.filter(result => result.id.equals(test._id));
                                    //     return {
                                    //         result: resultsForTest.map(result => result.result),
                                    //     };
                                    // });

                                    const labResultArray = orderedTestFields.map(test => {
                                        const groupTest = group.testFields.find(field => field.testId.equals(test._id));

                                        // Assuming that the testName is a property of the groupTest object
                                        const testName = groupTest ? groupTest.subCat : '';

                                        const resultsForTest = labResults.filter(result => result.id.equals(test._id));

                                        return {
                                            testName: testName,
                                            result: resultsForTest.map(result => result.result),
                                        };
                                    });



                                    data.feesData.push({
                                        id: fee._id,
                                        type: fee.type,
                                        testid: fee.testId,
                                        feesType: feesTypeName,
                                        fees: fee.fees,
                                        category: group.groupCategory,
                                        discount: fee.discount,
                                        tests: orderedTestFields,
                                        labResults: labResultArray,
                                    });
                                }
                            }
                        }
                    } else {
                        feesTypeName = feesType.name;
                        reference_range = feesType.reference_range;
                        units = feesType.units;
                        category = feesType.category;
                        comments = feesType.comments;

                        const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });
                        labResultArray = labResults.map(result => ({
                            result: result.result,
                        }));

                        data.feesData.push({
                            id: fee._id,
                            type: fee.type,
                            testid: fee.testId,
                            feesType: feesTypeName,
                            fees: fee.fees,
                            reference_range: reference_range,
                            units: units,
                            comments: comments,
                            category: category,
                            discount: fee.discount,
                            labResults: labResultArray,
                        });
                    }
                }
            }
        }

        // const pdfBuffer = await NHculturegeneratePDF(data);

        // // Define a file path to save the PDF
        // const pdfFilePath = `./reports/lab-report-${id}.pdf`;

        // // Write the PDF buffer to the file
        // fs.writeFileSync(pdfFilePath, pdfBuffer);

        // // Send the generated PDF as a response
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
        // res.status(200).end(pdfBuffer);

        // // Return the PDF file path
        // return pdfFilePath;

        const htmlContent = await NHculturegeneratePDF(data, id); // Assuming you have a generateHTML function

        const htmlToPDF = new HTMLToPDF();
        const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
        res.status(200).end(pdfBuffer);
    } catch (error) {
        console.error('Error fetching or generating data:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};

async function getFeesType(id, type) {
    try {
        switch (type) {
            case 'Test':
                return await Test.findById(id, 'name category units refrence_range comments');
            case 'Group':
                return await GroupTest.findById(id, 'groupName groupCategory');
            case 'Profile':
                return await CreateProfile.findById(id, 'profileName');
            default:
                return null;
        }
    } catch (error) {
        console.error('Error fetching fees type:', error);
        return null;
    }
}



export const sendWhatsapp = async (req, res) => {
    const billId = req.params.id;

    try {
        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        // Find the associated PatientReg document by _id from the refId field in Bill
        const patientRegId = bill.refId;

        if (!patientRegId) {
            return res.status(404).json({ error: 'PatientReg ID not found in the Bill document' });
        }

        // Fetch the PatientReg document by _id
        const patientReg = await PatientReg.findById(patientRegId);

        if (!patientReg) {
            return res.status(404).json({ error: 'PatientReg not found' });
        }

        // Get the phone number from the patientReg document
        const phoneNumber = patientReg.pNum;

        // Generate and save the PDF report
        // const pdfFilePath = await WHgeneratePDF(data); // Make sure 'data' contains the report data
        const pdfFilePath = await WHlabReport(req, res);

        const apiUrl = 'https://api.whatsdesk.in/v4/filefromdisk.php';
        const apiKey = 'cbEMMQdLJqBjBAikSS';

        // Create a FormData object
        const formData = new FormData();
        formData.append('data', fs.createReadStream(pdfFilePath)); // Attach the file
        formData.append('key', apiKey);
        formData.append('number', '91' + phoneNumber); // Assuming you need to prepend '91' to the contact number
        formData.append('caption', 'This is a test caption');

        // Make a POST request using axios with the FormData
        const response = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Handle the response here
        console.log('WhatsApp report sent successfully');
        return {
            status: true,
            message: 'success',
        };

    } catch (error) {
        console.error('Error sending WhatsApp report:', error);
        // Handle the error here
        return {
            status: false,
            message: 'error',
        };
    }
};

export const sendCultureWhatsapp = async (req, res) => {
    const billId = req.params.id;

    try {
        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        // Find the associated PatientReg document by _id from the refId field in Bill
        const patientRegId = bill.refId;

        if (!patientRegId) {
            return res.status(404).json({ error: 'PatientReg ID not found in the Bill document' });
        }

        // Fetch the PatientReg document by _id
        const patientReg = await PatientReg.findById(patientRegId);

        if (!patientReg) {
            return res.status(404).json({ error: 'PatientReg not found' });
        }

        // Get the phone number from the patientReg document
        const phoneNumber = patientReg.pNum;

        // Generate and save the PDF report
        // const pdfFilePath = await WHgeneratePDF(data); // Make sure 'data' contains the report data
        const pdfFilePath = await cultureWHlabReport(req, res);

        const apiUrl = 'https://api.whatsdesk.in/v4/filefromdisk.php';
        const apiKey = 'cbEMMQdLJqBjBAikSS';

        // Create a FormData object
        const formData = new FormData();
        formData.append('data', fs.createReadStream(pdfFilePath)); // Attach the file
        formData.append('key', apiKey);
        formData.append('number', '91' + phoneNumber); // Assuming you need to prepend '91' to the contact number
        formData.append('caption', 'This is a test caption');

        // Make a POST request using axios with the FormData
        const response = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Handle the response here
        console.log('WhatsApp report sent successfully');
        return {
            status: true,
            message: 'success',
        };

    } catch (error) {
        console.error('Error sending WhatsApp report:', error);
        // Handle the error here
        return {
            status: false,
            message: 'error',
        };
    }
};



const WHlabReportEmail = async (req, res, returnBuffer = false) => {
    try {
        const id = req.params.id;
        const { selectedTestsData } = req.body;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        if (!bill) {
            if (returnBuffer) {
                throw new Error('Bill not found');
            } else {
                return res.status(404).json({ message: 'Bill not found' });
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                pSal: bill.refId.pSalutation,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                billDate: formatDate(bill.createdAt),
            },
            feesData: [],
        };

        const feesData = await labResultDetail.find({ objbillId: id });

        for (const fee of feesData) {
            if (selectedTestsData.includes(fee.resultId.toString())) {
                let feesType = await getFeesType(fee.fieldId, fee.type);
                if (feesType) {
                    let feesTypeName;
                    let reference_range = '';
                    let units = '';
                    let category = '';
                    let comments = '';
                    let method = '';
                    let labResultArray = [];

                    if (fee.type === 'Profile') {
                        // Your code for profile type tests
                    } else if (fee.type === 'Group') {
                        feesTypeName = feesType.groupName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory');
                            if (group) {
                                const testIds = group.testFields.map(field => field.testId);
                                const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments method');
                                if (testDetails) {
                                    const orderedTestFields = group.testFields.map(field => {
                                        const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                        return {
                                            _id: testDetail._id,
                                            name: testDetail.name,
                                            reference_range: testDetail.reference_range,
                                            units: testDetail.units,
                                            category: testDetail.category,
                                            comments: testDetail.comments,
                                            method: testDetail.method,
                                            testid: fee.testId,
                                            type: fee.type,
                                        };
                                    });

                                    // Fetch lab results based on the test ID
                                    const labResults = await labResultDetail.find({
                                        objbillId: id,
                                        id: { $in: testIds } // Filter by IDs
                                    });

                                    const labResultArray = orderedTestFields.map(test => {
                                        const groupTest = group.testFields.find(field => field.testId.equals(test._id));

                                        // Assuming that the testName is a property of the groupTest object
                                        const testName = groupTest ? groupTest.subCat : '';

                                        const resultsForTest = labResults.filter(result => result.id.equals(test._id));

                                        // Extracting both result and abnormalValue
                                        const testResults = resultsForTest.map(result => ({
                                            testName: testName,
                                            result: result.result,
                                            abnormalValue: result.abnormalValue, // Assuming there's an abnormalValue field in labResultDetail
                                        }));

                                        return testResults;
                                    }).flat(); // Use flat to flatten the nested arrays

                                    data.feesData.push({
                                        id: fee._id,
                                        type: fee.type,
                                        testid: fee.testId,
                                        feesType: feesTypeName,
                                        fees: fee.fees,
                                        category: group.groupCategory,
                                        discount: fee.discount,
                                        tests: orderedTestFields,
                                        labResults: labResultArray,
                                    });
                                }
                            }
                        }
                    } else {
                        feesTypeName = feesType.name;
                        reference_range = feesType.reference_range;
                        units = feesType.units;
                        category = feesType.category;
                        comments = feesType.comments;
                        method = feesType.method;

                        const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });

                        const labResultArray = labResults.map(result => ({
                            result: result.result,
                            abnormalValue: result.abnormalValue,
                        }));

                        data.feesData.push({
                            id: fee._id,
                            type: fee.type,
                            testid: fee.testId,
                            feesType: feesTypeName,
                            fees: fee.fees,
                            reference_range: reference_range,
                            units: units,
                            comments: comments,
                            method: method,
                            category: category,
                            discount: fee.discount,
                            labResults: labResultArray,
                        });
                    }
                }
            }
        }

        const htmlContent = await WHgeneratePDF(data, id); // Pass id to the generatePDF function

        const htmlToPDF = new WHHTMLToPDF();
        const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

        if (returnBuffer) {
            return { pdfBuffer, pName: data.data.pName };
        } else {
            const pdfFilePath = `./reports/${id}.pdf`;
            fs.writeFileSync(pdfFilePath, pdfBuffer);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
            return res.status(200).end(pdfBuffer);
        }
    } catch (error) {
        console.error('Error fetching or generating data:', error);
        if (returnBuffer) {
            throw error;
        } else {
            return res.status(500).json({ error: 'An error occurred while processing the request' });
        }
    }
};

export const sendEmail = async (req, res) => {
    const billId = req.params.id;

    try {
        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        const patientRegId = bill.refId;

        if (!patientRegId) {
            return res.status(404).json({ error: 'PatientReg ID not found in the Bill document' });
        }

        const patientReg = await PatientReg.findById(patientRegId);

        if (!patientReg) {
            return res.status(404).json({ error: 'PatientReg not found' });
        }

        const toEmail = patientReg.pEmail;

        // Generate PDF buffer and get patient's name
        const { pdfBuffer, pName } = await WHlabReportEmail(req, res, true);

        // Create a transporter using your email service or SMTP server details
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'aqibmulla456@gmail.com',
                pass: 'tlgyurwmmrcgjanq',
            },
        });

        await transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP connection error:', error);
                return res.status(500).json({ error: 'SMTP connection error' });
            } else {
                console.log('SMTP connection successful');
            }
        });

        const mailOptions = {
            from: 'aqibmulla456@gmail.com',
            to: toEmail,
            subject: 'Lab Report',
            text: 'Please find the attached lab report.',
            attachments: [
                {
                    filename: `lab-report-${pName}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'An error occurred while sending the email' });
    }
};


const cultureWHlabReportEmail = async (req, res, returnBuffer = false) => {
    try {
        const id = req.params.id;
        const { selectedTestsData } = req.body;

        const bill = await Bill.findById(id)
            .populate('refId', 'pName pNum pAge pGender pSalutation')
            .populate('doctorName', 'drName')
            .exec();

        if (!bill) {
            if (returnBuffer) {
                throw new Error('Bill not found');
            } else {
                return res.status(404).json({ message: 'Bill not found' });
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        const data = {
            data: {
                billId: bill.billId,
                pName: bill.refId.pName,
                pAge: bill.refId.pAge,
                pGender: bill.refId.pGender,
                pSal: bill.refId.pSalutation,
                drName: bill.doctorName.drName,
                billAmount: bill.billAmount,
                amountDue: bill.amountDue,
                amountPaid: bill.amountPaid,
                billDate: formatDate(bill.createdAt),
            },
            feesData: [],
        };

        const feesData = await labResultDetail.find({ objbillId: id });

        for (const fee of feesData) {
            if (selectedTestsData.includes(fee.resultId.toString())) {
                const feesType = await getFeesType(fee.fieldId, fee.type);
                if (feesType) {
                    let feesTypeName;
                    let reference_range = '';
                    let units = '';
                    let category = '';
                    let comments = '';
                    let labResultArray = [];

                    if (fee.type === 'Profile') {
                        // Your code for profile type tests
                    } else if (fee.type === 'Group') {
                        feesTypeName = feesType.groupName;
                        if (!data.feesData.some((details) => details.feesType === feesTypeName)) {
                            const group = await GroupTest.findById(fee.fieldId, 'testFields groupCategory');
                            if (group) {
                                const testIds = group.testFields.map(field => field.testId);
                                const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category comments');
                                if (testDetails) {
                                    const orderedTestFields = group.testFields.map(field => {
                                        const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                        return {
                                            _id: testDetail._id,
                                            name: testDetail.name,
                                            reference_range: testDetail.reference_range,
                                            units: testDetail.units,
                                            category: testDetail.category,
                                            comments: testDetail.comments,
                                            testid: fee.testId,
                                            type: fee.type,
                                        };
                                    });

                                    // Fetch lab results based on the test ID
                                    const labResults = await labResultDetail.find({
                                        objbillId: id,
                                        id: { $in: testIds } // Filter by IDs
                                    });

                                    const labResultArray = orderedTestFields.map(test => {
                                        const groupTest = group.testFields.find(field => field.testId.equals(test._id));
                                        const testName = groupTest ? groupTest.subCat : '';
                                        const resultsForTest = labResults.filter(result => result.id.equals(test._id));

                                        return {
                                            testName: testName,
                                            result: resultsForTest.map(result => result.result),
                                        };
                                    });

                                    data.feesData.push({
                                        id: fee._id,
                                        type: fee.type,
                                        testid: fee.testId,
                                        feesType: feesTypeName,
                                        fees: fee.fees,
                                        category: group.groupCategory,
                                        discount: fee.discount,
                                        tests: orderedTestFields,
                                        labResults: labResultArray,
                                    });
                                }
                            }
                        }
                    } else {
                        feesTypeName = feesType.name;
                        reference_range = feesType.reference_range;
                        units = feesType.units;
                        category = feesType.category;
                        comments = feesType.comments;

                        const labResults = await labResultDetail.find({ objbillId: id, fieldId: fee.fieldId });
                        labResultArray = labResults.map(result => ({
                            result: result.result,
                        }));

                        data.feesData.push({
                            id: fee._id,
                            type: fee.type,
                            testid: fee.testId,
                            feesType: feesTypeName,
                            fees: fee.fees,
                            reference_range: reference_range,
                            units: units,
                            comments: comments,
                            category: category,
                            discount: fee.discount,
                            labResults: labResultArray,
                        });
                    }
                }
            }
        }

        const htmlContent = await CulturegeneratePDF(data, id); // Assuming you have a generateHTML function

        const htmlToPDF = new WHHTMLToPDF();
        const pdfBuffer = await htmlToPDF.generatePDF(htmlContent);

        if (returnBuffer) {
            return { pdfBuffer, pName: data.data.pName };
        } else {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=lab-report-${id}.pdf`);
            return res.status(200).end(pdfBuffer);
        }
    } catch (error) {
        console.error('Error fetching or generating data:', error);
        if (returnBuffer) {
            throw error;
        } else {
            return res.status(500).json({ error: 'An error occurred while processing the request' });
        }
    }
};



export const sendCultureEmail = async (req, res) => {
    const billId = req.params.id;

    try {
        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        const patientRegId = bill.refId;

        if (!patientRegId) {
            return res.status(404).json({ error: 'PatientReg ID not found in the Bill document' });
        }

        const patientReg = await PatientReg.findById(patientRegId);

        if (!patientReg) {
            return res.status(404).json({ error: 'PatientReg not found' });
        }

        const toEmail = patientReg.pEmail;

        // Generate PDF buffer and get patient's name
        const { pdfBuffer, pName } = await cultureWHlabReportEmail(req, res, true);

        // Create a transporter using your email service or SMTP server details
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'aqibmulla456@gmail.com',
                pass: 'tlgyurwmmrcgjanq',
            },
        });

        await transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP connection error:', error);
                return res.status(500).json({ error: 'SMTP connection error' });
            } else {
                console.log('SMTP connection successful');
            }
        });

        const mailOptions = {
            from: 'aqibmulla456@gmail.com',
            to: toEmail,
            subject: 'Lab Report',
            text: 'Please find the attached lab report.',
            attachments: [
                {
                    filename: `lab-report-${pName}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'An error occurred while sending the email' });
    }
};




// const WHgeneratePDF = async (data, id) => {
//     const doctorImagePath = './images/doctorSign.png';
//     const doctorImageBuffer = fs.readFileSync(doctorImagePath);
//     const doctorImageBase64 = doctorImageBuffer.toString('base64');

//     const labImagePath = './images/labSign.png';
//     const labImageBuffer = fs.readFileSync(labImagePath);
//     const labImageBase64 = labImageBuffer.toString('base64');

//     const headerImagePath = './images/hm_header.PNG';
//     const headerImageBuffer = fs.readFileSync(headerImagePath);
//     const headerImageBase64 = headerImageBuffer.toString('base64');

//     const footerImagePath = './images/hm_header.PNG'; // Assuming the correct footer image path
//     const footerImageBuffer = fs.readFileSync(footerImagePath);
//     const footerImageBase64 = footerImageBuffer.toString('base64');

//     // Generate the QR code
//     const qrCodeUrl = `https://memocares.com/labDemo/store/downloads/qrlab-result/38`;
//     const qrCodeData = await QRCode.toDataURL(qrCodeUrl);

//     const getPatientDetails = () => `
     
//      <tr class="patient-details">
//          <td colspan="2">
//              Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong>
//              <div style="margin-bottom: 10px;"></div>
//              Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong>
//              <div style="margin-bottom: 10px;"></div>
//              Referred By: <strong>${data.data.drName}</strong>
//              <div style="margin-bottom: 10px;"></div>
//          </td>
//          <td colspan="2">
//              Report ID: <strong>${data.data.billId}</strong>
//              <div style="margin-bottom: 10px;"></div>
//              Sampling Date: <strong>${data.data.billDate}</strong>
//              <div style="margin-bottom: 10px;"></div>
//              Report Date: <strong>${data.data.billDate}</strong>
//              <div style="margin-bottom: 10px;"></div>
//          </td>
//      </tr>
//      <tr class="table-header">
//          <th style="width: 45%;">Test Name</th>
//          <th style="width: 25%; text-align: center;">Result</th>
//          <th style="width: 30%;">Reference Range</th>
//          <th style="width: 10%;">Unit</th>
//      </tr>
//      <tr>
//          <td colspan="4">
//              <hr style="border: 1px solid #000;">
//          </td>
//      </tr>
   
//  `;

//     const generateGroupSection = (details) => `
//  <table>
//      <thead>
//          ${getPatientDetails()}
//      </thead>
//      <tbody>
//          <tr style="height: 10px;"></tr>
//          <tr class="group-header">
//              <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
//          </tr>
//          ${details.feesType ? `<tr>
//              <td style="text-align:left;"><strong>${details.feesType}</strong></td>
//          </tr>` : ''}
//          ${details.tests.map((test, testIndex) => {
//         const labResult = details.labResults[testIndex] || {};
//         const testName = labResult.testName || '';
//         const abnormalValue = labResult.abnormalValue || '';
//         const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
//             `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

//         return `
//              ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
//              <tr>
//                  <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
//                  <td style="text-align:center">${formattedResult}</td>
//                  <td>${test.reference_range || ''}</td>
//                  <td>${test.units || ''}</td>
//              </tr>
//               `;
//     }).join('')}
//      </tbody>
//  </table>
//  <div class="page-break"></div>
// `;

//     const generateProfileSection = (details) => `
//  <table>
//      <thead>
//          ${getPatientDetails()}
//      </thead>
//      <tbody>
//          <tr style="height: 10px;"></tr>
//          <tr class="profile-header">
//              <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
//          </tr>
//          ${details.feesType ? `<tr>
//              <td colspan="4" style="text-align:left;"><strong>${details.feesType}</strong></td>
//          </tr>` : ''}
//           ${details.groupName ? `<tr>
//              <td style="text-align:left;"><strong>${details.groupName}</strong></td>
//          </tr>` : ''}
//          ${details.tests.map((test, testIndex) => {
//         const labResult = details.labResults[testIndex] || {};
//         const testName = labResult.testName || '';
//         const abnormalValue = labResult.abnormalValue || '';
//         const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
//             `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

//         return `
//              ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
//              <tr>
//                  <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
//                  <td style="text-align:center">${formattedResult}</td>
//                  <td>${test.reference_range || ''}</td>
//                  <td>${test.units || ''}</td>
//              </tr>
//               `;
//     }).join('')}
//      </tbody>
//  </table>
//  <div class="page-break"></div>
// `;

//     const generateSingleTestSection = (category, tests) => `
//  <table>
//      <thead>
//          ${getPatientDetails()}
//      </thead>
//      <tbody>
//          <tr style="height: 10px;"></tr>
//          <tr class="group-header">
//              <td colspan="4" style="text-align:center;"><strong>${category}</strong></td>
//          </tr>
//          ${tests.map((details) => `
//              <tr>
//                  <td>${details.feesType} ${details.method ? `<br>(${details.method})` : ''}</td>
//                  <td style="text-align:center;">${details.labResults[0] ?
//             (details.labResults[0].abnormalValue === 'L' || details.labResults[0].abnormalValue === 'H' ?
//                 `<strong style="color: red;">${details.labResults[0].result || ''}</strong>` :
//                 details.labResults[0].result || '') : ''}</td>
//                  <td>${details.reference_range || ''}</td>
//                  <td>${details.units || ''}</td>
//              </tr>
//              ${details.comments ? `
//                  <tr>
//                      <td style="padding-left: 15px; word-wrap: break-word;">
//                          ${details.comments}
//                      </td>
//                  </tr>` : ''}
//          `).join('')}
//      </tbody>
//  </table>
// `;


//     // Group single tests by category
//     const groupedSingleTests = data.feesData.reduce((acc, details) => {
//         if (details.type !== 'Group' && details.type !== 'Profile') {
//             const category = details.category || 'Miscellaneous';
//             if (!acc[category]) {
//                 acc[category] = [];
//             }
//             acc[category].push(details);
//         }
//         return acc;
//     }, {});

//     // Generate HTML content
//     const htmlContent = `
//     <html>
//     <head>
//         <style>
//             @page {
//                 margin: 20mm;
//             }
//             .group-header, .profile-header {
//                 page-break-before: always;
//             }
//             .patient-details, .table-header {
//                 text-align: left;
//                 font-size: 15px;
//             }
//             .table-header th {
//                 font-size: 15px;
//                 text-align: left;
//             }
//             table {
//                 width: 100%;
//                 border-collapse: collapse;
//             }
//             th, td {
//                 padding: 5px;
//             }
//             th {
//                 background-color: #f2f2f2;
//             }
//             .end-report {
//                 margin-top: 20px;
//                 text-align: center;
//                 font-size: 16px;
//             }
//             .signatures {
//                 display: flex;
//                 justify-content: space-between;
//                 margin-top: 10px;
//             }
//             .signatures div {
//                 width: 30%;
//                 text-align: center;
//             }
//             .signatures p {
//                 margin: 0px;
//                 font-size: 14px;
//             }
//             .signatures img {
//                 width: 50%;
//                 height: auto;
//             }
//             .qr-code {
//                 text-align: center;
//                 margin-top: 20px;
//             }
//             .page-break {
//                 page-break-before: always;
//             }
//         </style>
//     </head>
//     <body>
//     <div class="header">
//             <img src="data:image/jpeg;base64,${headerImageBase64}" alt="Header Image" />
//         </div>
//         ${data.feesData.map((details) => {
//         if (details.type === 'Group') {
//             return generateGroupSection(details);
//         }
//         if (details.type === 'Profile') {
//             return generateProfileSection(details);
//         }
//         return '';
//     }).join('')}

//         ${Object.keys(groupedSingleTests).map(category => generateSingleTestSection(category, groupedSingleTests[category])).join('')}

//         <!-- Add content to display at the end of the report -->
//         <div class="footer">
//             <img src="data:image/jpeg;base64,${footerImageBase64}" alt="Footer Image" />
//         </div>
//         <div class="end-report">
//             <p>End of the Report</p>
//             <div class="signatures">
//                 <div>
//                     <img src="data:image/jpeg;base64,${doctorImageBase64}" alt="Doctor Image" />
//                     <p><strong>Doctor</strong></p>
//                 </div>
//                 <div>
//                     <img src="data:image/jpeg;base64,${labImageBase64}" alt="Lab Technician Image" />
//                     <p><strong>Technician</strong></p>
//                 </div>
//             </div>
            
//         </div>
//     </body>
// </html>
// `;
//     return htmlContent;
// };


const WHgeneratePDF = async (data, id) => {
   

    const doctorImagePath = './images/doctorSign.png';
    const doctorImageBuffer = fs.readFileSync(doctorImagePath);
    const doctorImageBase64 = doctorImageBuffer.toString('base64');

    const labImagePath = './images/labSign.png';
    const labImageBuffer = fs.readFileSync(labImagePath);
    const labImageBase64 = labImageBuffer.toString('base64');

    const headerImagePath = './images/hm_header.PNG';
    const headerImageBuffer = fs.readFileSync(headerImagePath);
    const headerImageBase64 = headerImageBuffer.toString('base64');

    const footerImagePath = './images/hm_header.PNG'; // Assuming the correct footer image path
    const footerImageBuffer = fs.readFileSync(footerImagePath);
    const footerImageBase64 = footerImageBuffer.toString('base64');

    // Generate the QR code
    const qrCodeUrl = `https://demo.com/labDemo/store/downloads/qrlab-result/38`;
    const qrCodeData = await QRCode.toDataURL(qrCodeUrl);

    const getPatientDetails = () => `
     <div style="padding-top: 40mm;">
     <tr class="patient-details">
         <td colspan="2">
             Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong>
             <div style="margin-bottom: 10px;"></div>
             Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong>
             <div style="margin-bottom: 10px;"></div>
             Referred By: <strong>${data.data.drName}</strong>
             <div style="margin-bottom: 10px;"></div>
         </td>
         <td colspan="2">
             Report ID: <strong>${data.data.billId}</strong>
             <div style="margin-bottom: 10px;"></div>
             Sampling Date: <strong>${data.data.billDate}</strong>
             <div style="margin-bottom: 10px;"></div>
             Report Date: <strong>${data.data.billDate}</strong>
             <div style="margin-bottom: 10px;"></div>
         </td>
     </tr>
     <tr class="table-header">
         <th style="width: 45%;">Test Name</th>
         <th style="width: 25%; text-align: center;">Result</th>
         <th style="width: 30%;">Reference Range</th>
         <th style="width: 10%;">Unit</th>
     </tr>
     <tr>
         <td colspan="4">
             <hr style="border: 1px solid #000;">
         </td>
     </tr>
     </div>
 `;

    const generateGroupSection = (details) => `
 <table>
     <thead>
         ${getPatientDetails()}
     </thead>
     <tbody>
         <tr style="height: 10px;"></tr>
         <tr class="group-header">
             <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
         </tr>
         ${details.feesType ? `<tr>
             <td style="text-align:left;"><strong>${details.feesType}</strong></td>
         </tr>` : ''}
         ${details.tests.map((test, testIndex) => {
        const labResult = details.labResults[testIndex] || {};
        const testName = labResult.testName || '';
        const abnormalValue = labResult.abnormalValue || '';
        const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
            `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

        return `
             ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
             <tr>
                 <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
                 <td style="text-align:center">${formattedResult}</td>
                 <td>${test.reference_range || ''}</td>
                 <td>${test.units || ''}</td>
             </tr>
              `;
    }).join('')}
     </tbody>
 </table>
 <div class="page-break"></div>
`;

    const generateProfileSection = (details) => `
 <table>
     <thead>
         ${getPatientDetails()}
     </thead>
     <tbody>
         <tr style="height: 10px;"></tr>
         <tr class="profile-header">
             <td colspan="4" style="text-align:center;"><strong>${details.category}</strong></td>
         </tr>
         ${details.feesType ? `<tr>
             <td colspan="4" style="text-align:left;"><strong>${details.feesType}</strong></td>
         </tr>` : ''}
          ${details.groupName ? `<tr>
             <td style="text-align:left;"><strong>${details.groupName}</strong></td>
         </tr>` : ''}
         ${details.tests.map((test, testIndex) => {
        const labResult = details.labResults[testIndex] || {};
        const testName = labResult.testName || '';
        const abnormalValue = labResult.abnormalValue || '';
        const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
            `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

        return `
             ${testName ? `<tr> <td style="text-align:left;"><strong>${testName}</strong></td> </tr>` : ''}
             <tr>
                 <td>${test.name}${test.method ? `<br>(${test.method})` : ''}</td>
                 <td style="text-align:center">${formattedResult}</td>
                 <td>${test.reference_range || ''}</td>
                 <td>${test.units || ''}</td>
             </tr>
              `;
    }).join('')}
     </tbody>
 </table>
 <div class="page-break"></div>
`;

    const generateSingleTestSection = (category, tests) => `
 <table>
     <thead>
         ${getPatientDetails()}
     </thead>
     <tbody>
         <tr style="height: 10px;"></tr>
         <tr class="group-header">
             <td colspan="4" style="text-align:center;"><strong>${category}</strong></td>
         </tr>
         ${tests.map((details) => `
             <tr>
                 <td>${details.feesType} ${details.method ? `<br>(${details.method})` : ''}</td>
                 <td style="text-align:center;">${details.labResults[0] ?
            (details.labResults[0].abnormalValue === 'L' || details.labResults[0].abnormalValue === 'H' ?
                `<strong style="color: red;">${details.labResults[0].result || ''}</strong>` :
                details.labResults[0].result || '') : ''}</td>
                 <td>${details.reference_range || ''}</td>
                 <td>${details.units || ''}</td>
             </tr>
             ${details.comments ? `
                 <tr>
                     <td style="padding-left: 15px; word-wrap: break-word;">
                         ${details.comments}
                     </td>
                 </tr>` : ''}
         `).join('')}
     </tbody>
 </table>
`;

    // Group single tests by category
    const groupedSingleTests = data.feesData.reduce((acc, details) => {
        if (details.type !== 'Group' && details.type !== 'Profile') {
            const category = details.category || 'Miscellaneous';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(details);
        }
        return acc;
    }, {});

    // Generate HTML content
    const htmlContent = `
    <html>
    <head>
        <style>
            @page {
                size: A4;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
            }
            .header, .footer {
                width: 100%;
                text-align: center;
                position: fixed;
            }
            .header {
                top: 0;
            }
            .footer {
                bottom: 0;
            }
            .header img, .footer img {
                width: 100%;
                height: auto;
            }
            .content {
                margin-bottom: 50px;
                padding: 0 20mm;
            }
            .group-header, .profile-header {
                page-break-before: always;
            }
            .patient-details, .table-header {
                text-align: left;
                font-size: 15px;
            }
            .table-header th {
                font-size: 15px;
                text-align: left;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 5px;
            }
            th {
                background-color: #f2f2f2;
            }
            .end-report {
                margin-top: 10px;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
            }
            .page-break {
                page-break-before: always;
            }
                  .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            }
            .signatures div {
                width: 30%;
                text-align: center;
            }
            .signatures p {
                margin: 0px;
                font-size: 14px;
            }
            .signatures img {
                width: 50%;
                height: auto;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="data:image/png;base64,${headerImageBase64}" />
        </div>
        <div class="footer">
            <img src="data:image/png;base64,${footerImageBase64}" />
        </div>
        <div class="content">
            ${data.feesData.map(details => {
        if (details.type === 'Group') {
            return generateGroupSection(details);
        } else if (details.type === 'Profile') {
            return generateProfileSection(details);
        }
        return '';
    }).join('')}
        
     <div style="padding-top: 40mm;">
<table>
    <thead>
        <!-- Patient details row -->
        <tr class="patient-details">
            <td colspan="2">
                Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong>
                <div style="margin-bottom: 10px;"></div>
                Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong>
                <div style="margin-bottom: 10px;"></div>
                Referred By: <strong>${data.data.drName}</strong>
                <div style="margin-bottom: 10px;"></div>
            </td>
            <td colspan="2">
                Report ID: <strong>${data.data.billId}</strong>
                <div style="margin-bottom: 10px;"></div>
                Sampling Date: <strong>${data.data.billDate}</strong>
                <div style="margin-bottom: 10px;"></div>
                Report Date: <strong>${data.data.billDate}</strong>
                <div style="margin-bottom: 10px;"></div>
            </td>
        </tr>
        <!-- Table header row -->
        <tr class="table-header">
            <th style="width: 45%;">Test Name</th>
            <th style="width: 25%; text-align: center;">Result</th>
            <th style="width: 30%;">Reference Range</th>
            <th style="width: 10%;">Unit</th>
        </tr>
        <!-- Horizontal rule for separation -->
        <tr>
            <td colspan="4">
                <hr style="border: 1px solid #000;">
            </td>
        </tr>
    </thead>
    <tbody>
        <!-- Rows for the tests will be added here -->
        ${Object.keys(groupedSingleTests).map(category => `
            <tr class="group-header">
                <td colspan="4" style="text-align:center;"><strong>${category}</strong></td>
            </tr>
            ${groupedSingleTests[category].map((details) => `
                <tr>
                    <td>${details.feesType} ${details.method ? `<br>(${details.method})` : ''}</td>
                    <td style="text-align:center;">
                        ${details.labResults[0] ?
                            (details.labResults[0].abnormalValue === 'L' || details.labResults[0].abnormalValue === 'H' ?
                                `<strong style="color: red;">${details.labResults[0].result || ''}</strong>` :
                                details.labResults[0].result || '') : ''}
                    </td>
                    <td>${details.reference_range || ''}</td>
                    <td>${details.units || ''}</td>
                </tr>
                ${details.comments ? `
                    <tr>
                        <td style="padding-left: 15px; word-wrap: break-word;" colspan="4">
                            ${details.comments}
                        </td>
                    </tr>` : ''}
            `).join('')}
        `).join('')}
    </tbody>
</table>
        <div class="signatures" >
            <div>
                <img src="data:image/png;base64,${doctorImageBase64}" alt="Doctor Signature">
                <p><strong>Authorized Signature</strong></p>
            </div>
             <div class="qr-code">
                 <img src="${qrCodeData}" alt="QR Code">
            </div>
            <div>
                <img src="data:image/png;base64,${labImageBase64}" alt="Lab Signature">
                <p><strong>Lab Signature</strong></p>
            </div>
        </div>
        </div>
        </div>
    </body>
    </html>
 `;

    return htmlContent;
};







const CulturegeneratePDF = async (data, id) => {
    const doctorImagePath = './images/doctorSign.png';
    const doctorImageBuffer = fs.readFileSync(doctorImagePath);
    const doctorImageBase64 = doctorImageBuffer.toString('base64');

    const labImagePath = './images/labSign.png';
    const labImageBuffer = fs.readFileSync(labImagePath);
    const labImageBase64 = labImageBuffer.toString('base64');

    const headerImagePath = './images/hm_header.PNG';
    const headerImageBuffer = fs.readFileSync(headerImagePath);
    const headerImageBase64 = headerImageBuffer.toString('base64');

    const footerImagePath = './images/hm_header.PNG'; // Assuming the correct footer image path
    const footerImageBuffer = fs.readFileSync(footerImagePath);
    const footerImageBase64 = footerImageBuffer.toString('base64');

    // Generate the QR code
    const qrCodeUrl = `https://demo.com/labDemo/store/downloads/qrlab-result/38`;
    const qrCodeData = await QRCode.toDataURL(qrCodeUrl);

    const getPatientDetails = () => `
    <div style="padding-top: 45mm;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="border: 2px solid #000; padding: 8px;">
                    Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong><br />
                    Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong><br />
                    Referred By: <strong>${data.data.drName}</strong><br />
                </td>
                <td style="border: 2px solid #000; padding: 8px;">
                    Report ID: <strong>${data.data.billId}</strong><br />
                    Sampling Date: <strong>${data.data.billDate}</strong><br />
                    Report Date: <strong>${data.data.billDate}</strong><br />
                </td>
            </tr>
        </table>
    </div>
    `;

    const htmlContent = `
    <html>
    <head>
        <style>
            @page {
                margin: 20mm;
            }
            .patient-details, .table-header {
                text-align: left;
                font-size: 15px;
            }
            .content-section {
                text-align: center;
                margin-top: 20px;
                font-size: 16px;
            }
            .test-name {
                text-align: center;
                margin-top: 10px;
                font-size: 15px;
            }
            .test-result {
                text-align: left;
                margin-top: 5px;
                font-size: 15px;
            }
            .end-report {
                margin-top: 20px;
                text-align: center;
                font-size: 16px;
            }
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            .signatures div {
                width: 30%;
                text-align: center;
            }
            .signatures img {
                width: 50%;
                height: auto;
            }
            .signatures p {
                margin: 0px;
                font-size: 14px;
            }
            .page-break {
                page-break-before: always;
            }
            .header {
                position: fixed;
                top: 0; 
                left: 0;
                right: 0;
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                max-width: 103%;
            }
            .footer {
                position: fixed;
                bottom: 0; 
                left: 0;
                right: 0;
                text-align: center;
                margin-top: 20px;
            }
            .footer img {
                max-width: 103%;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="data:image/jpeg;base64,${headerImageBase64}" alt="Header Image" />
        </div>

        ${getPatientDetails()}

        ${data.feesData.map((details, index, array) => {
        if (details.type === 'Group') {
            return `
                <div class="content-section">
                    <strong>${details.category}</strong>
                    ${details.feesType ? `<p><strong>${details.feesType}</strong></p>` : ''}
                    ${details.tests.map((test, testIndex) => {
                const labResult = details.labResults[testIndex] || {};
                const abnormalValue = labResult.abnormalValue || '';
                const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
                    `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

                return `
                    <div class="test-name">${test.name}</div>
                    <div class="test-result">${formattedResult}</div>
                `;
            }).join('')}
                </div>
                
            `;
        }
    }).join('')}

        ${data.feesData.filter(details => details.type !== 'Group').length > 0 ? `
        <div class="content-section">
            ${data.feesData.map((details, index, array) => {
        if (details.type !== 'Group') {
            return `
                <div class="content-section">
                    <strong>${details.category}</strong>
                    <div class="test-name">${details.feesType} ${details.method ? `<br>(${details.method})` : ''}</div>
                    <div class="test-result">${details.labResults[0] ?
                    (details.labResults[0].abnormalValue === 'L' || details.labResults[0].abnormalValue === 'H' ?
                        `<strong style="color: red;">${details.labResults[0].result || ''}</strong>` :
                        details.labResults[0].result || '') : ''}</div>
                    ${details.comments ? `<div class="test-result">${details.comments}</div>` : ''}
                </div>
            `;
        }
    }).join('')}
        </div>
        ` : ''}

        <div class="footer">
            <img src="data:image/jpeg;base64,${footerImageBase64}" alt="Footer Image" />
        </div>
        <div class="end-report">
            <p>End of the Report</p>
            <div class="signatures">
                <div>
                    <img src="data:image/jpeg;base64,${doctorImageBase64}" alt="Doctor Image" />
                    <p><strong>Doctor</strong></p>
                </div>
                 <div >
                    <img src="${qrCodeData}" alt="QR Code" />
                     <p>Scan to download the report</p>
                 </div>
                <div>
                    <img src="data:image/jpeg;base64,${labImageBase64}" alt="Lab Technician Image" />
                    <p><strong>Technician</strong></p>
                </div>
            </div>
           
        </div>
    </body>
</html>
`;
    return htmlContent;
};



const NHculturegeneratePDF = async (data, id) => {
    const doctorImagePath = './images/doctorSign.png';
    const doctorImageBuffer = fs.readFileSync(doctorImagePath);
    const doctorImageBase64 = doctorImageBuffer.toString('base64');

    const labImagePath = './images/labSign.png';
    const labImageBuffer = fs.readFileSync(labImagePath);
    const labImageBase64 = labImageBuffer.toString('base64');

    // Generate the QR code
    const qrCodeUrl = `https://demo.com/labDemo/store/downloads/qrlab-result/38`;
    const qrCodeData = await QRCode.toDataURL(qrCodeUrl);

    const getPatientDetails = () => `
    <div>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="border: 2px solid #000; padding: 8px;">
                    Patient Name: <strong>${data.data.pSal}. ${data.data.pName}</strong><br />
                    Sex / Age: <strong>${data.data.pGender} / ${data.data.pAge}</strong><br />
                    Referred By: <strong>${data.data.drName}</strong><br />
                </td>
                <td style="border: 2px solid #000; padding: 8px;">
                    Report ID: <strong>${data.data.billId}</strong><br />
                    Sampling Date: <strong>${data.data.billDate}</strong><br />
                    Report Date: <strong>${data.data.billDate}</strong><br />
                </td>
            </tr>
        </table>
    </div>
    `;

    const htmlContent = `
    <html>
    <head>
        <style>
            @page {
                margin: 20mm;
            }
            .patient-details, .table-header {
                text-align: left;
                font-size: 15px;
            }
            .content-section {
                text-align: center;
                margin-top: 20px;
                font-size: 16px;
            }
            .test-name {
                text-align: center;
                margin-top: 10px;
                font-size: 15px;
            }
            .test-result {
                text-align: left;
                margin-top: 5px;
                font-size: 15px;
            }
            .end-report {
                margin-top: 20px;
                text-align: center;
                font-size: 16px;
            }
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            .signatures div {
                width: 30%;
                text-align: center;
            }
            .signatures img {
                width: 50%;
                height: auto;
            }
            .signatures p {
                margin: 0px;
                font-size: 14px;
            }
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        ${getPatientDetails()}

        ${data.feesData.map((details, index, array) => {
        if (details.type === 'Group') {
            return `
                    <div class="content-section">
                        <strong>${details.category}</strong>
                        ${details.feesType ? `<p><strong>${details.feesType}</strong></p>` : ''}
                        ${details.tests.map((test, testIndex) => {
                const labResult = details.labResults[testIndex] || {};
                const abnormalValue = labResult.abnormalValue || '';
                const formattedResult = abnormalValue === 'L' || abnormalValue === 'H' ?
                    `<strong style="color: red">${labResult.result || ''}</strong>` : labResult.result || '';

                return `
                                <div class="test-name">${test.name}</div>
                                <div class="test-result">${formattedResult}</div>
                            `;
            }).join('')}
                    </div>
                 
                `;
        }
    }).join('')}

        ${data.feesData.filter(details => details.type !== 'Group').length > 0 ? `
           
            <div class="content-section">
                ${data.feesData.map((details, index, array) => {
        if (details.type !== 'Group') {
            return `
                            <div class="content-section">
                                <strong>${details.category}</strong>
                                <div class="test-name">${details.feesType} ${details.method ? `<br>(${details.method})` : ''}</div>
                                <div class="test-result">${details.labResults[0] ?
                    (details.labResults[0].abnormalValue === 'L' || details.labResults[0].abnormalValue === 'H' ?
                        `<strong style="color: red;">${details.labResults[0].result || ''}</strong>` :
                        details.labResults[0].result || '') : ''}</div>
                                ${details.comments ? `<div class="test-result">${details.comments}</div>` : ''}
                            </div>
                        `;
        }
    }).join('')}
            </div>
        ` : ''}

        <div class="end-report">
            <p>End of the Report</p>
            <div class="signatures">
                <div>
                    <img src="data:image/jpeg;base64,${doctorImageBase64}" alt="Doctor Image" />
                    <p><strong>Doctor</strong></p>
                </div>
                 <div>
                    <img src="${qrCodeData}" alt="QR Code" />
                    <p>Scan to download the report</p>
                </div>
                <div>
                    <img src="data:image/jpeg;base64,${labImageBase64}" alt="Lab Technician Image" />
                    <p><strong>Technician</strong></p>
                </div>
            </div>
           
        </div>
    </body>
</html>
`;
    return htmlContent;
};


