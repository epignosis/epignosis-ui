import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { render, screen } from "../../test-utils/render";
import Tooltip from "./Tooltip";

describe("<Tooltip />", () => {
  it("renders content and arrow on hover", async () => {
    const contentTxt = faker.lorem.word();

    render(
      <Tooltip content={contentTxt}>
        <button>Hover me</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByText("Hover me"));

    expect(screen.getByText(contentTxt)).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-arrow")).toBeInTheDocument();
  });

  it("hides arrow when showArrow is false", async () => {
    const contentTxt = faker.lorem.word();

    render(
      <Tooltip content={contentTxt} showArrow={false}>
        <button>Hover me</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByText("Hover me"));

    expect(screen.queryByTestId("tooltip-arrow")).not.toBeInTheDocument();
  });

  it("matches snapshot", async () => {
    const { baseElement } = render(
      <Tooltip content="Tip content" placement="top" maxWidth={200}>
        <button>Hover me</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByText("Hover me"));

    expect(baseElement).toMatchSnapshot();
  });
});
