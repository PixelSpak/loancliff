# Loan Cliff Brevo Email Funnel

This is the source copy and implementation plan for the first Loan Cliff email funnel. Keep the calculator and affiliate lender links ungated. Email capture should feel like a utility: save the personalized report, get rate alerts, and receive decision help.

## Current Recommendation

Keep the results page affiliate-first:

1. Show the total funding gap immediately.
2. Show lender comparison links directly on the results page.
3. Open affiliate links in a new tab so the Loan Cliff result stays available.
4. Add email capture as a secondary action below or near the lender section.
5. Use the email sequence to recover students who are not ready to apply on the first visit.

Do not require email before showing the gap number or before showing lender options.

## Brevo Setup

Required environment variables when implementation starts:

```bash
BREVO_API_KEY=
BREVO_LIST_ID=
BREVO_TEMPLATE_REPORT=
NEXT_PUBLIC_SITE_URL=https://loancliff.com
```

Recommended Brevo contact attributes:

```text
SCHOOL
PROGRAM
START_YEAR
GAP_TOTAL
GAP_PER_YEAR
MONTHLY_EQUIVALENT
RESULT_URL
```

Recommended Brevo lists or segments:

- Main subscribers: everyone who requests a report.
- Clicked affiliate: contacts who click a lender link from email.
- PDF buyer: future segment if the paid decision kit launches.

## Capture Offer

Primary opt-in copy:

```text
Email me this gap report as a PDF + alert me if refi rates drop below 6%.
```

Button:

```text
Send My Report
```

Microcopy:

```text
No account. No spam. Just your report and useful updates if the 2026 loan rules affect your options.
```

## Transactional Email Template

Subject:

```text
Your {{ params.school_short_name }} funding gap report is ready
```

Preview text:

```text
Your personalized Loan Cliff estimate, lender comparison links, and next steps are inside.
```

HTML direction for Brevo:

```html
<div style="margin:0;padding:0;background:#faf9fc;font-family:Arial,Helvetica,sans-serif;color:#1b1c1e;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf9fc;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #c4c6ce;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #e2e8f0;">
              <div style="font-family:Georgia,serif;font-size:18px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#001229;">Loan Cliff</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 20px;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:#44474d;">Your estimated uncovered cost</p>
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:36px;line-height:1.05;color:#ba1a1a;">{{ params.gap_total }}</h1>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#44474d;">
                Based on {{ params.program_label }} at {{ params.school_name }}, Loan Cliff estimates an uncovered funding gap of {{ params.gap_per_year }} per year, or about {{ params.monthly_equivalent }} per month.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;border:1px solid #e2e8f0;border-radius:6px;">
                <tr>
                  <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#44474d;font-size:14px;">Cost of attendance</td>
                  <td align="right" style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#1b1c1e;font-weight:700;font-size:14px;">{{ params.coa_per_year }}/yr</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#44474d;font-size:14px;">Projected federal cap</td>
                  <td align="right" style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#1b1c1e;font-weight:700;font-size:14px;">{{ params.cap_per_year }}/yr</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;color:#44474d;font-size:14px;">Program length</td>
                  <td align="right" style="padding:14px 16px;color:#1b1c1e;font-weight:700;font-size:14px;">{{ params.length_years }} years</td>
                </tr>
              </table>
              <a href="{{ params.result_url }}" style="display:inline-block;background:#001229;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 18px;border-radius:4px;">View lender options</a>
              <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#74777e;">
                Your PDF report is attached. Loan Cliff may earn a commission if you use a lender link, but that does not affect the calculation.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;background:#efedf0;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;line-height:1.5;color:#74777e;">
                Data sources: U.S. Department of Education, IPEDS, and published program cost data. This is educational information, not financial advice. Always confirm eligibility and terms with your school and lender.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
```

## Seven-Email Nurture Sequence

Use one main CTA per email. Affiliate email links should use:

```text
utm_source=brevo&utm_medium=email&utm_campaign=cliff-seq&utm_content=email-N
```

### Email 1: Immediate

Subject:

```text
Your funding gap report is ready
```

Goal: deliver the report and bring them back to the result page.

Body:

```text
Your Loan Cliff report is attached.

The big number is your estimated uncovered cost after the projected July 1, 2026 federal loan changes are applied to your school and program.

What to do first:

1. Save the report.
2. Confirm your school’s current cost of attendance.
3. Compare private lender options before you assume one lender is the default.

Your result page is here:
{{ result_url }}

Loan Cliff
```

CTA:

```text
View My Result
```

### Email 2: Day 1

Subject:

```text
What changed after June 30, 2026?
```

Goal: explain the rule change without overclaiming.

Body:

```text
The short version:

Graduate PLUS loans are scheduled to end for new borrowers after June 30, 2026. Students starting after that date may face new federal borrowing limits.

For many graduate programs, the projected federal limit is $20,500 per year, up to $100,000 aggregate. For professional programs, the projected limit is $50,000 per year, up to $200,000 aggregate.

That is why a high-cost program can show a large uncovered amount even if the school’s financial aid page still lists the full cost of attendance.

The important part: do not compare lenders blindly. Compare total cost, fixed vs. variable APR, co-signer release, fees, hardship options, and whether the lender supports your program type.

Start with your personalized result:
{{ result_url }}
```

CTA:

```text
Compare Options
```

### Email 3: Day 3

Subject:

```text
Private loans are not all the same
```

Goal: push thoughtful affiliate comparison.

Body:

```text
If your federal aid no longer covers the full cost, private student loans may be one way to bridge the gap.

Before you apply anywhere, compare these six things:

1. APR range
2. Fixed vs. variable rate
3. Whether checking rates uses a soft credit pull
4. Co-signer requirements and co-signer release
5. In-school repayment options
6. Deferment, hardship, or forbearance policies

A lower headline rate is useful only if the rest of the terms fit your situation.

Your Loan Cliff result page includes lender comparison links:
{{ result_url }}
```

CTA:

```text
Compare Lenders
```

### Email 4: Day 6

Subject:

```text
Ask your financial aid office these 5 questions
```

Goal: increase trust and keep the user from feeling pushed only toward affiliates.

Body:

```text
Before borrowing privately, send your financial aid office these questions:

1. Does my program qualify as graduate or professional under the new limits?
2. Will continuing students have any transition or grandfathering treatment?
3. Are institutional scholarships, grants, assistantships, or emergency funds available?
4. Is the published cost of attendance adjustable for documented expenses?
5. Does the school maintain a preferred lender list or historical borrowing guidance?

Schools may interpret timing and eligibility details differently as federal implementation guidance evolves, so get the answer in writing.

Then compare that answer against your gap estimate:
{{ result_url }}
```

CTA:

```text
Recheck My Gap
```

### Email 5: Day 10

Subject:

```text
The co-signer question
```

Goal: educate on a major private-loan conversion blocker.

Body:

```text
Many graduate students can check private-loan rates, but approval and final APR may depend on credit history, income, debt, school, program, and whether a co-signer is added.

If you may need a co-signer, ask lenders:

1. Is co-signer release available?
2. After how many on-time payments?
3. Is release automatic or application-based?
4. Does the borrower need to meet income or credit requirements again?
5. What happens if the co-signer’s credit changes before final approval?

The best lender is not always the one with the loudest ad. It is the one whose terms fit the way you actually plan to pay.

Compare options from your result page:
{{ result_url }}
```

CTA:

```text
Review Lender Options
```

### Email 6: Day 17

Subject:

```text
Borrow, defer, or choose another program?
```

Goal: help with decision framing while keeping affiliate links relevant.

Body:

```text
A large funding gap does not always mean "do not go."

But it should force a real decision:

1. Expected income after graduation
2. Total debt at graduation
3. Time to repayment
4. Probability of finishing the program
5. Availability of scholarships, assistantships, family help, or employer support
6. Whether a lower-cost school creates the same career outcome

Use your gap number as a stress test. If the private-loan amount feels too high, that is useful information before you sign.

Your estimate is here:
{{ result_url }}
```

CTA:

```text
Open My Estimate
```

### Email 7: Day 30

Subject:

```text
Still planning for {{ params.school_short_name }}?
```

Goal: final conversion and list cleanup signal.

Body:

```text
If you are still considering {{ params.school_name }}, this is a good time to revisit the funding gap.

Costs, lender rates, and school guidance can change. Your original estimate is still useful as a planning baseline, but the next step is to compare actual lender offers and confirm your school’s aid guidance.

Your saved result:
{{ result_url }}

If the gap is manageable, compare lenders.
If the gap feels too high, ask the school about scholarships, assistantships, cost-of-attendance adjustments, and lower-cost paths before committing.

Loan Cliff
```

CTA:

```text
Compare Current Options
```

## Source Notes

As of April 30, 2026, public school and financial-aid pages are consistently describing:

- Graduate PLUS loans ending for new borrowers after June 30, 2026.
- New graduate limits of $20,500 per year and $100,000 aggregate.
- New professional limits of $50,000 per year and $200,000 aggregate.
- Possible transition treatment for some already-enrolled borrowers, depending on borrower status, program, and timing.

Use cautious wording in emails: "scheduled," "projected," "may," and "confirm with your financial aid office" where implementation details may vary.
