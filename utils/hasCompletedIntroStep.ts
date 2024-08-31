import { INTRO_STEPS, IntroStep, SaveData } from "@/app/lib/save-data";

const hasCompletedIntroStep = (step: IntroStep, saveData: SaveData) => {
  if (saveData.introNextStep === null) {
    return true;
  }

  const stepIndex = INTRO_STEPS.indexOf(step);
  const saveDataNextStepIndex = INTRO_STEPS.indexOf(saveData.introNextStep);

  return stepIndex < saveDataNextStepIndex;
};

export default hasCompletedIntroStep;
