import Department from "../models/departmentModel.js";
import Fees from "../models/fees.js";

export const feesMaster = async (req, res) => {
    try {
        const { department } = req.body;
        // console.log(req.body);
        const departmentSaved = new Department({ department });
        await departmentSaved.save();

        // Fetch the list of departments
        const departments = await Department.find({}, 'department');

        res.status(201).json({ message: 'Department added successfully', departments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}, 'department');
        res.status(200).json({ departments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addFees = async (req, res) => {
    try {
        const { department, category, feesName, opFees, ipFees } = req.body;

        // Create a new Fees instance
        const newFees = new Fees({
            department,
            category,
            feesName,
            opFees,
            ipFees,
        });

        // Save the new fees details to the database
        await newFees.save();

        // Fetch all fees from the database
        const feesList = await Fees.find();

        res.status(201).json({ message: 'Fees details added successfully', feesList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};


export const getFeesList = async (req, res) => {
    try {
        // Fetch all fees from the database
        const feesList = await Fees.find();

        res.status(200).json({ feesList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

export const updateFees = async (req, res) => {
    try {
        const { department, category, feesName, opFees, ipFees } = req.body;
        const updatedFee = await Fees.findByIdAndUpdate(
            req.params.id,
            { department, category, feesName, opFees, ipFees },
            { new: true } // Return the modified document rather than the original
        );

        res.json({ updatedFee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

export const filterFees = async (req, res) => {
    try {
        const { department } = req.params;

        // If the department is 'All', fetch all fees
        const filter = department === 'All' ? {} : { department };
        const filteredFeesList = await Fees.find(filter);

        res.json({ filteredFeesList });
    } catch (error) {
        console.error('Error filtering fees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteFees = async (req, res) => {
    const feeId = req.params.id;

    try {
        // Find the fee by ID and remove it
        const deletedFee = await Fees.findByIdAndRemove(feeId);

        if (!deletedFee) {
            return res.status(404).json({ message: 'Fee not found' });
        }

        // Respond with the updated list of fees or any other relevant data
        const updatedFeesList = await Fees.find();
        res.json({ updatedFeesList });
    } catch (error) {
        console.error('Error deleting fee:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getFees = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const fees = await Fees.find();
        // console.log('Fetched tests:', tests);
        res.json(fees);
    } catch (error) {
        console.error('Error fetching fees:', error);
        res.status(500).json({ error: 'Failed to fetch fees' });
    }
}

