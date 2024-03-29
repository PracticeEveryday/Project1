import { Router } from "express";
import { educationService } from "../service/educationService";

const educationRouter = Router();

educationRouter.delete("/educations/:educationId", async (req, res, next) => {
  try {
    const educationId = req.params.educationId;
    const removedEducation = await educationService.deleteEducation({
      educationId,
    });
    res.status(200).json(removedEducation);
  } catch (error) {
    next(error);
  }
});

educationRouter.put("/educations/:educationId", async (req, res, next) => {
  try {
    const educationId = req.params.educationId;
    const { school, fromDate, toDate } = req.body;
    const updatedEducation = await educationService.update({
      educationId,
      school,
      fromDate,
      toDate,
    });

    if (updatedEducation.errorMessage) {
      throw new Error(updatedEducation.errorMessage);
    }
    res.status(200).json(updatedEducation);
  } catch (error) {
    next(error);
  }
});

educationRouter.get("/education/list", async (req, res, next) => {
  try {
    const userId = req.user.ObjectId;
    const findUserSchool = await educationService.findUserSchool({ userId });
    if (findUserSchool.errorMessage) {
      throw new Error(findUserSchool.errorMessage);
    }
    const SortfindUserSchool = findUserSchool.sort((a, b) => {
      return a.fromDate - b.fromDate;
    });
    /**
    ageResult = nameAge.sort(function (a, b) {
      return a.Age - b.Age;
    });
     */

    res.status(200).json({
      status: "succ",
      user: `${SortfindUserSchool[0].userId.name} `,
      message: `${SortfindUserSchool.map((item) => {
        return item.school;
      })}`,
    });
  } catch (error) {
    next(error);
  }
});

educationRouter.post("/education/create", async (req, res, next) => {
  try {
    const userId = req.user.ObjectId;
    const { school, fromDate, toDate } = req.body;
    const newEducation = await educationService.create({
      userId,
      school,
      fromDate,
      toDate,
    });
    res.status(200).json(newEducation);
  } catch (error) {
    next(error);
  }
});

educationRouter.get("/education", (req, res, next) => {
  res.json({
    status: "succ",
  });
});

export { educationRouter };
