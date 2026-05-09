import { type SVGProps } from "react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import { CalendarSVG } from "@epignosis_llc/ui-icons";
import { render, screen } from "../../test-utils/render";
import Button from "./Button";

/** Vitest serves real `.svg` modules (not stubs); we still use a plain SVG to assert `className` merging. */
const MockSvgIcon = (props: SVGProps<SVGSVGElement>) => <svg {...props} />;

describe("<Button />", () => {
  it("renders correctly!", () => {
    const btnText = faker.lorem.word();
    render(<Button type="submit">{btnText}</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(btnText);
    expect(button).toHaveAttribute("type", "submit");
    expect(button).not.toBeDisabled();
  });

  it("calls the onClick callback", async () => {
    const mockFn = vi.fn();
    render(<Button onClick={mockFn}>{faker.lorem.word()}</Button>);
    const button = screen.getByRole("button");

    expect(button).not.toBeDisabled();

    await userEvent.click(button);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("disabled button", async () => {
    const mockFn = vi.fn();
    render(
      <Button disabled onClick={mockFn}>
        Disabled button
      </Button>,
    );
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    await userEvent.click(button);

    expect(mockFn).not.toHaveBeenCalled();
  });

  it("is loading button", async () => {
    const mockFn = vi.fn();
    const { container } = render(
      <Button isLoading onClick={mockFn}>
        Loading button
      </Button>,
    );
    const button = screen.getByRole("button");
    const loadingIcon = container.querySelector(".eg-button__spinner");

    expect(loadingIcon).toBeInTheDocument();
    expect(button).toBeDisabled();

    await userEvent.click(button);

    expect(mockFn).not.toHaveBeenCalled();
  });

  it("act as Link button", () => {
    const linkText = faker.lorem.words();
    const href = faker.internet.url();

    render(
      <Button as="a" href={href}>
        {linkText}
      </Button>,
    );
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent(linkText);
    expect(link).toHaveAttribute("href", href);
  });

  it("with prefix icon", () => {
    render(<Button iconBefore={CalendarSVG}>With prefix icon</Button>);
    const icon = screen.getByTestId("prefix-icon");

    expect(icon).toBeInTheDocument();
  });

  it("with suffix icon", () => {
    render(<Button iconAfter={CalendarSVG}>With suffix icon</Button>);

    const icon = screen.getByTestId("suffix-icon");

    expect(icon).toBeInTheDocument();
  });

  it("with prefix icon with props", () => {
    render(
      <Button
        iconBefore={MockSvgIcon}
        iconBeforeProps={{ "aria-hidden": true, className: "custom-icon" }}
      >
        Save
      </Button>,
    );
    const icon = screen.getByTestId("prefix-icon");

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("eg-button__icon", "custom-icon");
  });

  it("with suffix icon with props", () => {
    render(
      <Button
        iconAfter={MockSvgIcon}
        iconAfterProps={{ "aria-hidden": true, className: "custom-icon" }}
      >
        Save
      </Button>,
    );

    const icon = screen.getByTestId("suffix-icon");

    expect(icon).toHaveClass("eg-button__icon", "custom-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("matches snapshot", () => {
    const { container } = render(<Button>Test button</Button>);

    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with all props", () => {
    const { container } = render(
      <Button
        id="my-button"
        className="my-class"
        color="primary"
        variant="solid"
        size="lg"
        noGutters
        block
        rounded
        active
      >
        Test button
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });
});
