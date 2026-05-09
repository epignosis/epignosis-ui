import { render } from "../../test-utils/render";
import Loader from "./Loader";

describe("<Loader>", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<Loader />);
    const loader = getByTestId("loader");

    expect(loader).toBeInTheDocument();
    expect(loader).toBeVisible();
  });

  it("matches snapshot", () => {
    const { container } = render(<Loader id="main-loader" className="loader" size="lg" />);

    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with fullscreen", () => {
    const { container } = render(<Loader fullScreen />);

    expect(container).toMatchSnapshot();
  });
});
