document.addEventListener("DOMContentLoaded", () => {
const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const openIcon = document.getElementById('menu-icon-open');
const closeIcon = document.getElementById('menu-icon-close');

if (menuButton) {
    menuButton.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('hidden');
        if (openIcon && closeIcon) {
            openIcon.classList.toggle('hidden', !isOpen);
            closeIcon.classList.toggle('hidden', isOpen);
        }
    });
}
        
// Close menu when a link is clicked
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (openIcon && closeIcon) {
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    });
}

// Alpine.js logic for Gemini Demo
function geminiDemo() {
    return {
        activeTab: 'lending',
        isLoading: false,
        output: '',
        error: '',
        documentText: '',
        // Store prompts and sample documents in a structured way
        content: {
            lending: {
                document: `
                BALANCE SHEET (for year ending 31 Mar 2025)
                    
                LIABILITIES & EQUITY                    | ASSETS
                ---------------------------------------------------------------------------
                Accounts Payable          10,00,000     | Cash & Bank           25,00,000
                Short-term Loans          12,00,000     | Accounts Receivable   15,00,000
                Long-term Debt            20,00,000     | Inventory             12,00,000
                Shareholder Equity        40,00,000     | Fixed Assets          30,00,000
                ---------------------------------------------------------------------------
                TOTAL L&E                 82,00,000     | TOTAL ASSETS          82,00,000

                PROFIT & LOSS STATEMENT (for year ending 31 Mar 2025)
                
                EXPENSES                               | INCOME
                ---------------------------------------------------------------------------
                Cost of Goods Sold      28,00,000      | Revenue (Sales)         75,00,000
                Salaries & Wages        18,00,000      | Other Income             3,00,000
                Rent & Utilities         6,00,000      |
                Marketing & Admin        5,00,000      |
                NET PROFIT              21,00,000      |
                ---------------------------------------------------------------------------
                TOTAL (Profit + Exp)    78,00,000      | TOTAL INCOME            78,00,000
                `,
                systemPrompt: `Act as a senior credit analyst. Analyze the provided bank statement excerpt for an SME loan application. Identify key positive indicators, major red flags, and calculate the total loan/EMI payments. Present the output as a concise bulleted list under 'Key Insights'.`
            },
            claims: {
                document: `
                **TRIANGULATED EXCERPTS FOR CLAIM #9021**
                **Document 1: Handwritten FIR (Translated Excerpt)**
                "...at approx 2:30 PM on 15 Oct, my blue car (DL-01-AB-1234) was hit from behind by a speeding white truck. The truck did not stop. Major damage to the rear bumper and trunk..."
                **Document 2: Surveyor Report (Excerpt)**
                "Vehicle: Blue Sedan (DL-01-AB-1234)
                Observed Damage: Significant impact to rear bumper, trunk lid, and right taillight. Paint transfer (white) consistent with impact. Repair Estimate: INR 85,000. No signs of prior damage..."
                **Document 3: Claim Form (Excerpt)**
                "Date of Incident: 15/10/2025
                Time: 2:30 PM
                Description: My car was stationary at a red light when a white truck hit me from behind at high speed and fled the scene.
                Damage: Rear bumper, trunk, taillight."
                `,
                systemPrompt: `Act as an expert insurance claims processor. Analyze the three provided document excerpts (FIR, Surveyor Report, Claim Form). Triangulate the data to check for consistency. Identify any red flags or inconsistencies. Conclude with a recommendation: 'Process for STP' or 'Flag for Human Review'. Present as a concise bulleted list.`
            },
            audit: {
                document: `
                **Excerpt: IndAS 116 Compliance Check - Annual Report 2024**
                "The Company's lease obligations are primarily for office premises and warehouses, with terms ranging from 3 to 5 years. As per company policy, leases with a term of 12 months or less ('short-term leases') and leases for which the underlying asset is of low value are expensed on a straight-line basis. For all other leases, a Right-of-Use (RoU) asset and a corresponding lease liability have been recognized.
                ...In FY 2023-24, the Company entered into a 5-year lease for a new corporate office. The total undiscounted lease payment is 5 Cr. The Company has recognized an RoU asset of 4.1 Cr and a lease liability of 4.1 Cr.
                ...A short-term lease for a 6-month marketing event space was expensed (Total cost: 15 Lacs)."
                `,
                systemPrompt: `Act as a senior compliance auditor. Analyze the provided annual report excerpt. Check for compliance with IndAS 116 (Leases) based *only* on the text. Identify 1) compliant actions, 2) potential areas for further review, and 3) any clear non-compliant statements. Present as a concise bulleted list.`
            }
        },

        init() {
            // Set initial document text on load
            this.documentText = this.content.lending.document.trim();
        },

        selectTab(tab) {
            this.activeTab = tab;
            this.documentText = this.content[tab].document.trim();
            this.output = ''; // Clear output when tab changes
            this.error = '';
        },

        // Converts plain text to basic HTML for list formatting
        formatOutput(text) {
            return text
                .replace(/\* (.*?)(?=\n\* |$)/g, '<li>$1</li>') // Convert * list items to <li>
                .replace(/<li>/g, '<li class="flex items-start"><svg class="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg><span>') // Add checkmark icon
                .replace(/<\/li>/g, '</span></li>')
                .replace(/\n/g, '<br>'); // Keep line breaks
        },

        async handleAnalysis() {
            this.isLoading = true;
            this.output = '';
            this.error = '';

            const userQuery = this.content[this.activeTab].document;
            const systemPrompt = this.content[this.activeTab].systemPrompt;
            const apiKey = getenv(API_KEY); // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
            };

            try {
                // Implement exponential backoff
                let response;
                let delay = 1000;
                for (let i = 0; i < 5; i++) { // Retry up to 5 times
                    response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                if (response.ok) {
                    break; // Success
                } else if (response.status === 429 || response.status >= 500) {
                    // Throttling or server error, wait and retry
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    // Other client-side error, don't retry
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
            }

            if (!response.ok) {
                throw new Error(`API Error after retries: ${response.status} ${response.statusText}`);
            }

            let result = await response.json();
                    
            if (result.candidates && result.candidates[0].content.parts[0].text) {
                let rawText = result.candidates[0].content.parts[0].text;
                this.output = this.formatOutput(rawText);
            } else if (result.candidates && result.candidates[0].finishReason === 'SAFETY') {
                this.error = "This demo cannot process the request due to safety restrictions. The FexoLM production model is trained for these complex cases.";
            } else {
                throw new Error("No content received from the model.");
            }

            } catch (e) {
                console.error("Error calling Gemini API:", e);
                this.error = `An error occurred. ${e.message}. Please try again.`;
            } finally {
                this.isLoading = false;
            }
        }
    }
}
});
