import { css, type SerializedStyles } from "@emotion/react";

export const container = ({ fullScreen }: { fullScreen: boolean }): SerializedStyles => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${fullScreen ? "100vh" : "auto"};

  .eg-loader__spinner {
    display: block !important;
  }
`;
