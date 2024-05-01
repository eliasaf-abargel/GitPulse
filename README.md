# GitPulse

<p align="center">
  <img src="[GitPulse](https://github.com/eliasaf-abargel/GitPulse.git/blob/main/GitPulse.jpg?raw=true)" alt="GitPulse Logo" width="200" height="200">
</p>


# GitHub-Slack Integration App

This project integrates GitHub and Slack to enable seamless notifications and commands handling between the two platforms. It allows users to execute Slack commands that interact with GitHub data, such as listing repositories, fetching user details, and more.

## Features

- List, fetch, and display GitHub organization details directly in Slack.
- Execute Slack commands to interact with GitHub data.
- Log system activities for debugging and monitoring purposes.

## Prerequisites

Before you start, make sure you have the following installed:
- Node.js (v14 or later)
- npm (Node Package Manager)
- Docker (for containerization)
- A Slack account with administrative access to configure apps

## Configuration

### Environment Setup

You will need to set up the following environment variables in a `.env` file in the root directory:

```plaintext
GITHUB_TOKEN=<your_github_token>
GITHUB_ORG=<your_github_organization>
SLACK_BOT_TOKEN=<your_slack_bot_token>
SLACK_SIGNING_SECRET=<your_slack_signing_secret>
SLACK_CHANNEL=<your_slack_channel_id>
```

### Slack App Configuration

1. **Create a Slack App**:
   - Go to [Your Apps](https://api.slack.com/apps) on Slack.
   - Click **Create New App**, choose **From scratch**, name your app, and select your workspace.

2. **Configure Permissions**:
   - In the Slack app settings, navigate to **OAuth & Permissions**.
   - Add the following Bot Token Scopes: `commands`, `chat:write`, `chat:write.public`.
   - Install the app to your workspace and note the Bot User OAuth Token.

3. **Set Up Slash Commands**:
   - In the app settings, go to **Slash Commands** and create new commands as detailed in the `slack-config.yaml` file (e.g., `/repo-list`, `/user-details`).

4. **Event Subscriptions**:
   - Enable events and subscribe to bot events like `app_mention` and `message.channels`.

5. **Interactivity & Shortcuts**:
   - Enable interactivity and provide the request URL which will handle your Slack commands (e.g., `http://<your-server>/slack/commands`).

## Installation

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/github-slack-app.git
   cd github-slack-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t github-slack-app .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 4000:4000 --env-file .env github-slack-app
   ```

## Usage

Once the server is running, you can use the configured Slack commands in your Slack workspace to interact with your GitHub data.

## Contributing

Contributions to enhance the functionality or documentation are highly welcomed. Please ensure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This README provides a clear overview of what the project is, how it functions, and detailed steps for setting it up and running it in various environments. It's structured to ensure ease of understanding and usability for new users.
