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

export function processScaleData(question: any, responses: any[]) {
  const answers = responses
    .map(response => 
      response.responses.find((r: any) => r.questionId === question._id)?.answer
    )
    .filter(Boolean)
    .map(Number);

  return Array.from({ length: 10 }, (_, i) => ({
    rating: i + 1,
    count: answers.filter(answer => answer === i + 1).length
  }));
}

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