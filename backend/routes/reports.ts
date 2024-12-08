import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import Form from "../models/Form";
import ResponseModel from "../models/Responses";

const router = Router();

// GET all forms responses by id

router.get("/form/:id", async(req, res) => {

    const { id } = req.params;
    const responses = await ResponseModel.find({ formId: id });
    res.json({
        responses: responses,
        length: responses.length
    });
});

export const reports = router;
