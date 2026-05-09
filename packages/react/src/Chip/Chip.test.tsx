import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import { render, screen } from "../../test-utils/render";
import Chip from "./Chip";

describe("<Chip />", () => {
  it("renders without close button", () => {
    const chipTxt = faker.lorem.word();

    render(<Chip>{chipTxt}</Chip>);
    const tag = screen.getByText(chipTxt);

    expect(tag).toHaveTextContent(chipTxt);
  });

  it("renders with close button", async () => {
    const chipTxt = faker.lorem.word();
    const mockFn = vi.fn();

    render(<Chip onClose={mockFn}>{chipTxt}</Chip>);

    const tag = screen.getByText(chipTxt);
    const closeBtn = screen.getByTestId("close-filter");

    await userEvent.click(closeBtn);

    expect(tag).toHaveTextContent(chipTxt);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const { container } = render(
      <Chip
        id="my-id"
        className="my-class"
        size="md"
        style={{ backgroundColor: "purple", color: "white" }}
        onClose={vi.fn()}
      >
        This is a chip
      </Chip>,
    );

    expect(container).toMatchSnapshot();
  });
});
