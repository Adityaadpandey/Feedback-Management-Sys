import { Router } from "express";
import ResponseModel from "../models/Responses";
import { authenticate } from "../middleware/authenticator";

const router = Router();

// GET all forms responses by id

router.get("/form/:id",authenticate, async (req, res):Promise<any> => {

    try {
        const { id } = req.params;

        const responses = await ResponseModel.find({ formId: id });

        if (responses.length === 0) {

            return res.status(404).json({
                message: "No responses found"
            });
        }
        else {

            res.json({
                responses: responses,
                length: responses.length
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });

    }
});

export const reports = router;
