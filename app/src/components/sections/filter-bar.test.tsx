import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "../../../test/helpers/render";
import { screen, fireEvent } from "@testing-library/react";

/**
 * The filter bar wires @base-ui/react's <Select> (Portal + Positioner) which is
 * awkward to drive with userEvent under happy-dom. We stub `@/components/ui/select`
 * with a native <select> shim that preserves the `onValueChange` contract, so the
 * tests focus on the component's URL/router logic rather than base-ui DOM.
 */
vi.mock("@/components/ui/select", async () => {
  const React = await import("react");
  type SelectProps = {
    value?: string;
    onValueChange?: (v: string) => void;
    children?: React.ReactNode;
  };
  const Select = ({ value, onValueChange, children }: SelectProps) => {
    // Flatten any SelectContent/SelectItem children into <option>s.
    const options: React.ReactNode[] = [];
    const visit = (node: React.ReactNode) => {
      React.Children.forEach(node, (child: React.ReactNode) => {
        if (!React.isValidElement(child)) return;
        const el = child as React.ReactElement<Record<string, unknown>>;
        const props = el.props as Record<string, unknown>;
        if ("value" in props && typeof props.value === "string") {
          options.push(
            React.createElement(
              "option",
              { key: props.value as string, value: props.value as string },
              props.children as React.ReactNode,
            ),
          );
        } else if (props && props.children) {
          visit(props.children as React.ReactNode);
        }
      });
    };
    visit(children);
    return React.createElement(
      "select",
      {
        "data-testid": "filter-select",
        value: value ?? "",
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
          onValueChange?.(e.target.value),
      },
      options,
    );
  };

  const passthrough = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);

  return {
    Select,
    SelectTrigger: passthrough,
    SelectValue: passthrough,
    SelectContent: passthrough,
    SelectItem: ({
      value,
      children,
    }: {
      value: string;
      children?: React.ReactNode;
    }) =>
      React.createElement(
        "span",
        { "data-value": value, "data-slot": "select-item" },
        children,
      ),
  };
});

// Mutable URLSearchParams state exposed to tests via `setInitialParams`.
let currentParams = new URLSearchParams();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => currentParams,
}));

import { FilterBar } from "./filter-bar";

function setInitialParams(qs: string) {
  currentParams = new URLSearchParams(qs);
}

describe("FilterBar", () => {
  beforeEach(() => {
    replace.mockClear();
    setInitialParams("");
  });

  it("renders the four filter labels: 예산 / 지역 / 환경 / 최고 계절", () => {
    render(<FilterBar />);

    expect(screen.getByText("예산")).toBeInTheDocument();
    expect(screen.getByText("지역")).toBeInTheDocument();
    expect(screen.getByText("환경")).toBeInTheDocument();
    expect(screen.getByText("최고 계절")).toBeInTheDocument();
  });

  it("reflects the budget URL param as the budget select's initial value", () => {
    setInitialParams("budget=100%EB%A7%8C%EC%9B%90%20%EC%9D%B4%ED%95%98");
    render(<FilterBar />);

    const selects = screen.getAllByTestId(
      "filter-select",
    ) as HTMLSelectElement[];

    // Order: budget, region, environment, bestSeason (Object.keys order).
    expect(selects[0].value).toBe("100만원 이하");
    expect(selects[1].value).toBe("all");
    expect(selects[2].value).toBe("all");
    expect(selects[3].value).toBe("all");
  });

  it("calls router.replace with the new URL when a select value changes", () => {
    render(<FilterBar />);

    const selects = screen.getAllByTestId(
      "filter-select",
    ) as HTMLSelectElement[];

    // Change the budget select (index 0) to "200만원 이상".
    fireEvent.change(selects[0], { target: { value: "200만원 이상" } });

    expect(replace).toHaveBeenCalledTimes(1);
    const [url] = replace.mock.calls[0];
    expect(url).toMatch(/^\/\?/);
    const qs = new URLSearchParams(url.slice(2));
    expect(qs.get("budget")).toBe("200만원 이상");
  });

  it("removes the param from the URL when 'all' is selected", () => {
    setInitialParams("budget=100%EB%A7%8C%EC%9B%90%20%EC%9D%B4%ED%95%98");
    render(<FilterBar />);

    const selects = screen.getAllByTestId(
      "filter-select",
    ) as HTMLSelectElement[];

    // Budget select is currently "100만원 이하" — switching to "all" should
    // drop the param, resulting in router.replace("/", { scroll: false }).
    fireEvent.change(selects[0], { target: { value: "all" } });

    expect(replace).toHaveBeenCalledTimes(1);
    const [url] = replace.mock.calls[0];
    expect(url).toBe("/");
  });

  it("preserves other params when changing a single filter", () => {
    setInitialParams("region=%EC%88%98%EB%8F%84%EA%B6%8C&budget=100%EB%A7%8C%EC%9B%90%20%EC%9D%B4%ED%95%98");
    render(<FilterBar />);

    const selects = screen.getAllByTestId(
      "filter-select",
    ) as HTMLSelectElement[];

    // Change budget (index 0) to "200만원 이상"; region should be untouched.
    fireEvent.change(selects[0], { target: { value: "200만원 이상" } });

    expect(replace).toHaveBeenCalledTimes(1);
    const [url] = replace.mock.calls[0];
    const qs = new URLSearchParams(url.slice(2));
    expect(qs.get("budget")).toBe("200만원 이상");
    expect(qs.get("region")).toBe("수도권");
  });

  it("passes { scroll: false } to router.replace so the page doesn't jump", () => {
    render(<FilterBar />);

    const selects = screen.getAllByTestId(
      "filter-select",
    ) as HTMLSelectElement[];

    fireEvent.change(selects[1], { target: { value: "제주도" } });

    expect(replace).toHaveBeenCalledTimes(1);
    const [, opts] = replace.mock.calls[0];
    expect(opts).toEqual({ scroll: false });
  });
});
