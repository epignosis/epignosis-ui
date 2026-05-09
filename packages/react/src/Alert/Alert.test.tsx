import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import { CalendarSVG } from "@epignosis_llc/ui-icons";
import { render, screen } from "../../test-utils/render";
import Alert from "./Alert";

describe("<Alert>", () => {
  it("renders correctly", async () => {
    const heading = faker.lorem.word();
    const paragraphTxt = faker.lorem.paragraph();
    const mockedOnClose = vi.fn();

    render(
      <Alert type="info" onClose={mockedOnClose}>
        <h3>{heading}</h3>
        <p>{paragraphTxt}</p>
      </Alert>,
    );
    const title = screen.getByText(heading);
    const paragraph = screen.getByText(paragraphTxt);
    const closeLink = screen.getByRole("button");
    const icon = screen.getByTestId("icon");

    expect(title).toHaveTextContent(heading);
    expect(paragraph).toHaveTextContent(paragraphTxt);
    expect(icon).toBeInTheDocument();
    await userEvent.click(closeLink);
    expect(mockedOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders correctly with custom icon", () => {
    render(
      <Alert type="info" icon={CalendarSVG}>
        {faker.lorem.paragraph()}
      </Alert>,
    );
    const icon = screen.getByTestId("icon");

    expect(icon).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <Alert id="alert" className="my-class" type="info">
        <h3>Welcome</h3>
        <p>My content!</p>
      </Alert>,
    );

    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with custom icon", () => {
    const { container } = render(
      <Alert type="info" icon={CalendarSVG}>
        <p>My content!</p>
      </Alert>,
    );

    expect(container).toMatchSnapshot();
  });
});
