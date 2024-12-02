import Providers from "@/app/providers";
import { render as renderComponent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

export function render(
  ui: ReactElement,
  opts?: Parameters<typeof renderComponent>[1]
) {
  return {
    ...renderComponent(ui, { ...opts, wrapper: Providers }),
    user: userEvent.setup(),
  };
}
