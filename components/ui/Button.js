import { Button, ButtonProps } from "@mantine/core";

import classes from "@/styles/SocialButtons.module.css";

export function DiscordButton(props) {
  return (
    <Button
      className={classes.discordButton}
      leftSection={
        <div class="w-4 h-4 rounded-sm bg-yellow-500 flex items-center justify-center">
          <svg
            width="10"
            height="10"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="overflow-visible"
            style="stroke-width: 1.5px;"
          >
            <path
              d="M9.255 7.2h3.45c.485 0 .786.448.541.803l-5.332 7.732c-.324.47-1.169.275-1.169-.27V8.8h-3.45c-.485 0-.786-.448-.541-.803L8.086.264c.324-.469 1.169-.274 1.169.27V7.2Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      }
      {...props}
    />
  );
}
