# AWS Chrome Extension

## Overview
The AWS Chrome Extension is a tool designed to assist users in performing various tasks on AWS (Amazon Web Services) by providing step-by-step guidance. Users can input specific AWS tasks, and the extension dynamically generates instructions, including where to click and what commands to execute.

## Features
- **Dynamic Task Guidance**: Enter a task for aws(e.g., "Launch an EC2 instance") and receive step-by-step instructions.
- **Interactive UI**: A clean and intuitive interface for task input and response visualization.
- **AI-Powered**: Leverages advanced AI models (e.g., Hugging Face or OpenAI GPT) for generating detailed, task-specific instructions.
- **Seamless Integration**: Works directly within your Chrome browser, making it easy to use alongside AWS Console.

## Prerequisites
1. Google Chrome browser.
2. An active Hugging Face or OpenAI account for API integration.
3. API key from Hugging Face or OpenAI.

## Installation
1. Clone or download this repository.
   ```bash
   git clone https://github.com/aws-extension.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top-right corner.
4. Click on "Load unpacked" and select the extension folder.
5. The AWS Chrome Extension should now appear in your extensions bar.

## Usage
1. Click on the AWS Chrome Extension icon in your extensions bar.
2. Enter the AWS task you need assistance with in the input field (e.g., "How to set up an S3 bucket").
3. Press the "Submit" button.
4. The extension will fetch step-by-step instructions from the AI model and display them in the response section.

## Configuration
### API Key Setup
1. Obtain an API key from your AI service provider (e.g., Hugging Face or OpenAI):
   - [Hugging Face API Key](https://huggingface.co/settings/tokens)
   - [OpenAI API Key](https://platform.openai.com/)
2. Open the `background.js` file in the extension directory.
3. Replace `YOUR_API_KEY` with your actual API key:
   ```javascript
   const API_KEY = "YOUR_API_KEY";
   ```
4. Save the file and reload the extension in Chrome.

## Example Prompt
**Input:**
"How do I launch an EC2 instance?"

**Output:**
1. Navigate to the AWS Management Console.
2. Go to the EC2 section under "Instances."
3. Click on "Launch Instance."
4. Choose an Amazon Machine Image (AMI).
5. Select an instance type.
6. Configure instance details (e.g., number of instances, VPC settings).
7. Add storage and configure security groups.
8. Review and click "Launch."

## Development
### File Structure
- `manifest.json`: Configuration file for the Chrome extension.
- `popup.html`: UI structure for the extension's popup window.
- `popup.js`: Logic for handling user input and responses.
- `background.js`: Handles API
