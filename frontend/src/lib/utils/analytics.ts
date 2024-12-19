
// FOr the analytics page, we need to process the data from the responses to display it in a meaningful way
// We have different types of questions, so we need to process them differently


// For multiple choice questions, we can display the data in a pie chart
export function processMultipleChoiceData(question: any, responses: any[]) {
  const answerCounts: Record<string, number> = {};

  responses.forEach(response => {
    const answer = response.responses.find((r: any) => r.questionId === question._id)?.answer;
    if (answer) {
      answerCounts[answer] = (answerCounts[answer] || 0) + 1;
    }
  });

  return question.options.map((option: string) => ({
    name: option,
    value: answerCounts[option] || 0
  }));
}

// For checkbox questions, we can display the data in a bar chart
export function processCheckboxData(question: any, responses: any[]) {
  const answerCounts: Record<string, number> = {};

  responses.forEach(response => {
    const answer = response.responses.find((r: any) => r.questionId === question._id)?.answer;
    if (Array.isArray(answer)) {
      answer.forEach(option => {
        answerCounts[option] = (answerCounts[option] || 0) + 1;
      });
    }
  });

  return question.options.map((option: string) => ({
    name: option,
    count: answerCounts[option] || 0
  }));
}

// For rating and linear scale questions, we can display the average rating and the distribution of ratings in a bar chart
export function processScaleData(
    question: { _id: string },
    responses: Array<{ responses: Array<{ questionId: string; answer: string | number }> }>,
    scale: number
  ): { rating: number; count: number }[] {
    const answers = responses
      .map(response =>
        response.responses.find(r => r.questionId === question._id)?.answer
      )
      .filter(answer => answer !== undefined)
      .map(answer => Number(answer));

    return Array.from({ length: scale }, (_, i) => ({
      rating: i + 1,
      count: answers.filter(answer => answer === i + 1).length,
    }));
  }


// Calculate the average rating for a question
export function calculateAverageRating(responses: any[], questionId: string) {
  const ratings = responses
    .map(response =>
      response.responses.find((r: any) => r.questionId === questionId)?.answer
    )
    .filter(Boolean)
    .map(Number);

  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}


// For time questions, we can display the distribution of responses in a bar chart
export function processTimeData(responses: any[], questionId: string) {
  const timeData = responses
    .map(response =>
      response.responses.find((r: any) => r.questionId === questionId)?.answer
    )
    .filter(Boolean);

  const timeSlots: Record<string, number> = {};
  timeData.forEach(time => {
    const hour = time.split(':')[0];
    timeSlots[hour] = (timeSlots[hour] || 0) + 1;
  });

  return Object.entries(timeSlots).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count
  }));
}
