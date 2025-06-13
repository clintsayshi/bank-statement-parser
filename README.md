# Statement Parser - AI Powered Bank Statement Analysis

This project is a Next.js web application that allows users to upload their bank statements (in PDF or CSV format) and uses AI to parse transaction details and extract key metadata from the statement.

## Features

*   **File Upload:** Supports uploading bank statements in PDF and CSV formats.
*   **AI-Powered Parsing:** Utilizes Genkit with Google's Gemini models to:
    *   Extract individual transactions (date, description, amount).
    *   Extract statement metadata such as:
        *   Account Holder Name
        *   Account Number
        *   Bank Name
        *   Statement Period
        *   Bank Address
*   **Transaction Display:** Shows extracted transactions in a clear, sortable table.
*   **Metadata Display:** Presents the extracted statement details in a dedicated section.
*   **Data Export:** Allows users to export the extracted transactions to CSV or JSON formats.
*   **Responsive Design:** User interface adapts to different screen sizes.
*   **Loading & Feedback:** Provides visual feedback during processing and uses toasts for notifications.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **AI Integration:** [Genkit (Firebase Genkit)](https://firebase.google.com/docs/genkit)
    *   **AI Model Provider:** Google AI (Gemini)
*   **Forms:** React Hook Form
*   **Icons:** Lucide React

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Environment Variables:**
    This project uses Genkit with the Google AI plugin. You may need to configure API keys or authentication for Google Cloud services.
    *   Create a `.env` file in the root of the project.
    *   You might need to set `GOOGLE_API_KEY` or ensure your environment is authenticated with Google Cloud if you are using Google AI models that require it. Refer to the [Genkit documentation](https://firebase.google.com/docs/genkit) and [Google AI plugin for Genkit](https://www.npmjs.com/package/@genkit-ai/googleai) for specific authentication and setup steps.
    *   Example `.env` content:
        ```env
        # Example - specific variables depend on your Genkit/Google AI setup
        # GOOGLE_API_KEY=your_google_api_key_here
        ```

### Running the Development Server

The application and the Genkit flows run as separate processes.

1.  **Start the Next.js development server:**
    This server handles the frontend application.
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

2.  **Start the Genkit development server:**
    This server hosts the AI flows.
    In a separate terminal window, run:
    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes:
    # npm run genkit:watch
    ```
    Genkit will typically start its UI on `http://localhost:4000` and flows will be served from `http://localhost:3400` (or as configured).

    The Next.js application is configured to communicate with the Genkit flows.

## Project Structure

*   `src/app/`: Next.js pages, layout, and core routing.
*   `src/components/`:
    *   `feature/`: Components specific to application features (e.g., `FileUpload`, `TransactionTable`).
    *   `ui/`: Reusable UI components from ShadCN UI.
*   `src/ai/`:
    *   `flows/`: Genkit flow definitions (e.g., `parse-bank-statement.ts`).
    *   `genkit.ts`: Genkit global configuration.
    *   `dev.ts`: Entry point for Genkit development server.
*   `src/lib/`: Utility functions (e.g., `cn` for classnames).
*   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useMobile`).
*   `src/types/`: TypeScript type definitions.
*   `public/`: Static assets.

## How It Works

1.  The user uploads a bank statement (PDF or CSV) through the UI in `src/app/page.tsx`.
2.  The `FileUpload` component (`src/components/feature/file-upload.tsx`) converts the file to a data URI.
3.  It then calls the `parseBankStatement` AI flow located in `src/ai/flows/parse-bank-statement.ts`.
4.  This Genkit flow uses a Google Gemini model to process the statement data URI, extracting transactions and metadata based on the defined Zod output schema and prompt.
5.  The extracted data is returned to the frontend.
6.  The `StatementParserPage` updates its state, and the `TransactionTable` and metadata display are re-rendered with the new information.
7.  Users can then export the transaction data using the `ExportButtons` component.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

(If this were a public open-source project, you might add more detailed contribution guidelines here.)

## License

This project is currently not under a specific open-source license. If you intend to use or distribute it, please consider adding an appropriate license.
```