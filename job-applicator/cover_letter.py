import anthropic
import os


def generate_cover_letter(
    resume_text: str,
    applicant_name: str,
    applicant_email: str,
    company: str,
    job_title: str,
    job_description: str,
) -> str:
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    prompt = f"""You are a professional cover letter writer. Write a compelling, personalized cover letter for the following job application.

APPLICANT INFORMATION:
Name: {applicant_name}
Email: {applicant_email}

RESUME:
{resume_text}

JOB DETAILS:
Company: {company}
Position: {job_title}
Job Description:
{job_description}

Write a professional cover letter that:
1. Opens with a strong, specific hook (not "I am writing to apply for...")
2. Highlights 2-3 of the applicant's most relevant experiences/skills that match the job
3. Shows genuine interest in the company and role
4. Ends with a confident call to action
5. Is 3-4 paragraphs, around 300-400 words
6. Uses a professional but warm tone

Output only the cover letter text, starting with "Dear Hiring Manager," (or specific name if inferable from job description). Do not include a subject line or any preamble."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text
