// utils/resumeFunctions.js
const axios = require('axios');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const PROMPT_TEMPLATE = `

You are a professional resume enhancer with deep expertise in aligning resumes to specific job descriptions while preserving formatting and visual structure. Your task is to carefully review the resume written in Markdown format and provide personalized enhancement tips that would help the candidate better align their resume with the provided job description—without modifying the resume itself.

### Guidelines



1. Provide Actionable Tailoring Tips(section 1)  
   - Offer bullet-point suggestions on how to better highlight skills, tools, experiences, and achievements already present in the resume that match the job description.  
   - Focus on visibility improvements: positioning, stronger phrasing, or quantification of what is already there.  
   - Mention specific resume areas (e.g., project bullets, summary, tech stack) where content can be rephrased or emphasized, not added.  
   - Tips should help pass ATS and impress recruiters.

2. Respect the Original Resume  
   - Your tips should work strictly within the existing content and structure.  
   - Avoid recommending radical structural changes or new content creation.

3. Examples of Good Tips  
   - “You already mention AWS and Node.js—consider referencing them directly in a project bullet where they contributed to performance improvements.”  
   - “REST API experience is already in your resume—highlight any quantifiable impact or scalability improvements you achieved with it.”  
   - “You list collaboration with PMs and designers—bring this forward in bullets to reflect the job’s emphasis on cross-functional teamwork.”

4. General Writing Improvements (Section 2)  
   - Focus only on grammar corrections and sentence clarity.  
   - Do not give tips about formatting, layout, or structural consistency.  
   - Limit to 2-4 specific suggestions that improve sentence quality or fix grammatical mistakes.

5. Format of Your Output  
    - Return two clearly labeled sections:  
     ###✨ Tailoring Tips for This Job:  
     ###🛠 General Writing Improvements:   
   - Use bullet points for each tip.  
   - Do not return the resume or job description again.

---

### Input:

Resume (Markdown Format):  
{md_resume}

Job Description:  
{job_description}

---
i want the output pointwise its important
Return only the following dont mention anything else:
### Output:

✨ Tailoring Tips for This Job:
- ...

✍️ General Writing Improvements:
- ...

### Example Output:
✨ Tailoring Tips for This Job:
- Highlight your experience with AWS and Node.js in the project bullet where you improved performance.
- Emphasize your REST API experience by quantifying the impact or scalability improvements you achieved with it.
- Bring forward your collaboration with PMs and designers in the bullets to reflect the job’s emphasis on cross-functional teamwork.

✍️ General Writing Improvements:
- Correct the sentence structure in the summary to improve clarity.
- Fix the grammatical error in the project description to enhance professionalism.
- Ensure consistent verb tenses throughout the resume for better readability.
`;

async function callGroqAI(resumeText, jobDescription) {
  const prompt = PROMPT_TEMPLATE
    .replace('{md_resume}', resumeText)
    .replace('{job_description}', jobDescription);

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        messages: [
          { role: 'system', content: 'You are a highly skilled Markdown resume optimizer.' },
          { role: 'user', content: prompt },
        ],
        model: 'llama3-70b-8192',
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('Error calling Groq API:', err.message);
    return '⚠ AI optimization failed. Please try again later.';
  }
}

async function callGroqATS(resumeText, jobDescription) {
  const prompt = `
Role: Skilled ATS Scanner with expertise in data science and ATS functionality.

Responsibilities:  
1. Evaluate the resume against the provided job description . 
2. List missing keywords to improve the score, formatted as a concise bullet list.  
3. Suggest improvements for alignment, including keyword integration, experience alignment, and formatting enhancements.  

Output Format:  
- Missing Keywords: A, B, C, …  
- Improvements:  
  1. Keyword Integration: Suggestions to incorporate missing keywords naturally within the resume.  
  2. Experience Alignment: Suggestions to align work experience with the job requirements (e.g., IT/ICT projects, leadership).  
  3. Formatting and Structure: Suggestions to enhance readability, clarity, and formatting consistency.  

Example Output:  
- Missing Keywords: SQL Server, Statistical Modeling, Data Mining, Regression Models, Time Series Models  
- Improvements:  
  1. Keyword Integration: Include SQL Server, Statistical Modeling, and Data Mining in technical skills and project descriptions.  
  2. Experience Alignment: Highlight IT/ICT projects and leadership experience to meet the 8+ years requirement.  
  3. Formatting: Add a professional summary and ensure consistent formatting across all sections.
Resume:  
${resumeText}

Job Description:  
${jobDescription}
`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        messages: [
          { role: 'system', content: 'You are an expert ATS resume analyzer.' },
          { role: 'user', content: prompt },
        ],
        model: 'llama3-70b-8192',
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("Groq AI error:", err);
    return '❌ Failed to get optimization suggestions.';
  }
}

module.exports = { callGroqAI, callGroqATS };