import Bill from "../models/Bill.js";
import Test from "../models/Tests.js";
import GroupTest from "../models/GroupTest.js";
import BillDetail from "../models/BillDetails.js";
import CreateProfile from "../models/CreateProfile.js";
import labResultDetail from "../models/labResultDetail.js";
import labResult from "../models/labResult.js";


const testDetails = async (req, res) => {
    try {
        const id = req.params.id;

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
            const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based index
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

        const feesData = await BillDetail.find({ refBillId: id });

        for (const fee of feesData) {
            const feesType = await getFeesType(fee.testId, fee.type);
            if (feesType) {
                let feesTypeName;
                let reference_range = '';
                let units = '';
                let category = '';
                let testFields = []; // To hold testFields in the desired order

                if (fee.type === 'Profile') {
                    feesTypeName = feesType.profileName;

                    const profile = await CreateProfile.findById(fee.testId, 'testFields');
                    if (profile) {
                        const testIds = profile.testFields.map(field => field.testId);
                        const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category');
                        if (testDetails) {
                            // Populate testFields in the desired order
                            testFields = profile.testFields.map(field => {
                                const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                return {
                                    _id: testDetail._id,
                                    name: testDetail.name,
                                    reference_range: testDetail.reference_range,
                                    units: testDetail.units,
                                    category: testDetail.category,
                                    testid: testDetail._id,
                                    type: fee.type,
                                };
                            });

                            data.feesData.push({
                                id: fee._id,
                                type: fee.type,
                                testid: fee.testId,
                                feesType: feesTypeName,
                                fees: fee.fees,
                                discount: fee.discount,
                                tests: testFields,
                            });
                        }
                    }
                } else if (fee.type === 'Group') {
                    feesTypeName = feesType.groupName;

                    const group = await GroupTest.findById(fee.testId, 'testFields groupCategory');
                    if (group) {
                        const testIds = group.testFields.map(field => field.testId);
                        const testDetails = await Test.find({ _id: { $in: testIds } }, 'reference_range units name category');
                        if (testDetails) {
                            // Populate testFields in the desired order
                            testFields = group.testFields.map(field => {
                                const testDetail = testDetails.find(detail => detail._id.equals(field.testId));
                                return {
                                    _id: testDetail._id,
                                    name: testDetail.name,
                                    reference_range: testDetail.reference_range,
                                    units: testDetail.units,
                                    category: testDetail.category,
                                    testid: testDetail._id,
                                    type: fee.type,
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
                                tests: testFields,
                            });
                        }
                    }
                } else {
                    feesTypeName = feesType.name;

                    const test = await Test.findById(fee.testId, 'reference_range units category');
                    if (test) {
                        reference_range = test.reference_range;
                        units = test.units;
                        category = test.category;
                    }

                    data.feesData.push({
                        id: fee._id,
                        type: fee.type,
                        testid: fee.testId,
                        feesType: feesTypeName,
                        fees: fee.fees,
                        reference_range: reference_range,
                        units: units,
                        category: category,
                        discount: fee.discount,
                    });
                }
            }
        }

        res.json(data);
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
            default:
                return null;
        }
    } catch (error) {
        console.error('Error fetching fees type:', error);
        return null;
    }
}

export const saveResult = async (req, res) => {
    try {
      const objbillId = req.params.id;
      const { results } = req.body;
  
      // Use bulkWrite to perform update operations for existing records and upsert for new records
      const bulkOperations = results.map(({ id, resultId, result, type, fieldId }) => ({
        updateOne: {
          filter: { objbillId, resultId },
          update: { objbillId, id, resultId, type, fieldId, result },
          upsert: true, // Set to true for new records, false for updates
        },
      }));
  
      await labResultDetail.bulkWrite(bulkOperations);
  
      res.status(201).json({ message: 'Results saved successfully' });
    } catch (error) {
      console.error('Error saving results:', error);
      res.status(500).json({ error: 'An error occurred while saving results' });
    }
  };
    
export const getEnteredResult = async (req, res) => {
    try {
        const objbillId = req.params.id;

        // Fetch LabResult data
        const labResults = await labResult.findOne({ objbillId });

        // Fetch LabResultDetail data
        const labResultDetails = await labResultDetail.find({ objbillId });

        // Combine the fetched data into a response object
        const data = {
            billDetails: labResults,
            results: labResultDetails,
        };

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }

}
export default testDetails