import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

/**
 * Custom render that sets up a `user` helper alongside RTL.
 * No providers required right now; wrap here when we add context later.
 */
export function render(ui: ReactElement, options?: RenderOptions) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, options),
  };
}

export * from "@testing-library/react";
