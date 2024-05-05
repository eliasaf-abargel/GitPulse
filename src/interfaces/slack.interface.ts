export interface SlackCommand {
  command: string;
  response: {
    text: string;
  };
}

export interface SlackConfig {
  slack: {
    commands: SlackCommand[];
  };
}
